<template>
  <v-card class="mx-auto">
    <v-card-title>Editar Rate</v-card-title>
    <v-card-text>
      <!-- <v-row>
        <v-col cols="12">
          <GoogleAds adSlot="7361262926"></GoogleAds>
        </v-col>
      </v-row> -->
      <v-row>
        <v-col cols="12">
          <v-form ref="form">
            <v-text-field
              v-model="name"
              label="Nome"
              :readonly="!createMode"
              hide-details="auto"
            ></v-text-field>
          </v-form>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn v-if="createMode" @click="create">Criar</v-btn>
          <v-btn v-else-if="!iniciada" @click="iniciar">Iniciar votação</v-btn>
          <v-btn v-else :href="'/vote/' + id" text color="primary">Votar</v-btn>
        </v-col>
      </v-row>
      <v-row v-if="!!id">
        <v-col class="d-flex justify-center flex-wrap">
          <ItemRateAdd :rateId="id" class="mx-1 mb-5" />
          <ItemRateView
            v-for="(item, itemId) in itens"
            :key="itemId"
            :rateId="id"
            :item="item"
            :itemId="itemId"
            :iniciada="iniciada"
            class="mx-1 mb-5"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from "vue";
import { firebase, onSnapshot, collectionRef } from "./../config/firebase";
import ItemRateAdd from "./../components/ItemRate/ItemRateAdd";
import ItemRateView from "./../components/ItemRate/ItemRateView";
/* import GoogleAds from "./Util/GoogleAds"; */

export default {
  name: "CreateRate",
  components: { ItemRateAdd, ItemRateView /* GoogleAds */ },
  data() {
    return {
      createMode: true,
      iniciada: false,
      id: null,
      name: "",
      ratesRef: collectionRef("Rates"),
      rateItemsRef: collectionRef("RateItems"),
      itens: {},
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
      this.ratesRef
        .doc(id)
        .get()
        .then((snap) => {
          if (snap.exists) {
            var data = snap.data();
            this.id = id;
            this.name = data.name;
            this.iniciada = data.iniciada;
            this.bindItems();
          } else {
            window.location.pathname = Vue.prototype.$currentRoute;
          }
        });
    },
    create() {
      var that = this;
      this.ratesRef
        .add({
          name: that.name,
          uidUser: Vue.prototype.$user.uid,
          iniciada: false,
          dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
        })
        .then((snap) => {
          this.id = snap.id;
          console.log("Created!");
          this.createMode = false;
          this.bindItems();
        });
    },
    iniciar() {
      this.iniciada = true;
      this.ratesRef.doc(this.id).update({ iniciada: this.iniciada });
    },
    bindItems() {
      onSnapshot(this.rateItemsRef.where("rateId", "==", this.id), this.itens);
    },
  },
};
</script>

<style>
img {
  max-height: 140px;
  max-width: 252px;
}
</style>