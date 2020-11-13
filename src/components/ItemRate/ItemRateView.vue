<template>
  <v-card width="200px">
    <v-img
      :src="imageUrl"
      contain
      class="white--text align-end mx-auto"
      height="200px"
      width="200px"
    ></v-img>
    <v-divider></v-divider>
    <v-card-text >{{ item.desc }}</v-card-text>
    
    <v-fab-transition v-if="!iniciada">
      <v-btn
        v-show="!!imageUrl"
        color="error"
        fab
        dark
        x-small
        absolute
        bottom
        right
        @click="remove()"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-card>
</template>

<script>
import { firebase, collectionRef, storageUrl } from "../../config/firebase";
export default {
  name: "ItemRateView",
  props: {
    rateId: String,
    itemId: String,
    item: Object,
    iniciada: Boolean,
  },
  data() {
    return {
      imageUrl: "",
      ref: false,
      rateItemsRef: collectionRef("RateItems"),
      //rateMatchesRef: collectionRef('RateMatches')
    };
  },
  mounted() {
    this.loadImage(this.item.imagePath);
  },
  watch: {
    item(newVal) {
      console.log("view", newVal);
      this.loadImage(newVal.imagePath);
    },
  },
  methods: {
    loadImage(imagePath) {
      if (imagePath) {
        storageUrl(imagePath).then((url) => {
          this.imageUrl = url;
        });
      }
    },
    remove() {
      this.rateItemsRef
        .doc(this.itemId)
        .delete()
        .then(() => {
          /* this.rateMatchesRef.orderBy(this.itemId).get().then(snaps => {
                    snaps.forEach(snap => {
                        this.rateMatchesRef.doc(snap.id).delete().then(()=>{
                            console.log('delete matches', snap);
                        });
                    });
                }); */
          firebase.storage().ref(this.item.imagePath).delete();
          console.log("Document successfully deleted!");
        });
    },
  },
};
</script>

<style>
</style>