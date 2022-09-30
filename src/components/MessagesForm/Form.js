import React, { useEffect, useState } from "react";

import { BsFillArrowUpSquareFill } from "react-icons/bs";
import { BsFillFileEarmarkCheckFill } from "react-icons/bs";
import InputEmoji from "react-input-emoji";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsFillFileEarmarkExcelFill } from "react-icons/bs";

const Form = ({ handleSubmit, text, setText, setImg, img }) => {
  const notify = ({ target: { files } }) => {
    if (files[0].size > 2000001) {
      toast("Select Image less than 2mb");
      setImg(null);
    } else {
      toast("Image Selected");
      setImg(files[0]);
    }
  };
  const handleClick = (event) => {
    const { target = {} } = event || {};
    target.value = "";
  };

  return (
    <form className="message_form" onSubmit={handleSubmit}>
      <div className="input-file">
        <label>
          {img ? <BsFillFileEarmarkCheckFill /> : <BsFillArrowUpSquareFill />}
          {img ? (
            <p className="cancelImg" onClick={() => setImg(null)}>
              <BsFillFileEarmarkExcelFill />
            </p>
          ) : (
            ""
          )}
        </label>
        <input type="file" onClick={handleClick} onChange={notify} />
      </div>
      <div className="input-message">
        <InputEmoji
          className="hello"
          value={text}
          onChange={setText}
          placeholder="Type a message"
        />
        <ToastContainer />
      </div>
      <div>
        <button className="btn">Send</button>
      </div>
    </form>
  );
};

export default Form;
