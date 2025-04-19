import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../connection/firebase";
import emailicon from "../assets/email.png";
import passwordicon from "../assets/password.png";
import ButtonLoader from "./Loaders/ButtonLoader";
import useAuthStore from "../Store/AuthStore";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUserEmail = useAuthStore((state) => state.setUserEmail);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email.trim(),
        values.password.trim()
      );

      const user = userCredential.user;
      setUserEmail(user.email); 

      toast.success("Login successful", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });

      // Navigate based on '@admin.com' domain
      if (values.email.includes("@admin.com")) {
        navigate("/AdminDashbaord");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Login failed", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    handleLogin({
      email: "mukeshkj2912@gmail.com",
      password: "Mukesh@123",
    });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleLogin}>
      <Form className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="flex items-center gap-2 mb-1">
            <img src={emailicon} alt="email" className="w-5 h-5" />
            <span>Email</span>
          </label>
          <Field
            type="email"
            name="email"
            placeholder="Enter email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
          <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="flex items-center gap-2 mb-1">
            <img src={passwordicon} alt="password" className="w-5 h-5" />
            <span>Password</span>
          </label>
          <Field
            type="password"
            name="password"
            placeholder="Enter password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
          <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4 mt-6">
          <button
            type="submit"
            className="w-1/2 bg-[#8112E9] text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? <ButtonLoader /> : "Login"}
          </button>

          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-1/2 bg-[#8112E9] text-white py-2 rounded-md hover:bg-gray-700 transition duration-200"
            disabled={loading}
          >
            {loading ? <ButtonLoader /> : "Demo"}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default Login;
