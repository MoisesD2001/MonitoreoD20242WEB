// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3dpydVDlb57LCajh4fZURNpTfLcRGmGw",
  authDomain: "monitoreo-d-2024-2.firebaseapp.com",
  databaseURL: "https://monitoreo-d-2024-2-default-rtdb.firebaseio.com",
  projectId: "monitoreo-d-2024-2",
  storageBucket: "monitoreo-d-2024-2.appspot.com",
  messagingSenderId: "395288746126",
  appId: "1:395288746126:web:8834ddd36b8fea9f6911df"
};

import {
  getDatabase, ref , set, update as dataUpdate , remove, get, onValue
} from 'firebase/database'

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const A = ref(db, "variables/a")

onValue(A, (sanpshot) => {
    console.log(sanpshot.val());
    const out1 = document.getElementById("output1");
    var num_a = sanpshot.val(); 
    out1.innerHTML = num_a; 
  });  