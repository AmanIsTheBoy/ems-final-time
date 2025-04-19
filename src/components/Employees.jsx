import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../connection/firebase";
import { FiEdit, FiTrash2, FiChevronDown } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [openIds, setOpenIds] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const snapshot = await getDocs(collection(db, "admin"));
        const emps = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setEmployees(emps);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, [refresh, location.state?.updated]);

  const toggleDetails = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteDoc(doc(db, "admin", id));
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        toast.success("Employee removed successfully");
      } catch (error) {
        console.error("Error removing employee:", error);
        toast.error("Failed to remove employee");
      }
    }
  };

  return (
    <div className="container mx-auto space-y-4 mt-30">
      <h1 className="text-2xl font-semibold mb-6">Employees</h1>
      {employees.length === 0 ? (
        <p className="text-center text-gray-500">No employees found.</p>
      ) : (
        employees.map((emp) => {
          const isOpen = openIds.includes(emp.id);
          return (
            <div key={emp.id} className="border rounded shadow-sm">
              <div className="flex items-center justify-between bg-gray-100 px-4 py-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleDetails(emp.id)}
                    className="flex items-center text-left font-medium focus:outline-none"
                  >
                    {emp.name}
                    <FiChevronDown
                      className={`ml-2 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEdit(emp.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Edit Employee"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Remove Employee"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="px-4 py-3 bg-white">
                  <p><strong>Email:</strong> {emp.email}</p>
                  <p><strong>Work:</strong> {emp.work}</p>
                  <p><strong>Salary:</strong> {emp.salary}</p>
                  <p><strong>Phone:</strong> {emp.phone}</p>
                  <p><strong>Address:</strong> {emp.address}</p>
                  <p><strong>Project:</strong> {emp.Project}</p>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Employees;
