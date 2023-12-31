import React from "react";
import logo1RIGO from "../imgs/logo1.png";

export const Navbar = () => {
  return (
    <div className="top mb-3">
      <a href="./">
        <img src={logo1RIGO} alt="" />
      </a>
      <div
        className="container border-success text-light title-form d-flex align-items-center"
        style={{ fontSize: "1.8rem" }}
      >
        <div>
          <i className="bi bi-qr-code"></i>&nbsp;QR Code PIX
        </div>
      </div>
    </div>
  );
};
