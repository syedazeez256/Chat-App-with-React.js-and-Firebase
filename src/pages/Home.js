import React, { useEffect, useState } from "react";

import MessageForm from "../components/MessagesForm/Form";
import Message from "../components/Messages/Messages";
import { BsFilterSquare } from "react-icons/bs";
import Select from "react-select";
import demoImg from "../components/svg/demo.png";

import { db, auth, storage, sendPushNotification } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import Navbar from "../components/navbar/navbar";
import User from "../components/Users/User";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Img from "../components/svg/Img";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState();
  const [users, setUsers] = useState([]);
  const [SortedUser, setSortedUser] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [img, setImg] = useState(null);
  const [userStatus, setUserStatus] = useState({
    value: "all",
    label: "All",
  });
  const user1 = auth.currentUser.uid;
  const options = [
    { value: true, label: "Online" },
    { value: false, label: "Offline" },
    { value: "all", label: "All" },
  ];

  const fetchUsers = () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [user1]));
    onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
  };
  useEffect(() => {
    if (users.length > 0) {
      for (const x in users) {
        const user2 = users[x].uid;
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        const msgsRef = collection(db, "messages", id, "chat");
        const q = query(msgsRef, orderBy("createAt", "asc"));

        onSnapshot(q, (querySnapshot) => {
          let msgs = [];
          querySnapshot.forEach((doc) => {
            msgs.push(doc.data());
          });
          setMsgs(msgs);
        });
      }
    }
  }, [users]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let lastMessages = [];
    if (users.length > 0) {
      for (const x in users) {
        let user2 = users[x].uid;
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        const msgsRef = collection(db, "messages", id, "chat");
        const q = query(msgsRef, orderBy("createAt", "desc"));
        const msgs = [];
        onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            msgs.push(doc.data());
          });
        });
        setTimeout(() => {
          lastMessages.push({
            ...users[x],
            lastMessage: msgs[0]?.createAt?.seconds,
          });
        }, 1000);
        setTimeout(() => {
          const sortedUser = lastMessages.sort((a, b) => {
            if (a.lastMessage < b.lastMessage) return 1;
            if (a.lastMessage > b.lastMessage) return -1;
            return 0;
          });
          setSortedUser(sortedUser);
        }, 1200);
      }
    }
  }, [msgs]);

  const selectUser = async (user) => {
    setSelectedUser(user);
    setChat(user);

    const user2 = user.uid;

    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    const msgsRef = collection(db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });

    // get last message b/w logged in user and selected user
    const docSnap = await getDoc(doc(db, "lastMsg", id));
    // if last message exists and message is from selected user
    if (docSnap.data() && docSnap.data().from !== user1) {
      // update last message doc, set unread to false
      await updateDoc(doc(db, "lastMsg", id), { unread: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user2 = chat.uid;

    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    console.log("lllll");
    let url;
    console.log(img);
    if (img) {
      console.log(img);
      let imgRef = ref(storage, `images/${new Date().getTime()} - ${img.name}`);
      console.log(imgRef);
      let snap = await uploadBytes(imgRef, img);
      let dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
      console.log(snap);
      console.log(url);
    }

    if (text || img) {
      await addDoc(collection(db, "messages", id, "chat"), {
        text,
        from: user1,
        to: user2,
        createAt: Timestamp.fromDate(new Date()),
        media: url || "",
      });
      setText("");
      setImg("");
    }

    await setDoc(doc(db, "lastMsg", id), {
      text,
      from: user1,
      to: user2,
      createAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    });

    sendPushNotification(selectedUser.fcmToken, "New Message", text);
    console.log("=======");
  };
  console.log(SortedUser);
  return (
    <div>
      <Navbar />
      <div className="home_container">
        <div className="users_container">
          <div className="active_heading">
            <h2>Chats</h2>
            <div className="select_active">
              <Select
                onChange={(e) => setUserStatus(e)}
                value={userStatus}
                options={options}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 5,
                  colors: {
                    ...theme.colors,
                    primary25: "dodgerblue",
                    primary: "dodgerblue",
                  },
                })}
              />
            </div>
          </div>

          {SortedUser.filter((user) =>
            userStatus.value === "all"
              ? user
              : user.isOnline === userStatus.value
          ).map((user) => (
            <User
              key={user.uid}
              user={user}
              selectUser={selectUser}
              user1={user1}
              chat={chat}
            />
          ))}
        </div>
        <div className="messages_container">
          {chat ? (
            <>
              <div className="messages_user">
                {selectedUser && (
                  <>
                    <img src={selectedUser.media || demoImg} />
                    <h3>{chat.name}</h3>
                    <p
                      className={`user_status ${
                        selectedUser.isOnline ? "online-prof" : "offline-prof"
                      }`}
                    ></p>
                  </>
                )}
              </div>
              <div className="messages">
                {msgs.length
                  ? msgs.map((msg, i) => (
                      <Message
                        key={i}
                        msg={msg}
                        user1={user1}
                        selectedUser={selectedUser}
                      />
                    ))
                  : null}
              </div>
              <MessageForm
                handleSubmit={handleSubmit}
                text={text}
                setText={setText}
                setImg={setImg}
                img={img}
              />
            </>
          ) : (
            <h3 className="no_conv">Select a user to start conversation</h3>
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
