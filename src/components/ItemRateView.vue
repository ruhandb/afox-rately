<template>
    <div>
        <div>
            <img :src="imageUrl"/>
        </div>
        <div>
            <label>{{item.desc}}</label>
        </div>
        <div>
            <button @click="remove()">Excluir</button>
        </div>
    </div>
</template>

<script>
import firebase from '../config/firebase'
export default {
    name: 'ItemRateView',
    props: {
        rateId: String,
        itemId: String,
        item: Object
    },
    data() {
        return {
            imageUrl: '',
            ref: false
        }
    },
    mounted (){
        this.ref = firebase.firestore().collection('Rates');
        
    },
    watch: { 
        item(newVal) {
            if (newVal.imagePath) {
                firebase.storage().ref(newVal.imagePath).getDownloadURL().then(url =>{
                    this.imageUrl = url;
                });
            }
        }
    },
    methods: {
        remove() {
            this.ref.doc(this.rateId).collection('Itens').doc(this.itemId).delete().then(() => {
                firebase.storage().ref(this.item.imagePath).delete();
                console.log("Document successfully deleted!");
            });
        }
    }
}
</script>

<style>

</style>