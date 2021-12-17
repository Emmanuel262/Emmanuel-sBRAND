// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAGDSL3y05t5zUmpih3hiPWRjNmquAq1HU",
  authDomain: "emmanuel-koestne-brand.firebaseapp.com",
  projectId: "emmanuel-koestne-brand",
  storageBucket: "emmanuel-koestne-brand.appspot.com",
  messagingSenderId: "140515107012",
  appId: "1:140515107012:web:b053a2c052e33b4ebb6991",
  measurementId: "G-6PG5YSM5CP",
};
firebase.initializeApp(firebaseConfig);

// make auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();

// update firestore settings
db.settings({ timestampsInSnapshots: true });
