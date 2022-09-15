import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useFormik } from "formik";
import { LoginSchema } from "./Schema";

const Login = () => {
  const history = useHistory();
  const onSubmit = async (values, actions) => {
    actions.setValues({ ...values, error: null });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await updateDoc(doc(db, "users", result.user.uid), {
        isOnline: true,
      });

      history.replace("/");
    } catch (err) {
      actions.setValues({ ...values, error: err.message });
    }
    if (error) {
      console.log("error=>", error);

      // alert("Users not found");
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        name: "Hello",
        email: "",
        password: "",
        error: "",
      },
      validationSchema: LoginSchema,
      onSubmit,
    });
  const { name, email, password, error } = values;
  return (
    <div className="container">
      <div className="image">
        <img />
      </div>
      <div className="section">
        <h3>Log into your Account</h3>
        <form className="form" autoComplete="off" onSubmit={handleSubmit}>
          <div className="input_container">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter you email"
              className={errors.email && touched.email ? "input-error" : ""}
            />
            {errors.email && touched.email ? (
              <p className="error">{errors.email}</p>
            ) : (
              ""
            )}
          </div>
          <div className="input_container">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.password && touched.password ? "input-error" : ""
              }
            />
            {errors.password && touched.password ? (
              <p className="error">{errors.password}</p>
            ) : (
              ""
            )}
          </div>

          {error ? <p className="error_msg">User not found</p> : null}
          <div className="btn_container">
            <button className="btn" type="submit">
              Login
            </button>
          </div>
          <div>
            <p>
              Don't have any account ? <Link to="/register">Register</Link> here
              !{" "}
            </p>
            <p>
              <Link to="/forgotpassword">Forgot Password</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
