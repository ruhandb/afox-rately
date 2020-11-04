<template>
    <div>
        <div>
            <label>Descrição: </label>
            <input type="text" v-model="desc" >
        </div>
        <div>
            <label>Arquivo: </label>
            <input type="file" @change="upload($event.target.files)" >
        </div>
        <div>
            <button @click="create()">Salvar</button>
        </div>
    </div>
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
            desc: '',
            file: false,
            rateItemsRef: collectionRef('RateItems')
            // rateMatchesRef: collectionRef('RateMatches')
        }
    },
    methods: {
        upload(files){
            files.forEach((file) => {
                this.file = file;
            });
        },
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