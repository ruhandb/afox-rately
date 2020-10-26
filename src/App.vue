<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <CreateRate />
    <button @click="test">Test</button>
  </div>
</template>

<script>
import CreateRate from './components/CreateRate.vue'
import firebase from './config/firebase'

export default {
  name: 'App',
  components: {
    CreateRate
  },
  methods: {
    test: () => {
      firebase.firestore().collection("teste").add({date: new Date()});
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
