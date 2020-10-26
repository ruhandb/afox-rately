<template>
  <div>CreateRate
      <div>
          <label>Nome:</label>
          <input v-model="name">
          <button @click="create">Add</button>
      </div>
  </div>
  
</template>

<script>
import firebase from '../config/firebase'
export default {
    name: "CreateRate",
    data() {
        return { name: '' };
    },
    methods: {
        create() {
            var that = this;
            firebase.firestore().collection("Rates").add({
                name: that.name,
                dateCreated: firebase.firestore.Timestamp.fromDate(new Date())
            });
        }
    }
}
</script>

<style>

</style>