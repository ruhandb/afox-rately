<template>
    <v-app>
        <v-card class="mx-auto">
            <v-toolbar color="indigo" dark>
                <!--v-app-bar-nav-icon></v-app-bar-nav-icon-->
                <v-toolbar-title class="mx-auto">{{ name }}</v-toolbar-title>
                <!-- <v-spacer></v-spacer> -->
                <!--v-btn icon>
                <v-icon>mdi-magnify</v-icon>
                </v-btn-->
            </v-toolbar>
            <v-container fluid>
                <v-row v-if="votesProgress.voting" dense>
                    <v-col cols="6" >
                        <v-card :loading="!matchToVote.items.A" :disabled="!matchToVote.items.A">
                            <v-img :src="matchToVote.items.A ? matchToVote.items.A.imgUrl :''" contain
                                class="white--text align-end"
                                height="200px" width="200px"></v-img>
                            <v-card-actions>
                                <v-btn class="mx-auto" icon>
                                    <v-icon @click="vote(matchToVote, 'A')">mdi-heart</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                    <v-col cols="6" >
                        <v-card :loading="!matchToVote.items.B" :disabled="!matchToVote.items.B">
                            <v-img :src="matchToVote.items.B ? matchToVote.items.B.imgUrl :''" contain
                                class="white--text align-end"
                                height="200px" width="200px"></v-img>
                            <v-card-actions>
                                <v-btn class="mx-auto" icon>
                                    <v-icon @click="vote(matchToVote, 'B')">mdi-heart</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row v-else dense>
                    <v-col cols="12" >

                    </v-col>
                </v-row>
                <v-progress-linear rounded  :value="votesProgress.percent" height="20">
                    <strong>{{ Math.ceil(votesProgress.percent) }}%</strong>
                </v-progress-linear>
            </v-container>
        </v-card>
    </v-app>
</template>

<script>
import Vue from 'vue'
import { firebase, onSnapshot, collectionRef, storageUrl } from '../config/firebase'
export default {
    name: "VoteRate",
    data() {
        return {
            name: '',
            rateId: '',
            votesProgress:{
                total: 0,
                atual: 0,
                percent: 0
            },
            matchToVote: {
                matchId: null,
                items:{}
            },
            items: {},
            myVotes: {},
            matchesToVote: {},
            ratesRef: collectionRef("Rates"),
            rateItemsRef: collectionRef('RateItems'),
            rateVotesRef: collectionRef('RateVotes')
        }
    },
    mounted() {
        if (Vue.prototype.$queryParams.id) {
            this.rateId = Vue.prototype.$queryParams.id;
            this.bind();
        }else{
            window.location.pathname = '/not-found';
        }
        window.setTimeout(this.requestVote, 3000);
    },
    methods:{
        bind(){
            this.ratesRef.doc(this.rateId).get().then(snap => {
                if (snap.exists) {
                    var data = snap.data();
                    this.name = data.name;
                    this.loadItems();
                    this.loadMyVotes();
                } else {
                    window.location.pathname = '/not-found';
                }
            })
        },
        loadItems(){            
            onSnapshot(this.rateItemsRef.where('rateId', '==', this.rateId), this.items,
                () => {
                    this.createMatchesToVote();
                });
        },
        loadMyVotes(){
            onSnapshot(this.rateVotesRef.where('uidUser', '==', Vue.prototype.$user.uid).where('rateId', '==', this.rateId), this.myVotes,
                () => {
                    this.createMatchesToVote();
                });
        },
        vote(match, itemName){
            const increment = firebase.firestore.FieldValue.increment(1);
            var itemId =  match.items[itemName].itemId;
            //const decrement = firebase.firestore.FieldValue.increment(-1);


            firebase.firestore().runTransaction(transaction => {
                return transaction.get(this.rateVotesRef.doc(Vue.prototype.$user.uid + '-' + match.matchId)).then(vote => {
                    if (!vote.exists) {
                        transaction.set(this.rateVotesRef.doc(Vue.prototype.$user.uid + '-' + match.matchId), {
                            'uidUser': Vue.prototype.$user.uid,
                            'rateId': this.rateId,
                            'matchId': match.matchId,
                            'itemId': itemId,
                            'vote': 1
                        });
                        transaction.update(this.rateItemsRef.doc(itemId), { votes: increment });
                   }
               })
           }).then(()=>{
               this.matchToVote.matchId = null;
               Vue.set(this.matchToVote, 'items', {});
               window.setTimeout(this.requestVote, 2000);
           });
        },
        createMatchesToVote() {
            this.matchesToVote = {};

            var matches = {};

            Object.entries(this.items).forEach(item1 => {
                // eslint-disable-next-line no-unused-vars
                const [key1, value1] = item1;
                Object.entries(this.items).forEach(item2 => {
                    // eslint-disable-next-line no-unused-vars
                    const [key2, value2] = item2;
                    if (key1 != key2) {
                        const mKey = [key1, key2].sort().join(''); 
                        matches[mKey] = {};
                        matches[mKey][key1] = true;
                        matches[mKey][key2] = true;
                    }
                });
            });

            Object.entries(matches).forEach(mEntry => {
                const [mKey, mValue] = mEntry;
                Vue.set(this.matchesToVote, mKey, mValue);
                Object.values(this.myVotes).forEach(vValue => {
                    Vue.delete(this.matchesToVote, vValue.matchId);                
                });
            });
            this.votesProgress.total = Object.keys(matches).length;
            this.votesProgress.atual = Object.keys(this.matchesToVote).length;
            this.votesProgress.voting = Object.keys(this.matchesToVote).length != 0;
            this.votesProgress.percent = 100 - (this.votesProgress.atual / this.votesProgress.total * 100);
            console.log("votesProgress", this.votesProgress);


            if(Object.values(this.matchesToVote).length == 0) {
                this.matchToVote.matchId = null;
                Vue.set(this.matchToVote, 'items', {});
            } else {
                //this.requestVote();
            }
        },
        requestVote(){
            if(this.votesProgress.voting) {
                var matchesKeys = Object.keys(this.matchesToVote);
                var totalVotes = matchesKeys.length;
                var ramdomidx = this.getRandomInt(0, totalVotes - 1);
                console.log("ramdomidx", ramdomidx);
                var match = this.matchesToVote[matchesKeys[ramdomidx]];
                
                this.matchToVote.matchId = matchesKeys[ramdomidx];
                var that = this;
                //Vue.set(this.matchToVote, 'items', {});
                console.log("match", match);
            //if(match){
                Object.keys(match).filter(k => k != "rateId").forEach(itemId => {
                    storageUrl(this.rateId + "/" + itemId).then(url => {
                        if(Object.values(this.matchesToVote).length > 0){
                            var itemName = "A"
                            if (that.matchToVote.items[itemName]) {
                                itemName = "B"
                            }
                            Vue.set(that.matchToVote.items, itemName, {
                                itemId: itemId,
                                imgUrl: url
                            });
                        }
                    })
                });
            } else {
                window.setTimeout(this.requestVote, 2000);
            }
        },
        getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
}
</script>

<style>

</style>