import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "User";
  const firstLetter = name.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <div className="relative">
      {/* Avatar Button */}
      <div
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer select-none"
      >
        {firstLetter}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-md z-50">
          <button
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
            className="w-full text-left px-3 py-2 hover:bg-gray-100"
          >
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}