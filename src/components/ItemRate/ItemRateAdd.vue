<template>
  <v-card width="200px">
    <v-img
      v-if="!!file"
      :src="imgSrc"
      contain
      class="white--text align-end mx-auto"
      height="200px"
      width="200px"
    ></v-img>
    <div style="height: 200px"
      v-else
      width="200px"
      class="d-flex justify-center align-center"
    >
      <v-file-input
        width="0%"
        v-model="file"
        hide-input
        :rules="rules"
        accept="image/png, image/jpeg, image/webp"
        prepend-icon="mdi-image-plus"
        class="d-flex justify-center pt-0 mt-0 ml-2"
        @change="change"
      ></v-file-input>
    </div>
    <v-divider></v-divider>
    <v-card-text>Selecione uma Imagem</v-card-text>
    <v-fab-transition>
      <v-btn
        v-show="!!file"
        color="error"
        fab
        dark
        x-small
        absolute
        bottom
        center
        @click="file = null"
        class="mr-10"
      >
        <v-icon>mdi-file-undo</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn
            v-show="!!file"
            color="primary"
            fab
            dark
            x-small
            absolute
            bottom
            center
            v-bind="attrs"
            v-on="on"
            class="ml-10"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <v-card>
        <!-- <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title> -->
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  label="Descrição da imagem"
                  v-model="desc"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Cancelar
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="
              create();
              dialog = false;
            "
          >
            Adicionar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import Vue from "vue";
import { firebase, collectionRef } from "../../config/firebase";
export default {
  name: "ItemRateAdd",
  props: {
    rateId: String,
    item: Object,
  },
  data() {
    return {
      valid: false,
      desc: "",
      file: null,
      imgSrc: "",
      rateItemsRef: collectionRef("RateItems"),
      rules: [
        /* (value) => !!value || "Obrigatório.", */
        (value) =>
          !value || value.size < 1000000 || "A imagem de ter menos de 1 MB!",
      ],
      dialog: false,
      // rateMatchesRef: collectionRef('RateMatches')
    };
  },
  methods: {
    change(file) {
      var fileReader = new FileReader();
      fileReader.addEventListener("load", (e) => {
        this.imgSrc = e.target.result;
      });
      fileReader.readAsDataURL(file);
    },
    create() {
      this.rateItemsRef
        .add({
          desc: this.desc,
          rateId: this.rateId,
          uidUser: Vue.prototype.$user.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          votes: 0,
        })
        .then((snap) => {
          //this.createMatches(snap.id);
          var imagePath = this.rateId + "/" + snap.id;
          var fileRef = firebase.storage().ref(imagePath);
          fileRef.put(this.file).then(() => {
            this.rateItemsRef.doc(snap.id).update({
              imagePath: imagePath,
            });
          });
          this.file = null;
        });
    },
  },
};
</script>

<style>
</style>