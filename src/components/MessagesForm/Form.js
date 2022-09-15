import React, { useEffect, useState } from "react";

import { BsFillArrowUpSquareFill } from "react-icons/bs";
import { BsFillFileEarmarkCheckFill } from "react-icons/bs";
import InputEmoji from "react-input-emoji";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Form = ({ handleSubmit, text, setText, setImg, img }) => {
  const notify = ({ target: { files } }) => {
    if (files[0].size > 2000001) {
      toast("Select Image less than 2mb");
      setImg(null);
    } else {
      toast("Selected Image");
      setImg(files[0]);
    }
  };

  return (
    <form className="message_form" onSubmit={handleSubmit}>
      <div className="input-file">
        <label>
          {img ? <BsFillFileEarmarkCheckFill /> : <BsFillArrowUpSquareFill />}
        </label>
        <input
          // onClick={notify}
          onChange={notify}
          type="file"
        />
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
