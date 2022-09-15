import React from "react";
import { FirebaseProvider } from "@useweb/use-firebase";
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD9SlKXLdTTue3j2YvQLtSQK8CH17sssqM",
  authDomain: "messengerapp-c16eb.firebaseapp.com",
  projectId: "messengerapp-c16eb",
  storageBucket: "messengerapp-c16eb.appspot.com",
  messagingSenderId: "744957165682",
  appId: "1:744957165682:web:3e0d7e5e0fefa15fa482eb",
  measurementId: "G-98DYV16Y32",
};
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

const envIsDev = process.env.NODE_ENV === "development";

const vapidKey =
  "BNT3zL7CB_zMMvs6Ptiw3s6Lhd26luC5_slKU6PZFKbdhN-6aJJqHvNzzFEkW6_YT96_eGHR0sz50_EZAbJzxL4";

export default function Firebase({ children }) {
  return (
    <FirebaseProvider
      firebaseConfig={firebaseConfig}
      firebaseApp={firebaseApp}
      envIsDev={envIsDev}
      messaging={messaging}
      messagingOptions={{
        vapidKey,
      }}
    >
      {children}
    </FirebaseProvider>
  );
}
