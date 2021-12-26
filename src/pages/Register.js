import React, { useState } from "react";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";

import { useHistory } from "react-router-dom";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const history = useHistory();

  const { name, email, password, error, loading } = data;

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!name || !email || !password) {
      setData({ ...data, error: "All Fields are Require" });
    }
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      //setting the user information in firebase
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        createAt: Timestamp.fromDate(new Date()),
        isOnline: true,
      });
      //resetting the stats
      setData({
        name: "",
        email: "",
        password: "",
        error: null,
        loading: false,
      });
      history.replace("/");
      // This was for the old version that is how we were passing the data to firebase
      //   firebase.firestore().collection("users").doc(id).set({});
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };

  return (
    <section>
      <h2>Create An Account</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input_container">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Please enter your name"
            value={name}
            onChange={handleChange}
          />
        </div>
        <div className="input_container">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            placeholder="Please enter your Email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className="input_container">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Please enter you password"
            value={password}
            onChange={handleChange}
          />
        </div>
        {error ? <p className="error">{error} </p> : null}
        <div className="btn_container">
          <button className="btn" disabled={loading}>
            {loading ? "Signning up" : "Sign-up"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Register;
