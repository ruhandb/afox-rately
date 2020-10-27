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
import firebase from '../config/firebase'
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
            ref: false
        }
    },
    mounted (){
        this.ref = firebase.firestore().collection('Rates');
    },
    methods: {
        upload(files){
            files.forEach((file) => {
                this.file = file;
            });
        },
        create() {
            var itensRef = this.ref.doc(this.rateId).collection('Itens');
            itensRef.add({
                desc : this.desc,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(snap => {
                var imagePath = this.rateId + "/" + snap.id;
                var fileRef = firebase.storage().ref(imagePath);
                fileRef.put(this.file).then(()=>{
                    itensRef.doc(snap.id).update({
                        imagePath: imagePath
                    })
                });
            });
        }
    }
}
</script>

<style>



</style>