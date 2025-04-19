import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import LeaveRecords from "./LeaveRecords";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../connection/firebase";
import useAuthStore from "../Store/AuthStore";

const ApplyLeave = () => {
  const { userEmail } = useAuthStore();

  const [formData, setFormData] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const initialValues = { ...formData };

  const validationSchema = Yup.object().shape({
    leaveType: Yup.string().required("Type of leave is required"),
    fromDate: Yup.date()
      .required("From date is required")
      .typeError("Enter a valid date"),
    toDate: Yup.date()
      .required("To date is required")
      .typeError("Enter a valid date")
      .min(Yup.ref("fromDate"), "To date cannot be before From date"),
    reason: Yup.string()
      .required("Reason for leave is required")
      .min(10, "Reason must be at least 10 characters")
      .max(500, "Reason cannot exceed 500 characters"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const record = {
      leaveType: values.leaveType,
      startDate: values.fromDate,
      endDate: values.toDate,
      reason: values.reason,
      appliedAt: new Date().toISOString(),
    };

    try {
      const userDocRef = doc(db, "employee", userEmail);
      const adminDocRef = doc(db, "admin", userEmail);
      await updateDoc(userDocRef, {
        leaveRecords: arrayUnion(record),
      });
      await updateDoc(adminDocRef, {
        leaveRecords: arrayUnion(record),
      });

      toast.success("Leave Applied Successfully", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });

      resetForm();
      setFormData({ leaveType: "", fromDate: "", toDate: "", reason: "" });
    } catch (error) {
      console.error("Error updating leave records:", error);
      toast.error("Failed to apply leave. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  useEffect(() => {
    // no-op: keep formData in sync if needed
  }, [formData]);

  return (
    <div className="w-full mx-auto px-4 py-8 my-30 flex flex-col items-center justify-center md:flex-row gap-8">
      <ToastContainer />

      <div className="md:w-1/3 bg-white shadow-md rounded-lg p-6  shadow-lg shadow-black ">
        <h2 className="text-xl font-semibold mb-4 text-center">Apply Leave</h2>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values }) => {
            useEffect(() => {
              setFormData(values);
            }, [values]);

            return (
              <Form className="flex flex-col space-y-4">
                <div>
                  <label htmlFor="leaveType" className="block mb-1 font-medium">
                    Leave Type
                  </label>
                  <Field
                    as="select"
                    name="leaveType"
                    className="w-full border border-gray-300 rounded p-2"
                  >
                    <option value="" disabled hidden>
                      Select an option
                    </option>
                    <option value="WFH">Work From Home</option>
                    <option value="On Duty">On Duty</option>
                    <option value="Privilege">Privilege</option>
                    <option value="Casual">Casual Leave</option>
                    <option value="Maternity">Maternity Leave</option>
                  </Field>
                  <ErrorMessage
                    name="leaveType"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="fromDate" className="block mb-1 font-medium">
                    From Date
                  </label>
                  <Field
                    type="date"
                    name="fromDate"
                    className="w-full border border-gray-300 rounded p-2"
                  />
                  <ErrorMessage
                    name="fromDate"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="toDate" className="block mb-1 font-medium">
                    To Date
                  </label>
                  <Field
                    type="date"
                    name="toDate"
                    className="w-full border border-gray-300 rounded p-2"
                  />
                  <ErrorMessage
                    name="toDate"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="reason" className="block mb-1 font-medium">
                    Reason
                  </label>
                  <Field
                    as="textarea"
                    name="reason"
                    rows={3}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                  <ErrorMessage
                    name="reason"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="self-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2 transition"
                >
                  Apply
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default ApplyLeave;
