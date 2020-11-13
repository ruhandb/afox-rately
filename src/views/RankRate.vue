<template>
  <v-card class="mx-auto" max-width="500">
    <v-toolbar color="indigo" dark>
      <v-toolbar-title>{{ name }}</v-toolbar-title>
    </v-toolbar>

    <v-list subheader>
      <v-subheader>MAIS VOTADOS</v-subheader>

      <template v-for="(item, idx) in rankedItems">
        <v-list-item :key="idx">
          <v-list-item-icon>
            <v-icon v-if="idx < 3" :color="medalColors[idx]" x-large>
              mdi-medal
            </v-icon>
            <v-chip v-else outlined>{{ idx + 1 }}º</v-chip>
          </v-list-item-icon>
          <v-list-item-avatar tile :size="idx < 3 ? 75 : 50">
            <v-img :src="item.imgUrl"></v-img>
          </v-list-item-avatar>

          <v-list-item-content class="ml-3">
            <v-list-item-title v-text="item.desc"></v-list-item-title>
          </v-list-item-content>

          <v-chip
            close
            close-icon="mdi-heart"
            text-color="white"
            color="green"
            >{{ item.votes }}</v-chip
          >
        </v-list-item>
        <v-divider
          v-if="idx + 1 < rankedItems.length"
          :key="idx + 'd'"
        ></v-divider>
      </template>
    </v-list>
  </v-card>
</template>

<script>
import Vue from "vue";
import {
  /* firebase, */ onSnapshot,
  collectionRef,
  storageUrl,
} from "./../config/firebase";
export default {
  name: "VoteRate",
  data() {
    return {
      rateId: "",
      name: "",
      items: {},
      rankedItems: [],
      ratesRef: collectionRef("Rates"),
      rateItemsRef: collectionRef("RateItems"),
      medalColors: ["amber accent-2", "grey lighten-1", "orange accent-3"],
    };
  },
  mounted() {
    if (Vue.prototype.$queryParams.id) {
      this.rateId = Vue.prototype.$queryParams.id;
      this.bind();
    } else {
      window.location.pathname = "/not-found";
    }
  },
  methods: {
    bind() {
      this.ratesRef
        .doc(this.rateId)
        .get()
        .then((snap) => {
          if (snap.exists) {
            var data = snap.data();
            this.name = data.name;
            this.loadItems();
          } else {
            window.location.pathname = "/not-found";
          }
        });
    },
    loadItems() {
      onSnapshot(
        this.rateItemsRef.where("rateId", "==", this.rateId),
        this.items,
        (change) => {
          if (change.type === "added" || change.type === "modified") {
            storageUrl(this.rateId + "/" + change.doc.id).then((url) => {
              Vue.set(this.items[change.doc.id], "imgUrl", url);
            });
          }
          this.rankedItems = Object.entries(this.items)
            .map((entry) => {
              const [key, value] = entry;
              value.key = key;
              return value;
            })
            .sort((a, b) => b.votes - a.votes);
        }
      );
    },
  },
};
</script>

<style>
</style>