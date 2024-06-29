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

import {uploadBytes, getStorage, ref as stoRef, uploadBytesResumable, getDownloadURL ,child} from "firebase/storage";

// Initialize Firebase
initializeApp(firebaseConfig)
const db = getDatabase()
const storage = getStorage();

const A = ref(db, "variables/a")
const la_GPS = ref(db, "data/latitude")
const lo_GPS = ref(db, "data/longitude")
const d_London_GPS = ref(db, "data/distance to London")
const firmRef = ref(db, "firmware")

onValue(A, (sanpshot) => {
    console.log(sanpshot.val());
    const out1 = document.getElementById("output1");
    var num_a = sanpshot.val(); 
    out1.innerHTML = num_a; 
});  

onValue(la_GPS, (sanpshot) => {
  console.log(sanpshot.val());
  const out2 = document.getElementById("output2");
  var num_la = sanpshot.val(); 
  out2.innerHTML = num_la; 
});  

onValue(lo_GPS, (sanpshot) => {
  console.log(sanpshot.val());
  const out3 = document.getElementById("output3");
  var num_lo = sanpshot.val(); 
  out3.innerHTML = num_lo; 
});  

onValue(d_London_GPS, (sanpshot) => {
  console.log(sanpshot.val());
  const out4 = document.getElementById("output4");
  var num_d = sanpshot.val(); 
  out4.innerHTML = num_d; 
});  

$(document).ready(function(){
  $("#firmware").change(function () {
      var file = $('#firmware')[0].files[0];    
      readFile(file);
  });
});

$(document).ready(function(){
  $("#firmware_select_ESP32").change(function () {
    var ver = document.getElementById('firmware_select_ESP32').value;    
    uploadVer_ESP32(ver);
  });
});

$(document).ready(function(){
  $("#firmware_select_ES32_CAM").change(function () {
    var ver = document.getElementById('firmware_select_ES32_CAM').value;    
    uploadVer_ESP32_CAM(ver);
    var field = document.getElementById('firmware_select_ESP32_CAM');
    field.value = field.defaultValue;
  });
});

// Read the file chosen by the user.
function readFile(file) {
  // Open the file and start reading it.
  var reader = new FileReader();
  reader.onloadend = function() {      
    readMetadata(file, reader.result);
  }
  reader.readAsArrayBuffer(file);
}
// Extract the version string from the given file data.
function getFirmwareVersion(data) {
  var enc = new TextDecoder("utf-8");
  var s = enc.decode(data);
  console.log(s);
  var re = new RegExp("__MaGiC__ [^_]+__");
  var result = re.exec(s);
  if (result == null) {
    return null;
  }
  return result[0];
}
// Called when we're done reading the file data.
function readMetadata(file, data) {
  var version = getFirmwareVersion(data);
  if (version == null) {
    console.log("Could not extract magic string from binary.");
    return;
  }
  // Upload firmware binary to Firebase Cloud Storage.
  // We use the version string as the filename, since
  // it's assumed to be unique.
  const storageRef = stoRef(storage,"FIRMWARE/" +  version);
  uploadBytes(storageRef,file).then((snapshot)=> {
    // Upload completed. Get the URL. 
      getDownloadURL(storageRef).then(function(url) {
      saveMetadata(file.name, version, url);
    });
  });
}
// Save the metadata to Realtime Database.
function saveMetadata(filename, version, url) {
  var dbRef = ref(db);
  var metadata = {
    // This bit of magic causes Firebase to write the
    // server timestamp when the data is written to the
    // database record.
    dateUploaded: firebase.database.ServerValue.TIMESTAMP,
    filename: filename,
    url: url,
  };

  const updates = {};
  updates['/firmware/' + version] = metadata;
  updates['/config/ESP32/version'] = version;

  dataUpdate(dbRef,updates);
}

function uploadVer_ESP32(ver){
  var dbRef = ref(db);
  var verData = {
    // This bit of magic causes Firebase to write the
    // server timestamp when the data is written to the
    // database record.
    version: ver,
  };
  const updates = {};
  updates['/config/ESP32/'] = verData;

  dataUpdate(dbRef,updates);
}