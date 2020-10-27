<template>
  <div>CreateRate
      <div>
          <label>Nome:</label>
          <input v-model="name">
          <button @click="create">Add</button>
          
      </div>
    <div>
        <ItemRateAdd :rateId="id" />
        <ItemRateView v-for="(item, itemId) in itens" :rateId="id" :item="item" :itemId="itemId" :key="itemId" />
    </div>
  </div>
  
</template>

<script>
import Vue from 'vue'
import firebase from '../config/firebase'
import ItemRateAdd from './ItemRateAdd'
import ItemRateView from './ItemRateView'
export default {
    name: "CreateRate",
    components: { ItemRateAdd, ItemRateView },
    data() {
        return {
            id: '',
            name: '',
            itens: {}
        };
    },
    methods: {
        create() {
            var that = this;
            firebase.firestore().collection("Rates").add({
                name: that.name,
                dateCreated: firebase.firestore.Timestamp.fromDate(new Date())
            }).then(snap => {
                this.id = snap.id;
                console.log("Created!");
                this.bindItems();
            });
        },
        bindItems() {
            firebase.firestore().collection("Rates").doc(this.id).collection("Itens")
                .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        console.log(change);
                        if (change.type === "added") {
                            console.log("New: " + change.doc.id , change.doc.data());
                            Vue.set(this.itens, change.doc.id, change.doc.data());
                        }
                        if (change.type === "modified") {
                            console.log("Modified: " + change.doc.id, change.doc.data());
                            Vue.set(this.itens, change.doc.id, change.doc.data());
                        }
                        if (change.type === "removed") {
                            console.log("Removed: " + change.doc.id, change.doc.data());
                            Vue.delete(this.itens, change.doc.id);
                        }
                    });
                });
        }
    }
}
</script>

<style>
img {
    max-height: 140px;
    max-width: 252px;
}
</style>