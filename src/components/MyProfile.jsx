import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import useAuthStore from "../Store/AuthStore";
import { db } from "../connection/firebase";

function EmployeeForm() {
  
  const [employeeData, setEmployeeData] = useState({});
  const [editing, setEditing] = useState(false);
  var { userEmail } = useAuthStore();
  
  if (!userEmail) {
    userEmail = localStorage.getItem("userEmail")
  }

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!userEmail) return;

      try {
        const docRef = doc(db, "users", userEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEmployeeData(docSnap.data());
        } else {
          console.error("No such document!");
        }
      } catch (err) {
        console.error("Error fetching employee:", err);
      }
    };

    fetchEmployee();
  }, [userEmail]);

  const handleInputChange = (field, value) => {
    setEmployeeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = () => setEditing(true);

  const handleCancel = () => setEditing(false);

  const handleSave = async () => {
    if (!userEmail) return;

    try {
      await setDoc(doc(db, "employee", userEmail), employeeData);
      setEditing(false);
    }
     catch (error) {
      console.error("Error saving data:", error);
    }

  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-30">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
        Employee Profile
      </h2>

      {employeeData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-md mb-4">
              {employeeData.profilePicture ? (
                <img
                  src={employeeData.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
                  No Image
                </div>
              )}
            </div>

            {editing && (
              <div className="w-full text-center">
                <label className="block text-gray-700 font-medium mb-1">
                  Profile Picture URL
                </label>
                <input
                  type="text"
                  value={employeeData.profilePicture || ""}
                  onChange={(e) =>
                    handleInputChange("profilePicture", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="https://example.com/profile.jpg"
                />
              </div>
            )}
          </div>

          <form className="grid gap-4">
            {[
              { label: "First Name", key: "firstName" },
              { label: "Last Name", key: "lastName" },
              { label: "Phone", key: "phone" },
              { label: "Email", key: "email", type: "email" },
            ].map(({ label, key, type }, index) => (
              <div key={index}>
                <label className="block text-gray-700 font-medium mb-1">
                  {label}
                </label>
                <input
                  type={type || "text"}
                  value={employeeData[key] || ""}
                  onChange={(e) =>
                    handleInputChange(key, e.target.value)
                  }
                  readOnly={!editing}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    editing
                      ? "bg-white border-gray-300 focus:ring-blue-500"
                      : "bg-gray-100 border-gray-200 text-gray-600"
                  }`}
                />
              </div>
            ))}
          </form>
        </div>
      )}

      <div className="mt-6 text-right">
        {!editing ? (
          <button
            onClick={handleEdit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Edit
          </button>
        ) : (
          <div className="space-x-3">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeForm;
