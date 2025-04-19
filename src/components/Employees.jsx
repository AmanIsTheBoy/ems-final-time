import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../connection/firebase";
import { FiChevronDown } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "../Store/AuthStore";

const Employees = () => {
  const [users, setUsers] = useState([]);
  const [openEmployees, setOpenEmployees] = useState([]);
  const [openInfo, setOpenInfo] = useState([]);
  const [openLeave, setOpenLeave] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { userEmail } = useAuthStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "admin"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load employees. Please try again.");
      }
    };
    fetchUsers();
  }, [refresh]);

  const toggleEmployee = (id) => {
    setOpenEmployees((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  const toggleInfo = (id) => {
    setOpenInfo((prev) =>
      prev.includes(id) ? prev.filter((iid) => iid !== id) : [...prev, id]
    );
  };

  const toggleLeave = (id) => {
    setOpenLeave((prev) =>
      prev.includes(id) ? prev.filter((lid) => lid !== id) : [...prev, id]
    );
  };

  const handleAction = async (userId, rec, action) => {
    // Ensure rec is an object
    if (!rec || typeof rec !== "object" || !rec.startDate) {
      toast.error("Invalid leave record");
      return;
    }

    const userDocRef = doc(db, "employee", userId);
    const adminDocRef = doc(db, "admin", userId);
    const updatedRec = { ...rec, status: action === "accept" ? "accepted" : "rejected" };

    try {
      // Remove the old record
      await updateDoc(userDocRef, {
        leaveRecords: arrayRemove(rec),
      });

      // Add the updated record
      await updateDoc(userDocRef, {
        leaveRecords: arrayUnion(updatedRec),
      });

      // Attempt to update admin section if exists
      try {
        await updateDoc(adminDocRef, {
          leave: updatedRec,
        });
      } catch (adminError) {
        console.warn(
          "Admin leave update failed (possibly empty or missing doc)",
          adminError
        );
      }

      toast.success(
        `${action.charAt(0).toUpperCase() + action.slice(1)}ed leave for ${userId}`
      );
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error updating leave status:", error);
      toast.error("Failed to update leave status. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 my-30">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-20 text-center">Employees</h1>

      {users.map((user) => {
        const empOpen = openEmployees.includes(user.id);
        const records = Array.isArray(user.leaveRecords) ? user.leaveRecords : [];
        return (
          <div
            key={user.id}
            className="border rounded shadow-sm mb-4 overflow-hidden"
          >
            <button
              onClick={() => toggleEmployee(user.id)}
              className="w-full flex items-center justify-between bg-gray-100 px-4 py-3 font-medium focus:outline-none"
            >
              {user.name || user.email}
              <FiChevronDown
                className={`ml-2 transition-transform duration-300 ${
                  empOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {empOpen && (
              <div className="bg-white">
                <button
                  onClick={() => toggleInfo(user.id)}
                  className="w-full flex items-center justify-between px-6 py-2 border-b focus:outline-none"
                >
                  Information
                  <FiChevronDown
                    className={`ml-1 transition-transform duration-300 ${
                      openInfo.includes(user.id) ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openInfo.includes(user.id) && (
                  <div className="px-8 py-4 space-y-2 bg-gray-50">
                    <p>
                      <strong>Email:</strong> {user.email || "N/A"}
                    </p>
                    <p>
                      <strong>Work:</strong> {user.work || "N/A"}
                    </p>
                    <p>
                      <strong>Salary:</strong> {user.salary || "N/A"}
                    </p>
                    <p>
                      <strong>Phone:</strong> {user.phone || "N/A"}
                    </p>
                    <p>
                      <strong>Address:</strong> {user.address || "N/A"}
                    </p>
                    <p>
                      <strong>Project:</strong> {user.Project || "N/A"}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => toggleLeave(user.id)}
                  className="w-full flex items-center justify-between px-6 py-2 border-b focus:outline-none"
                >
                  Leave Records
                  <FiChevronDown
                    className={`ml-1 transition-transform duration-300 ${
                      openLeave.includes(user.id) ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openLeave.includes(user.id) && (
                  <div className="px-8 py-4 space-y-4 bg-gray-50">
                    {records.length > 0 ? (
                      records.map((rec, idx) => (
                        <div
                          key={idx}
                          className="border rounded p-4 bg-white"
                        >
                          <p>
                            <strong>Type:</strong> {rec.leaveType || "N/A"}
                          </p>
                          <p>
                            <strong>From:</strong> {rec.startDate || "N/A"}
                          </p>
                          <p>
                            <strong>To:</strong> {rec.endDate || "N/A"}
                          </p>
                          <p>
                            <strong>Reason:</strong> {rec.reason || "N/A"}
                          </p>
                          <p>
                            <strong>Applied At:</strong>{" "}
                            {rec.appliedAt
                              ? new Date(rec.appliedAt).toLocaleString()
                              : "N/A"}
                          </p>
                          <p>
                            <strong>Status:</strong> {rec.status || "pending"}
                          </p>
                          <div className="mt-2 flex gap-x-5">
                            <button
                              onClick={() => handleAction(user.id, rec, "accept")}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleAction(user.id, rec, "reject")}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No leave records.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Employees;