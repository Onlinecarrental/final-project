import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import logo from "../assets/LOGO.png";
function NavbarAgent() {
  const [agentName, setAgentName] = useState("Car Agent");

  useEffect(() => {
    const fetchAgentName = async () => {
      let uid = null;
      if (auth.currentUser) {
        uid = auth.currentUser.uid;
      } else {
        const localUser = JSON.parse(localStorage.getItem('user')) || {};
        uid = localUser.uid;
      }
      if (uid) {
        try {
          const agentDoc = await getDoc(doc(db, "agent", uid));
          if (agentDoc.exists()) {
            setAgentName(agentDoc.data().name || "Car Agent");
            return;
          }
        } catch (err) {
          // fallback below
        }
      }
      // fallback to localStorage or default
      const localUser = JSON.parse(localStorage.getItem('user')) || {};
      setAgentName(localUser.name || "Car Agent");
    };

    fetchAgentName();
  }, []);

  return (
    <div className="flex justify-between items-center w-full bg-gray px-4 py-4">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full mr-3 overflow-hidden">
          <img
            src={logo}
            alt="Car Agent Profile"
            className="w-full h-full object-cover bg-gray-200"
          />
        </div>
        <span className="text-black font-extrabold">{agentName}</span>
      </div>

    </div>
  );
}

export default NavbarAgent;