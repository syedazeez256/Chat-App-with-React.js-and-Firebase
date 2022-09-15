import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { useFormik } from "formik";
import { basicSchema } from "./Schema";

const Register = () => {
  const history = useHistory();
  let url;
  const onSubmit = async (values, actions) => {
    actions.setValues({ ...values, error: null });
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        createAt: Timestamp.fromDate(new Date()),
        isOnline: true,
        media: url || "",
      });
      history.replace("/");
    } catch (error) {
      actions.setValues({ ...values, error: error.message });
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // actions.resetForm();
  };
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: { name: "", email: "", password: "", error: null },
      validationSchema: basicSchema,
      onSubmit,
    });
  const { name, email, password, error } = values;

  return (
    <div className="container ">
      <div className="image">
        <img />
      </div>
      <div className="section">
        <h3>Create An Account</h3>
        <form className="form" autoComplete="off" onSubmit={handleSubmit}>
          <div className="input_container">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.name && touched.name ? "input-error" : ""}
            />
            {errors.name && touched.name ? (
              <p className="error">{errors.name}</p>
            ) : (
              ""
            )}
          </div>
          <div className="input_container">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
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
          {error ? <p className="error">{error}</p> : null}
          <div className="btn_container">
            <button className="btn" type="submit">
              Register
            </button>
          </div>
          <div>
            <p>
              Have an account ? <Link to="/login">Login</Link> here !
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
