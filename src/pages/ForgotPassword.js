import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const emailRef = useRef();

  const onSubmit = (e) => {
    e.preventDefault();
  };
  const forgotpassword = () => {
    const email = emailRef.current.value;
    const auth = getAuth();
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => ((emailRef.current.value = ""), setSuccess("Sent Email")))
        .catch((error) => {
          setError("User not found", error);
        });
    }
  };
  return (
    <div>
      <div className="section-prof-pass">
        <div>
          <form onSubmit={onSubmit}>
            <label htmlFor="email">Enter Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              ref={emailRef}
            />
            <div>
              <button className="send-email-btn" onClick={forgotpassword}>
                Send Email
              </button>
            </div>
            <p className="login-link">
              <Link to="/login">Login</Link>
            </p>
            {error ? (
              <p className="error_msg">{error}</p>
            ) : (
              <p className="success_msg">{success}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
