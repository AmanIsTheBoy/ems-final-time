import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../connection/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const AddEmployee = () => {
  const initialValues = {
    name: "",
    email: "",
    work: "",
    salary: "",
    phone: "",
    address: "",
    Project: "",
    hint: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .matches(/^[A-Za-z ]+$/, "Name can only contain letters and spaces")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name can be at most 50 characters")
      .required("Name is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email format")
      .required("Email is required"),
    work: Yup.string()
      .trim()
      .min(2, "Work description must be at least 2 characters")
      .max(100, "Work description can be at most 100 characters")
      .required("Work is required"),
    salary: Yup.number()
      .typeError("Salary must be a number")
      .positive("Salary must be a positive number")
      .required("Salary is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    address: Yup.string()
      .trim()
      .min(10, "Address must be at least 10 characters")
      .max(200, "Address can be at most 200 characters")
      .required("Address is required"),
    Project: Yup.string()
      .trim()
      .min(3, "Project name must be at least 3 characters")
      .max(50, "Project name can be at most 50 characters")
      .required("Project is required"),
    hint: Yup.string()
      .trim()
      .min(3, "Hint must be at least 3 characters")
      .max(20, "Hint can be at most 20 characters")
      .required("Password hint is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const password = values.name.trim() + "@" + values.hint.trim();

      await setDoc(doc(db, "admin", values.email.trim()), {
        name: values.name.trim(),
        email: values.email.trim(),
        work: values.work.trim(),
        salary: Number(values.salary),
        phone: values.phone,
        address: values.address.trim(),
        Project: values.Project.trim(),
      });

      await setDoc(doc(db, "employee", values.email.trim()), {
        name: values.name.trim(),
        email: values.email.trim(),
        work: values.work.trim(),
        salary: Number(values.salary),
        phone: values.phone,
        address: values.address.trim(),
        Project: values.Project.trim(),
      });

      await createUserWithEmailAndPassword(auth, values.email.trim(), password);

      toast.success("Employee added successfully to Firestore", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });

      resetForm();
    } catch (error) {
      console.error("Error adding employee to Firestore:", error);
      toast.error("Error adding employee", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-[13vh] px-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Add Employee</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block font-semibold mb-1">Name</label>
              <Field
                type="text"
                name="name"
                placeholder="Enter full name"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage name="name" component="div" className="text-red-600 text-sm" />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-semibold mb-1">Email</label>
              <Field
                type="email"
                name="email"
                placeholder="Enter company email"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
            </div>

            {/* Work */}
            <div>
              <label htmlFor="work" className="block font-semibold mb-1">Work</label>
              <Field
                type="text"
                name="work"
                placeholder="e.g., Frontend Developer"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage name="work" component="div" className="text-red-600 text-sm" />
            </div>

            {/* Salary */}
            <div>
              <label htmlFor="salary" className="block font-semibold mb-1">Salary</label>
              <Field
                type="text"
                name="salary"
                placeholder="Enter annual salary"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage name="salary" component="div" className="text-red-600 text-sm" />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block font-semibold mb-1">Phone Number</label>
              <Field
                type="text"
                name="phone"
                placeholder="10-digit number"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage name="phone" component="div" className="text-red-600 text-sm" />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block font-semibold mb-1">Address</label>
              <Field
                type="text"
                name="address"
                placeholder="Enter full address"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage name="address" component="div" className="text-red-600 text-sm" />
            </div>

            {/* Project */}
            <div>
              <label htmlFor="Project" className="block font-semibold mb-1">Project</label>
              <Field
                type="text"
                name="Project"
                placeholder="Assigned project name"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage name="Project" component="div" className="text-red-600 text-sm" />
            </div>

            {/* Hint */}
            <div>
              <label htmlFor="hint" className="block font-semibold mb-1">Password Hint</label>
              <Field
                type="text"
                name="hint"
                placeholder="e.g., 2024emp"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage name="hint" component="div" className="text-red-600 text-sm" />
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Add Employee"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddEmployee;
