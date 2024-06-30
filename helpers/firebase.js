const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
    apiKey: "AIzaSyBd-qP5OjdPgPUNj4nstCgmbWIEXtTJYns",
    authDomain: "stock-tracking-7d068.firebaseapp.com",
    projectId: "stock-tracking-7d068",
    storageBucket: "stock-tracking-7d068.appspot.com",
    messagingSenderId: "171629594613",
    appId: "1:171629594613:web:4f92a1352d2515807e42bc"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { app, storage };