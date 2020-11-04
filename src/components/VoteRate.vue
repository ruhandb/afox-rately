<!--template>
    <div>
        <div>VoteRate</div>
        <div>{{ name }}</div>
        <button @click="requestVote">next</button>
        <div>
            {{ matchToVote.matchId }}
            <div v-for="(item, itemName) in matchToVote.items" :key="itemName">
                <img :src="item.imgUrl"/>
                <button @click="vote(matchToVote, itemName)">VOTE</button>
            </div>
        </div>
    </div>
    
</template-->

<template>
    <v-app>
        <v-card
            class="mx-auto"
        >
        <!--v-system-bar
            color="indigo darken-2"
            dark
        >
            <v-spacer></v-spacer>

            <v-icon>mdi-window-minimize</v-icon>

            <v-icon>mdi-window-maximize</v-icon>

            <v-icon>mdi-close</v-icon>
        </v-system-bar-->

        <v-toolbar
            color="indigo"
            dark
        >
            <v-app-bar-nav-icon></v-app-bar-nav-icon>

            <v-toolbar-title>{{ name }}</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
            </v-btn>
        </v-toolbar>

        <v-container fluid>
            <v-row dense>
            <v-col
                v-for="(item, itemName) in matchToVote.items" :key="itemName"
                cols="6"
            >
                <v-card>
                <v-img
                    :src="item.imgUrl"
                    class="white--text align-end"              
                    contain
                    height="256px"
                    width="256px" 
                >
                <!-- img gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"-->
                    <!--v-card-title v-text="card.title"></v-card-title-->
                </v-img>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn icon>
                    <v-icon @click="vote(matchToVote, itemName)">mdi-heart</v-icon>
                    </v-btn>
                </v-card-actions>
                </v-card>
            </v-col>
            </v-row>
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
                    this.loadMatches();
                    this.loadMyVotes();
                } else {
                    window.location.pathname = '/not-found';
                }
            })
        },
        loadMatches(){            
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

            if(Object.values(this.matchesToVote).length == 0) {
                this.matchToVote.matchId = null;
                Vue.set(this.matchToVote, 'items', {});
            } else {
                //this.requestVote();
            }
        },
        requestVote(){
            var matchesKeys = Object.keys(this.matchesToVote);
            var totalVotes = matchesKeys.length;
            var ramdomidx = this.getRandomInt(0, totalVotes - 1);
            console.log("ramdomidx", ramdomidx);
            var match = this.matchesToVote[matchesKeys[ramdomidx]];
            
            this.matchToVote.matchId = matchesKeys[ramdomidx];
            var that = this;
            //Vue.set(this.matchToVote, 'items', {});
            console.log("match", match);
            if(match){
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