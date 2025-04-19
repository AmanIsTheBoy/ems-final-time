import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../connection/firebase";
import { FiChevronDown, FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "../Store/AuthStore";
import { useLocation } from "react-router-dom"; // ✅ Added

Modal.setAppElement("#root");

const Employees = () => {
  const [users, setUsers] = useState([]);
  const [openEmployees, setOpenEmployees] = useState([]);
  const [openInfo, setOpenInfo] = useState([]);
  const [openLeave, setOpenLeave] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { userEmail } = useAuthStore();
  const location = useLocation(); // ✅ Added

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

  // ✅ Show toast on successful employee addition
  useEffect(() => {
    if (location.state?.added) {
      toast.success("Employee added successfully!");
      // Clear history state so it doesn't re-trigger on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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

  const handleDelete = async (email) => {
    try {
      await deleteDoc(doc(db, "admin", email));
      await deleteDoc(doc(db, "employee", email));
      toast.success("Employee deleted");
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee.");
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingUser(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      await updateDoc(doc(db, "admin", editingUser.email), {
        work: editingUser.work,
        salary: editingUser.salary,
        phone: editingUser.phone,
        address: editingUser.address,
        Project: editingUser.Project,
      });
      await updateDoc(doc(db, "employee", editingUser.email), {
        work: editingUser.work,
        salary: editingUser.salary,
        phone: editingUser.phone,
        address: editingUser.address,
        Project: editingUser.Project,
      });
      toast.success("Employee updated");
      closeEditModal();
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee.");
    }
  };

  const handleAction = async (userId, rec, action) => {
    if (!rec || typeof rec !== "object" || !rec.startDate) {
      toast.error("Invalid leave record");
      return;
    }

    const userDocRef = doc(db, "employee", userId);
    const adminDocRef = doc(db, "admin", userId);
    const updatedRec = { ...rec, status: action === "accept" ? "accepted" : "rejected" };

    try {
      await updateDoc(userDocRef, { leaveRecords: arrayRemove(rec) });
      await updateDoc(userDocRef, { leaveRecords: arrayUnion(updatedRec) });
      try {
        await updateDoc(adminDocRef, { leave: {} });
      } catch (adminError) {
        console.warn("Admin leave update failed:", adminError);
      }

      toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)}ed leave for ${userId}`);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error updating leave status:", error);
      toast.error("Failed to update leave status.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-20">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-8 text-center">Employees</h1>

      {users.map((user) => {
        const empOpen = openEmployees.includes(user.id);
        const records = user.leave

        return (
          <div
            key={user.id}
            className="border rounded shadow-sm mb-4 overflow-hidden"
          >
            <div className="w-full flex items-center justify-between bg-gray-100 px-4 py-3 font-medium">
              <button onClick={() => toggleEmployee(user.id)} className="flex-1 text-left">
                {user.name || user.email}
              </button>
              <div className="flex items-center gap-3">
                <FiEdit
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => openEditModal(user)}
                />
                <FiTrash2
                  className="text-red-600 hover:text-red-800 cursor-pointer"
                  onClick={() => handleDelete(user.email)}
                />
                <FiChevronDown
                  className={`ml-2 transition-transform duration-300 ${empOpen ? "rotate-180" : ""}`}
                />
              </div>
            </div>

            {empOpen && (
              <div className="bg-white">
                <button onClick={() => toggleInfo(user.id)} className="w-full flex justify-between px-6 py-2 border-b">
                  Information
                  <FiChevronDown
                    className={`transition-transform ${openInfo.includes(user.id) ? "rotate-180" : ""}`}
                  />
                </button>
                {openInfo.includes(user.id) && (
                  <div className="px-8 py-4 bg-gray-50 space-y-2">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Work:</strong> {user.work}</p>
                    <p><strong>Salary:</strong> {user.salary}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    <p><strong>Project:</strong> {user.Project}</p>
                  </div>
                )}

                <button onClick={() => toggleLeave(user.id)} className="w-full flex justify-between px-6 py-2 border-b">
                  Leave
                  <FiChevronDown
                    className={`transition-transform ${openLeave.includes(user.id) ? "rotate-180" : ""}`}
                  />
                </button>
                {openLeave.includes(user.id) && (
                  <div className="px-8 py-4 bg-gray-50 space-y-4">
                    {
                        <div className="border p-4 bg-white rounded">
                          <p><strong>Type:</strong> {records?.leaveType}</p>
                          <p><strong>From:</strong> {records?.startDate}</p>
                          <p><strong>To:</strong> {records?.endDate}</p>
                          <p><strong>Reason:</strong> {records?.reason}</p>
                          <p><strong>Applied At:</strong> {records?.appliedAt ? new Date(records?.appliedAt).toLocaleString() : "N/A"}</p>
                          <p><strong>Status:</strong> {records?.status}</p>
                          <div className="mt-2 flex gap-x-5">
                            <button onClick={() => handleAction(user.id, records, "accept")} className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Accept</button>
                            <button onClick={() => handleAction(user.id, records, "reject")} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">Reject</button>
                          </div>
                        </div>
                    }
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {editModalOpen && editingUser && (
        <Modal
          isOpen={editModalOpen}
          onRequestClose={closeEditModal}
          className="bg-white rounded-md p-6 w-[50%] mx-auto mt-25 shadow-lg"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
        >
          <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
          {["work", "salary", "phone", "address", "Project"].map((field) => (
            <div key={field} className="mb-2">
              <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={editingUser[field] || ""}
                onChange={handleEditChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          ))}
          <div className="flex justify-end mt-4 gap-3">
            <button onClick={handleEditSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
            <button onClick={closeEditModal} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Employees;
