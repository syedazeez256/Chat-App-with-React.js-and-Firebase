import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useRef, useEffect, useState } from "react";
import Moment from "react-moment";
import { db } from "../../firebase";
import Img from "../svg/demo.png";

const Message = ({ msg, user1, selectedUser }) => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "in", [user1]));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUser(users);
    });
    return () => unsub();
  }, []);
  const scrollRef = useRef();
  // console.log(msg);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);
  return (
    <div
      className={`message_wrapper ${msg.from === user1 ? "own" : ""}`}
      ref={scrollRef}
    >
      <div>
        {msg.from === user1 ? (
          <div className="sender">
            <div className="img">
              <img src={user[0]?.media !== "" ? user[0]?.media : Img} />
            </div>
            <div className="details">
              <span className="name">{user[0]?.name}</span>
              <span className="time">
                {<Moment fromNow>{msg.createAt.toDate()}</Moment>}
              </span>
            </div>
          </div>
        ) : (
          <div className="reciever">
            <div className="img">
              <img
                src={selectedUser?.media !== "" ? selectedUser?.media : Img}
              />
            </div>
            <div className="details">
              <p className="name">{selectedUser?.name}</p>
              <p className="time">
                {<Moment fromNow>{msg.createAt.toDate()}</Moment>}
              </p>
            </div>
          </div>
        )}
      </div>
      <p className={msg.from === user1 ? "me" : "friend"}>
        {msg.media ? <img src={msg.media} alt={msg.text} /> : null}
        {msg.text}
      </p>
    </div>
  );
};
export default Message;
