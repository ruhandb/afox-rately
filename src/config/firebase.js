
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyDxmlCVEui9cUkzipZlTP8wE7V0ISpxB6M",
    authDomain: "afox-rately.firebaseapp.com",
    databaseURL: "https://afox-rately.firebaseio.com",
    projectId: "afox-rately",
    storageBucket: "afox-rately.appspot.com",
    messagingSenderId: "849797888211",
    appId: "1:849797888211:web:74f4172c30094dc3de7c26"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;