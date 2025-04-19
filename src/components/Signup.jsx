import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {auth} from "../connection/firebase"; // Your Firebase initialization file
import emailicon from "../assets/email.png";
import passwordicon from "../assets/password.png";
import usernameicon from "../assets/username.png";

const Signup = () => {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username cannot be more than 20 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[0-9]/, "Must contain at least one number")
      .matches(/[@$!%*?&]/, "Must contain at least one special character")
      .required("Password is required"),
  });

  const handleSignup = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const { email, password, username } = values;

      // Create user with email & password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: username,
      });

      toast.success("User registered successfully. Please login.", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });

      resetForm();
    } catch (error) {
      toast.error(error.message || "Signup failed. Try again.", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSignup}
    >
      <Form className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-semibold text-center">Sign Up</h2>

        {/* Username */}
        <div className="mb-4 mt-10">
          <label htmlFor="username" className="flex items-center gap-2 mb-1">
          </label>
          <Field
            type="text"
            name="username"
            placeholder="Enter username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
          <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="flex items-center gap-2 mb-1">
           
          </label>
          <Field
            type="email"
            name="email"
            placeholder="Enter email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
          <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="flex items-center gap-2 mb-1">
           
          </label>
          <Field
            type="password"
            name="password"
            placeholder="Enter password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
          <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#8112E9] text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          disabled={loading}
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </Form>
    </Formik>
  );
};

export default Signup;
