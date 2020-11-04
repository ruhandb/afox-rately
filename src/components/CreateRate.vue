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
import { firebase, onSnapshot, collectionRef } from '../config/firebase'
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
            ratesRef: collectionRef("Rates"),
            rateItemsRef: collectionRef('RateItems'),
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
            this.ratesRef.doc(id).get().then(snap => {
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
            this.ratesRef.add({
                name: that.name,
                uidUser: Vue.prototype.$user.uid,
                dateCreated: firebase.firestore.Timestamp.fromDate(new Date())
            }).then(snap => {
                this.id = snap.id;
                console.log("Created!");
                this.createMode = false;
                this.bindItems();
            });
        },
        bindItems() {
            onSnapshot(this.rateItemsRef.where('rateId', '==', this.id), this.itens);
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