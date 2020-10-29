<template>
  <div>CreateRate
      <div>{{ id }}</div>
      <div>
          <label>Nome:</label>
          <input :disabled="!createMode" v-model="name">
          <button v-if="createMode" @click="create">Add</button>          
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
import ItemRateAdd from './ItemRate/ItemRateAdd'
import ItemRateView from './ItemRate/ItemRateView'
export default {
    name: "CreateRate",
    components: { ItemRateAdd, ItemRateView },
    data() {
        return {
            createMode: true,
            id: '',
            name: '',
            itens: {}
        };
    },
    mounted() {
        //console.log(Vue.prototype.$queryParams);
        if (Vue.prototype.$queryParams.id) {
            this.createMode = false;
            this.bind(Vue.prototype.$queryParams.id);
        }
    },
    methods: {
        bind(id) {
            firebase.firestore().collection("Rates").doc(id).get().then(snap => {
                if (snap.exists) {
                    var data = snap.data();
                    this.id = id;
                    this.name = data.name;
                    this.bindItems();                    
                } else {
                    window.location.pathname = Vue.prototype.$currentRoute;
                }
            })
        },
        create() {
            var that = this;
            firebase.firestore().collection("Rates").add({
                name: that.name,
                dateCreated: firebase.firestore.Timestamp.fromDate(new Date())
            }).then(snap => {
                this.id = snap.id;
                console.log("Created!");
                this.createMode = false;
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