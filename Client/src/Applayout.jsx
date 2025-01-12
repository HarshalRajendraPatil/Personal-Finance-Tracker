import React from "react";
import Navbar from "./Components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Components/Footer";

const Applayout = () => {
  return (
    <div>
      <Navbar />
      <div className="pt-10">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Applayout;
