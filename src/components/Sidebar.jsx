import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import EmployeeNavbar from "./EmployeeNavbar";
import useAuthStore from "../Store/AuthStore";

const Sidebar = () => {
   const{userEmail} = useAuthStore();
  return (
    <>
     {userEmail.includes("@admin.com") ? <AdminNavbar/> : <EmployeeNavbar/>}
      <Outlet />
    </>
  );
};

export default Sidebar;
