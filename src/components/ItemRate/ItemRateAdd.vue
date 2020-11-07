<template>
    <v-card>
        <v-card-title>Novo item</v-card-title>
        <v-card-text>
            <v-form v-model="valid" ref="form">
                <v-text-field
                    v-model="desc"
                    label="Descrição"
                    hide-details="auto"
                ></v-text-field>
                <v-file-input
                    v-model="file"
                    :rules="rules"
                    accept="image/png, image/jpeg"
                    prepend-icon="mdi-file-image"
                    label="Imagem"
                ></v-file-input>                
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn
            fab
            dark
            small
            color="primary"
            class="ml-auto" @click="create()">
            <v-icon dark>
                mdi-plus
            </v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import Vue from 'vue'
import { firebase, collectionRef } from '../../config/firebase'
export default {
    name: 'ItemRateAdd',
    props: {
        rateId: String,
        item: Object
    },
    data() {
        return {
            valid: false,
            desc: '',
            file: null,
            rateItemsRef: collectionRef('RateItems'),
            rules: [
                value => !!value || 'Obrigatório.',
                value => !value || value.size < 1000000 || 'A imagem de ter menos de 1 MB!',
            ],
            // rateMatchesRef: collectionRef('RateMatches')
        }
    },
    methods: {
        create() {
            this.rateItemsRef.add({
                desc: this.desc,
                rateId: this.rateId,
                uidUser: Vue.prototype.$user.uid,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                votes: 0
            }).then(snap => {
                //this.createMatches(snap.id);
                var imagePath = this.rateId + "/" + snap.id;
                var fileRef = firebase.storage().ref(imagePath);
                fileRef.put(this.file).then(()=>{
                    this.rateItemsRef.doc(snap.id).update({
                        imagePath: imagePath
                    })
                });
                this.$refs.form.reset();
            });
        }
        /* createMatches(itemId) {
            this.rateItemsRef.where('rateId', '==', this.rateId).get().then(coll => {
                coll.forEach(doc => {
                    if(doc.id != itemId){
                        var match = {};
                        match[itemId] = true;
                        match[doc.id] = true;
                        match.rateId = this.rateId,
                        this.rateMatchesRef.add(match);
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());
                    }
                });
            });
        } */
    }
}
</script>

<style>



</style>