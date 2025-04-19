import React from "react";
import Displaycards from "./Displaycards.jsx";
import MarkAttendanceCard from "./MarkAttendanceCard.jsx";
import AttendanceChart from "./AttendanceChart.jsx";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  return (
      <div className="h-[80vh] w-full flex text-[2vw] mt-[5vw] ">
        <div className="h-full w-1/3 flex flex-col justify-center items-center px-10">
          <h1>Employee.</h1>
          <h1>Management.</h1>
          <h1>System.</h1>
        </div>
        <div className="h-full w-2/3 bg-yellow-600">
          <img
            src="/employee_bg_image_final_right.jpg"
            className="h-full w-full object-cover"
            alt="employee"
          />
        </div>
      </div>
  );
};

export default  AdminDashboard;
