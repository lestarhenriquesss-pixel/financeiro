import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyDdc_AgXkJJ0hTFCFP12xHnT3ZnxnWuhwc",
  authDomain: "casinha-financas.firebaseapp.com",
  projectId: "casinha-financas",
  storageBucket: "casinha-financas.firebasestorage.app",
  messagingSenderId: "492024583850",
  appId: "1:492024583850:web:fe1123586746c4366e62d3"
};

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

const db = getFirestore(app)

export {
    auth,
    db
}