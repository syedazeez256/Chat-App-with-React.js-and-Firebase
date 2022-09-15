// import { Button } from "@mui/material";
// import { getToken } from "firebase/messaging";
// import React, { useState } from "react";
// import { getTokenId, onMessageListener } from "./firebase";
// import Toast from "./Toast";

// const AppTest = () => {
//   const [show, setShow] = useState(false);
//   const [notification, setNotification] = useState({ title: "", body: "" });
//   const [isTokenFound, setTokenFound] = useState(false);
//   getTokenId(setTokenFound);

//   onMessageListener()
//     .then((payload) => {
//       setShow(true);
//       setNotification({
//         title: payload.notification.title,
//         body: payload.notification.body,
//       });
//       console.log(payload);
//     })
//     .catch((err) => console.log("failed: ", err));
//   return (
//     <div className="App">
//       <Toast
//         onClose={() => setShow(false)}
//         show={show}
//         delay={3000}
//         autohide
//         animation
//         style={{
//           position: "absolute",
//           top: 20,
//           right: 20,
//           minWidth: 200,
//         }}
//       >
//         <Toast.Header>
//           <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
//           <strong className="mr-auto">{notification.title}</strong>
//           <small>just now</small>
//         </Toast.Header>
//         <Toast.Body>{notification.body}</Toast.Body>
//       </Toast>
//       <header className="App-header">
//         {isTokenFound && <h1> Notification permission enabled 👍🏻 </h1>}
//         {!isTokenFound && <h1> Need notification permission ❗️ </h1>}
//         <img src={"logo"} className="App-logo" alt="logo" />
//         <Button onClick={() => setShow(true)}>Show Toast</Button>
//       </header>
//     </div>
//   );
// };

// export default AppTest;
