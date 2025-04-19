import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../connection/firebase";
import { toast } from "react-toastify";

const EditEmployee = () => {
  const { id } = useParams(); // document ID (email)
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const docRef = doc(db, "admin", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setInitialValues({
            name: data.name || "",
            email: data.email || "",
            work: data.work || "",
            salary: data.salary?.toString() || "",
            phone: data.phone || "",
            address: data.address || "",
            Project: data.Project || "",
          });
        } else {
          toast.error("Employee not found");
          navigate("/employees");
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
        toast.error("Failed to load employee");
        navigate("/employees");
      }
    };
    fetchEmployee();
  }, [id, navigate]);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .matches(/^[A-Za-z ]+$/, "Name can only contain letters and spaces")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name can be at most 50 characters")
      .required("Name is required"),
    // email disabled, no edit
    work: Yup.string()
      .trim()
      .min(2, "Work description must be at least 2 characters")
      .max(100, "Work description can be at most 100 characters")
      .required("Work is required"),
    salary: Yup.number()
      .typeError("Salary must be a number")
      .positive("Salary must be a positive number")
      .max(10000000, "Salary seems too high")
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
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const docRef = doc(db, "admin", id);
      await updateDoc(docRef, {
        name: values.name.trim(),
        work: values.work.trim(),
        salary: Number(values.salary),
        phone: values.phone,
        address: values.address.trim(),
        Project: values.Project.trim(),
      });
      toast.success("Employee updated successfully");
      navigate("/employees");
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee");
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialValues) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Edit Employee</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block font-medium mb-1">Name</label>
              <Field
                type="text"
                name="name"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Full name"
              />
              <ErrorMessage name="name" component="div" className="text-red-600 text-sm" />
            </div>

            {/* Email (disabled) */}
            <div>
              <label htmlFor="email" className="block font-medium mb-1">Email</label>
              <Field
                type="email"
                name="email"
                className="w-full p-2 border border-gray-200 bg-gray-100 rounded"
                disabled
              />
            </div>

            {/* Work */}
            <div>
              <label htmlFor="work" className="block font-medium mb-1">Work</label>
              <Field
                type="text"
                name="work"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g., Frontend Developer"
              />
              <ErrorMessage name="work" component="div" className="text-red-600 text-sm" />
            </div>

            {/* Salary */}
            <div>
              <label htmlFor="salary" className="block font-medium mb-1">Salary</label>
              <Field
                type="text"
                name="salary"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Annual salary"
              />
              <ErrorMessage name="salary" component="div" className="text-red-600 text-sm" />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block font-medium mb-1">Phone Number</label>
              <Field
                type="text"
                name="phone"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="10-digit number"
              />
              <ErrorMessage name="phone" component="div" className="text-red-600 text-sm" />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block font-medium mb-1">Address</label>
              <Field
                type="text"
                name="address"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Full address"
              />
              <ErrorMessage name="address" component="div" className="text-red-600 text-sm" />
            </div>

            {/* Project */}
            <div>
              <label htmlFor="Project" className="block font-medium mb-1">Project</label>
              <Field
                type="text"
                name="Project"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Assigned project"
              />
              <ErrorMessage name="Project" component="div" className="text-red-600 text-sm" />
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/employees")}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditEmployee;
