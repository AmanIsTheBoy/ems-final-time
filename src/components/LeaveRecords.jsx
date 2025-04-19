import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../connection/firebase";
import useAuthStore from "../Store/AuthStore";

const LeaveRecords = () => {
  var { userEmail } = useAuthStore();
  
  if (!userEmail) {
    userEmail = localStorage.getItem("userEmail")
  }
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  const fetchLeaveRecords = async () => {
    setLoading(true);
    try {
      const employeeRef = doc(db, "employee", userEmail);
      const docSnap = await getDoc(employeeRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const leaves = Array.isArray(data.leaveRecords) ? data.leaveRecords : [];
        setLeaveRecords(leaves);
      } else {
        toast.error("No employee record found for this user.");
      }
    } catch (error) {
      console.error("Error fetching leave records:", error);
      toast.error("Failed to load leave records.");
    } finally {
      setLoading(false);
    }
  };

  const cancelLeave = async (leaveId) => {
    try {
      const employeeRef = doc(db, "employee", userEmail);
      const docSnap = await getDoc(employeeRef);

      if (docSnap.exists()) {
        const currentLeaves = docSnap.data().leaveRecords || [];

        const updatedLeaves = currentLeaves.map((leave) =>
          leave.leaveId === leaveId ? { ...leave, status: "Cancelled" } : leave
        );

        await updateDoc(employeeRef, {
          leaveRecords: updatedLeaves,
        });

        toast.success("Leave cancelled successfully.");
        fetchLeaveRecords();
      }
    } catch (error) {
      console.error("Error cancelling leave:", error);
      toast.error("Failed to cancel leave.");
    }
  };

  useEffect(() => {
    fetchLeaveRecords();
  }, []);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = leaveRecords.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Case-insensitive color map
  const statusColor = {
    pending: "bg-yellow-300 text-yellow-800",
    accepted: "bg-green-300 text-green-800",
    rejected: "bg-red-300 text-red-800",
    cancelled: "bg-gray-300 text-gray-800",
  };

  return (
    <div className="container mx-auto px-4 py-10 my-20">
      {loading ? (
        <p className="text-center text-lg">Loading leave records...</p>
      ) : leaveRecords.length === 0 ? (
        <p className="text-center text-lg">No leave records available.</p>
      ) : (
        <>
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Leave Record for <span className="text-blue-600">{userEmail.split("@")[0]}</span>
          </h1>

          <div className="overflow-x-auto pt-4">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                  <th className="py-3 px-4 border-b">#</th>
                  <th className="py-3 px-4 border-b">Type</th>
                  <th className="py-3 px-4 border-b">Reason</th>
                  <th className="py-3 px-4 border-b">Start Date</th>
                  <th className="py-3 px-4 border-b">End Date</th>
                  <th className="py-3 px-4 border-b">Status</th>
                  <th className="py-3 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((leave, index) => {
                  const startDate = new Date(leave.startDate).toDateString();
                  const endDate = new Date(leave.endDate).toDateString();
                  const canCancel = new Date(leave.startDate) > new Date();
                  const normalizedStatus = leave.status?.trim().toLowerCase();

                  return (
                    <tr key={leave.leaveId || index} className="border-t text-sm">
                      <td className="py-2 px-4">{indexOfFirst + index + 1}</td>
                      <td className="py-2 px-4">{leave.leaveType}</td>
                      <td className="py-2 px-4">{leave.reason}</td>
                      <td className="py-2 px-4">{startDate}</td>
                      <td className="py-2 px-4">{endDate}</td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            statusColor[normalizedStatus] || "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {canCancel && normalizedStatus === "pending" ? (
                          <button
                            onClick={() => cancelLeave(leave.leaveId)}
                            className="px-3 py-1 text-xs rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from(
              { length: Math.ceil(leaveRecords.length / recordsPerPage) },
              (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 text-sm rounded-md border ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LeaveRecords;
