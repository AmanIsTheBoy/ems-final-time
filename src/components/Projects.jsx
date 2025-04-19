// frontend/components/Projects.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../connection/firebase";

const Projects = ({ employeeId }) => {
  const [projects, setProjects] = useState(); // Set initial state to null
  const [loading, setLoading] = useState(true); // Add a loading state
  const userEmail = localStorage.getItem("userEmail")

  // Fetch project data for the specific employee
  const fetchProjects = async () => {
    try {
      const userData =  await getDoc(doc(db,"employee",userEmail))
      setProjects(userData.data().Project)
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Render loading spinner or message while fetching data
  if (loading) {
    return <div>Loading projects...</div>;
  }

  // Render the component after projects are fetched
  return (
    <div className="w-full min-h-[100vh] mt-30 px-4">
         <h1>hello {userEmail.split("@")[0]} , have you assigned this project,{projects}</h1>
    </div>
  );
};

export default Projects;
