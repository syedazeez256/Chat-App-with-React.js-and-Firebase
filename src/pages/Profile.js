import React, { useState, useEffect } from "react";
import Img from "../components/svg/demo.png";

import { db, storage } from "../firebase";
import Avatar from "@mui/material/Avatar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import Img from "../components/svg/demo.png";

import { getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import Navbar from "../components/navbar/navbar";
import { deleteUser, getAuth, updatePassword } from "firebase/auth";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { passwordSchema } from "./Schema";

const Profile = () => {
  const notify = () => {
    if (img) {
      toast("Uploaded, Reload Page");
    } else {
      toast("Please Select Image");
    }
  };

  const { values, errors, touched, handleBlur, handleChange } = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: passwordSchema,
  });
  const [img, setImg] = useState(null);
  const [userDet, setUserDet] = useState();

  const history = useHistory();

  const auth = getAuth();
  const user = auth.currentUser;
  useEffect(() => {
    try {
      getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
        if (docSnap.exists) {
          setUserDet(docSnap.data());
        }
      });
    } catch (error) {
      console.log(error, "Error while getting active user");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      const profile = doc(db, "users", user.uid);
      await updateDoc(profile, {
        media: dlUrl,
      });
    }
  };
  console.log(user.uid);
  const deleteProfile = () => {
    deleteUser(user)
      .then(() => {
        deleteDoc(doc(db, "users", user.uid))
          .then((res) => alert("Profile Deleted"))
          .catch((error) => {
            console.log(error, " While deleting user");
            toast("Session expired, Please login again");
          });
      })
      .catch((error) =>
        console.log(error, "Something going wrong while deleting user")
      );
  };
  const updateUserPassword = () => {
    if (
      (values.password && values.confirmPassword !== "",
      values.password === values.confirmPassword)
    ) {
      updatePassword(user, values.confirmPassword)
        .then(() => {
          toast("Password Updated");
          history.replace("/login ");
        })
        .catch((error) => {
          toast("Session expired, Login again to change the password");
        });
    }
  };
  return userDet ? (
    <div>
      <Navbar />
      <div>
        <form onSubmit={handleSubmit}>
          <div className="section-prof">
            <div className="profile_container">
              <div className="img_container">
                <Avatar
                  alt="Remy Sharp"
                  src={userDet.media}
                  sx={{ width: 96, height: 96 }}
                />
                <input
                  className="upload-pic-input"
                  type="file"
                  onChange={(e) => setImg(e.target.files[0])}
                />
              </div>
              <div className="text_container">
                <h3>{userDet.name}</h3>
                <p>{userDet.email}</p>
                <hr />
                <small>
                  Joined on: {userDet.createAt?.toDate()?.toDateString()}
                </small>
              </div>
            </div>
            <button className="profile_upload_btn" onClick={notify}>
              Upload image
            </button>
            <ToastContainer />
            <div className="profile-password">
              <label htmlFor="password">Reset Password</label>
              <input
                id="password"
                type="password"
                placeholder="Reset Password"
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
            <div className="profile-password">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.confirmPassword && touched.confirmPassword
                    ? "input-error"
                    : ""
                }
              />
              {errors.confirmPassword && touched.confirmPassword ? (
                <p className="error">{errors.confirmPassword}</p>
              ) : (
                ""
              )}
            </div>
            <div>
              <button className="delete-btn" onClick={deleteProfile}>
                Delete
              </button>
              <button className="update-btn" onClick={updateUserPassword}>
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default Profile;
