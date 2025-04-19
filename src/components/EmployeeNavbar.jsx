import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import profileIcon from "../assets/profile-image.png";
import profile24 from "../assets/profileIcon-24.png";
import logoutIcon from "../assets/logout.png";
import dashboardIcon from "../assets/dashboard.png";
import attendanceIcon from "../assets/attendance.png";
import leaveRecordIcon from "../assets/leaveRecord.png";
import leaveIcon from "../assets/leave.png";
import employeesIcon from "../assets/employees.png";
import projectsIcon from "../assets/projects.png";
import hamIcon from "../assets/hamburger-icon.png";
import { setLoggedIn, setToken } from "../Slices/AuthSlice.jsx";
import { setEmployee, setProfilePicture } from "../Slices/EmployeeSlice.jsx";

const EmployeeNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const profilePicture = useSelector((state) => state.employee.profilePicture);
  const employee = useSelector((state) => state.employee.employee);

  const axiosBaseURL = "https://employee-management-server-f7k2.onrender.com/api";

  const handleLogout = () => {
    dispatch(setLoggedIn(false));
    dispatch(setToken(null));
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const options = {
          headers: {
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };

        const employeeResponse = await axios.get(
          `${axiosBaseURL}/user/getemployee`,
          options
        );
        dispatch(setEmployee(employeeResponse.data.user));

        const profileResponse = await axios.get(
          `${axiosBaseURL}/user/getprofilepicture`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            responseType: "blob",
          }
        );

        if (profileResponse.data instanceof Blob) {
          const imageUrl = URL.createObjectURL(profileResponse.data);
          dispatch(setProfilePicture(imageUrl));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee details or profile picture:", error);
        setLoading(false);
      }
    };

    if (localStorage.getItem("authToken")) {
      fetchEmployeeDetails();
    } else {
      setLoading(false);
    }

    return () => {
      if (profilePicture) {
        URL.revokeObjectURL(profilePicture);
      }
    };
  }, [dispatch]);

  if (loading) {
    return (
      <div className="w-full text-center py-10">
        thth
      </div>
    );
  }

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50 ">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          className="text-gray-700 focus:outline-none"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
        >
          <img src={hamIcon} alt="menu" className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-4">
          <Link to="/myprofile" className="flex items-center space-x-3">
            <img
              src={profilePicture || profileIcon}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800">{employee.name}</span>
              <span className="text-sm text-gray-500">{employee.designation}</span>
            </div>
          </Link>
          <button onClick={handleLogout} className="flex items-center space-x-2 text-red-600">
            <img src={logoutIcon} alt="Logout" className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="offcanvas offcanvas-end" id="offcanvasNavbar">
        <div className="offcanvas-header">
          <h5 className="text-xl font-bold">Navbar</h5>
          <button className="text-gray-700 text-xl">&times;</button>
        </div>
        <div className="offcanvas-body">
          <ul className="flex flex-col space-y-4 p-4 text-lg">
            <li>
              <Link to="/dashboard" className="flex items-center space-x-3">
                <img src={dashboardIcon} alt="Dashboard" className="w-6 h-6" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/LeaveRecords" className="flex items-center space-x-3">
                <img src={leaveRecordIcon} alt="Leave Records" className="w-6 h-6" />
                <span>Leave Records</span>
              </Link>
            </li>
            <li>
              <Link to="/Applyleave" className="flex items-center space-x-3">
                <img src={leaveIcon} alt="Apply Leave" className="w-6 h-6" />
                <span>Apply Leave</span>
              </Link>
            </li>
            <li>
              <Link to="/Projects" className="flex items-center space-x-3">
                <img src={projectsIcon} alt="Projects" className="w-6 h-6" />
                <span>Projects</span>
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center space-x-3 text-red-600">
                <img src={logoutIcon} alt="Logout" className="w-6 h-6" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default EmployeeNavbar;
