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

      // If admin, set data directly
      if (userEmail.includes("@admin.com")) {
        setEmployeeData({
          email: userEmail,
          name: userEmail.split("@")[0],
        });
        return; // skip fetching from Firestore
      }

      try {
        const docRef = doc(db, "employee", userEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEmployeeData({name:docSnap.data().name,email:docSnap.data().email});
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
  console.log(employeeData)


  return (
    <div className="w-1/2 mx-auto p-6 bg-white rounded-xl shadow-lg mt-30">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
        {userEmail.split("@")[0]} profile
      </h2>

      {employeeData && (
        <div className="">

          <form className="grid gap-4">
            {[
              { label: "Name", key: "name" },
              { label: "Email Address", key: "email" },
            ].map(({ label, key, type }, index) => (
              <div key={index} className="w-full">
                <label className="block text-gray-700 font-medium mb-1">
                  {label}
                </label>
                {editing ? (
                  <input
                    type={type || "text"}
                    value={employeeData[key] || ""}
                    onChange={(e) =>
                      handleInputChange(key, e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white border-gray-300 focus:ring-blue-500"
                  />
                ) : (
                  <div className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-800">
                    {employeeData[key] || "—"}
                  </div>
                )}
              </div>
            ))}
          </form>

        </div>
      )}

    </div>
  );
}

export default EmployeeForm;
