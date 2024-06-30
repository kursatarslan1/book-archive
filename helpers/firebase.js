const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyC6-lkjHbyoAf1zBRWfzwEItrIX4zy6gEI",
  authDomain: "book-archive-b5fcd.firebaseapp.com",
  projectId: "book-archive-b5fcd",
  storageBucket: "book-archive-b5fcd.appspot.com",
  messagingSenderId: "241340650014",
  appId: "1:241340650014:web:c164892a6efb2312e0d40f"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { app, storage };