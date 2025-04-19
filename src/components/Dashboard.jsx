import React from "react";
import Displaycards from "./Displaycards.jsx";
import MarkAttendanceCard from "./MarkAttendanceCard.jsx";
import AttendanceChart from "./AttendanceChart.jsx";
import { useSelector } from "react-redux";

const Dashboard = () => {
  return (
    <div className="mt-[5vw]">
      
      <div className="h-[60vh] w-full flex text-[2vw]">
        <div className="h-full w-1/2 flex flex-col justify-center items-center px-10">
          <h1>Employee.</h1>
          <h1>Management.</h1>
          <h1>System.</h1>
        </div>
        <div className="h-full w-1/2 bg-yellow-600">
          <img
            src="/employee_bg_image_final_right.jpg"
            className="h-full w-full object-cover"
            alt="employee"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
