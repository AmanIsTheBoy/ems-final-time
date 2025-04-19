import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import EmployeeNavbar from "./EmployeeNavbar";
import useAuthStore from "../Store/AuthStore";

const Sidebar = () => {
  var { userEmail } = useAuthStore();
  
  if (!userEmail) {
    userEmail = localStorage.getItem("userEmail")
  }
  return (
    <>
      {userEmail.includes("@admin.com") ? <AdminNavbar /> : <EmployeeNavbar />}
      <Outlet />
    </>
  );
};

export default Sidebar;
