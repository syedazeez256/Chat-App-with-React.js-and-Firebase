import React, { useEffect, useState } from "react";
import Img from "../svg/demo.png";

import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase";

const User = ({ activeUser, user, selectUser, chat, selectedUser }) => {
  const user2 = user?.uid;
  const [data, setData] = useState("");
  useEffect(() => {
    const id =
      activeUser > user2 ? `${activeUser + user2}` : `${user2 + activeUser}`;
    onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
  }, []);

  return (
    <div>
      <div
        className={`user_wrapper ${
          chat?.uid !== undefined &&
          selectedUser?.uid !== undefined &&
          chat?.uid === user?.uid
            ? "selected_user"
            : ""
        }`}
        onClick={() => selectUser(user)}
      >
        <div className="user_info">
          <div className="user_detail">
            <img src={user?.media || Img} alt="avatar" className="avatar" />
            <h4>{user?.name}</h4>
            {data?.from !== activeUser && data?.unread && (
              <small className="unread">New</small>
            )}
          </div>
          <div
            className={`user_status ${user?.isOnline ? "online" : "offline"}`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default User;
