// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyD9SlKXLdTTue3j2YvQLtSQK8CH17sssqM",
  authDomain: "messengerapp-c16eb.firebaseapp.com",
  projectId: "messengerapp-c16eb",
  storageBucket: "messengerapp-c16eb.appspot.com",
  messagingSenderId: "744957165682",
  appId: "1:744957165682:web:3e0d7e5e0fefa15fa482eb",
  measurementId: "G-98DYV16Y32",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
self.addEventListener("notificationclick", (event) => {
  if (event.action) {
    clients.notification.close();
  }
});
