import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import Vue from "vue";
import { Promise } from "core-js";

var firebaseConfig = {
  apiKey: "AIzaSyDxmlCVEui9cUkzipZlTP8wE7V0ISpxB6M",
  authDomain: "afox-rately.firebaseapp.com",
  databaseURL: "https://afox-rately.firebaseio.com",
  projectId: "afox-rately",
  storageBucket: "afox-rately.appspot.com",
  messagingSenderId: "849797888211",
  appId: "1:849797888211:web:74f4172c30094dc3de7c26",
  measurementId: "G-59Y2BNQJN1",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var listenerCount;
var rqCount = 0;
var requestCounter = (then) => {
  listenerCount = then;
};

var onSnapshot = (ref, obj, then) => {
  ref.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      rqCount++;
      if (listenerCount) listenerCount(rqCount);
      Vue.prototype.$requestsCount++;
      if (change.type === "added") {
        Vue.set(obj, change.doc.id, change.doc.data());
      }
      if (change.type === "modified") {
        Vue.set(obj, change.doc.id, change.doc.data());
      }
      if (change.type === "removed") {
        Vue.delete(obj, change.doc.id);
      }
      if (then) then(change);
    });
  });
};

var findAll = (ref, obj, then) => {
  ref.get().then((items) => {
    items.forEach((item) => {
      rqCount++;
      if (listenerCount) listenerCount(rqCount);
      Vue.set(obj, item.id, item.data());
    });
    if (then) then(items);
  });
};

var collectionRef = (nameCollection) => {
  return firebase.firestore().collection(nameCollection);
};

var cacheUrl = {};
var storageUrl = (path) => {
  var url = cacheUrl[path];
  return new Promise(function(resolve) {
    if (url) {
      resolve(url);
    } else {
      firebase
        .storage()
        .ref(path)
        .getDownloadURL()
        .then((u) => {
          cacheUrl[path] = u;
          resolve(u);
        });
    }
  });
};

export {
  firebase,
  onSnapshot,
  collectionRef,
  storageUrl,
  findAll,
  requestCounter,
};
