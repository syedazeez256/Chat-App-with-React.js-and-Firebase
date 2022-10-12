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
  const activeUser = auth.currentUser.uid;
  const options = [
    { value: true, label: "Online" },
    { value: false, label: "Offline" },
    { value: "all", label: "All" },
  ];

  const fetchUsers = () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [activeUser]));
    onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
  };
  const fetchMessages = (nonActiveUser) => {
    const id =
      activeUser > nonActiveUser
        ? `${activeUser + nonActiveUser}`
        : `${nonActiveUser + activeUser}`;
    const msgsRef = collection(db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });
  };
  useEffect(() => {
    if (users.length > 0) {
      try {
        for (const x in users) {
          const nonActiveUser = users[x].uid;
          fetchMessages(nonActiveUser);
        }
      } catch (error) {
        console.log(error, "Error while getting messages from firebase");
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
        let nonActiveUser = users[x].uid;
        const id =
          activeUser > nonActiveUser
            ? `${activeUser + nonActiveUser}`
            : `${nonActiveUser + activeUser}`;
        const msgsRef = collection(db, "messages", id, "chat");
        const q = query(msgsRef, orderBy("createAt", "desc"));

        let messages = []; // 0
        onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            messages.push(doc.data());
          });
        });

        setTimeout(() => {
          messages[0]
            ? lastMessages.push({
                ...users[x],
                lastMessage: messages[0]?.createAt?.seconds,
              })
            : lastMessages.push({
                ...users[x],
                lastMessage: "",
              });
        }, 100);
        setTimeout(() => {
          const sortedUser = lastMessages.sort((a, b) => {
            return b.lastMessage - a.lastMessage;
          });
          setSortedUser(sortedUser);
        }, 200);
      }
    }
  }, [msgs]);
  const selectUser = async (user) => {
    setSelectedUser(user);
    setChat(user);

    const nonActiveUser = user.uid;

    const id =
      activeUser > nonActiveUser
        ? `${activeUser + nonActiveUser}`
        : `${nonActiveUser + activeUser}`;
    try {
      fetchMessages(nonActiveUser);
    } catch (error) {
      console.log(error, "Error while getting Messages from firebase");
    }

    // get last message b/w logged in user and selected user
    const docSnap = await getDoc(doc(db, "lastMsg", id));
    // if last message exists and message is from selected user
    if (docSnap.data() && docSnap.data().from !== activeUser) {
      // update last message doc, set unread to false
      await updateDoc(doc(db, "lastMsg", id), { unread: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nonActiveUser = chat.uid;

    const id =
      activeUser > nonActiveUser
        ? `${activeUser + nonActiveUser}`
        : `${nonActiveUser + activeUser}`;
    let url;
    if (img) {
      try {
        let imgRef = ref(
          storage,
          `images/${new Date().getTime()} - ${img.name}`
        );
        let snap = await uploadBytes(imgRef, img);
        let dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
        url = dlUrl;
      } catch (error) {
        console.log(error, "Error while uploading Images in firebase stoarge");
      }
    }

    if (text || img) {
      try {
        await addDoc(collection(db, "messages", id, "chat"), {
          text,
          from: activeUser,
          to: nonActiveUser,
          createAt: Timestamp.fromDate(new Date()),
          media: url || "",
        });
        setText("");
        setImg("");
      } catch (error) {
        console.log(error, "While Adding Documet in Firebase");
      }
    }
    try {
      await setDoc(doc(db, "lastMsg", id), {
        text,
        from: activeUser,
        to: nonActiveUser,
        createAt: Timestamp.fromDate(new Date()),
        media: url || "",
        unread: true,
      });
    } catch (error) {
      console.log(error, "While setting documnet in Firebase");
    }

    sendPushNotification(selectedUser.fcmToken, "New Message", text);
  };
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
              activeUser={activeUser}
              chat={chat}
              selectedUser={selectedUser}
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
                    <h3 className="userName">{chat.name}</h3>
                    <p
                      className={` ${
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
                        activeUser={activeUser}
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
