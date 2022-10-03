// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD9SlKXLdTTue3j2YvQLtSQK8CH17sssqM",
  authDomain: "messengerapp-c16eb.firebaseapp.com",
  projectId: "messengerapp-c16eb",
  storageBucket: "messengerapp-c16eb.appspot.com",
  messagingSenderId: "744957165682",
  appId: "1:744957165682:web:3e0d7e5e0fefa15fa482eb",
  measurementId: "G-98DYV16Y32",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

function requestNotificationPermission() {
  // console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      // console.log("Notification permission granted.");

      getToken(messaging, {
        vapidKey:
          "BNT3zL7CB_zMMvs6Ptiw3s6Lhd26luC5_slKU6PZFKbdhN-6aJJqHvNzzFEkW6_YT96_eGHR0sz50_EZAbJzxL4",
      })
        .then((currentToken) => {
          if (currentToken) {
            setDoc(
              doc(db, "users", auth.currentUser.uid),
              {
                fcmToken: currentToken,
              },
              { merge: true }
            )
              .then((response) => {
                console.log("Token set successfully: ", currentToken);
              })
              .catch((error) => {
                console.error("Error while setting token: ", error);
              });
          } else {
            console.log(
              "No registration token available. Request permission to generate one."
            );
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
        });
    } else {
      console.log("Do not have Permission");
    }
  });
}

function sendPushNotification(fcmToken, title, message) {
  fetch("http://localhost:8000/firebase/notification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fcmToken: fcmToken,
      title: title,
      message: message,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log("Notification Error: ", err);
    });
}

export {
  auth,
  db,
  storage,
  requestNotificationPermission,
  sendPushNotification,
};
