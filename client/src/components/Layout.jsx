import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  UserPlus,
  Users,
  DollarSign,
  Armchair,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function Layout() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "User";
  const firstLetter = name.charAt(0).toUpperCase();

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/add-member", icon: UserPlus, label: "Add Member" },
    { to: "/active-members", icon: Users, label: "Active Members" },
    { to: "/money", icon: DollarSign, label: "Fee Payments" },
    { to: "/seating", icon: Armchair, label: "Seating" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* LEFT TITLE */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-black text-lg">L</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-950 to-blue-800 bg-clip-text text-transparent">
                Library<span className="font-medium text-blue-600">Hub</span>
              </span>
            </div>

            {/* NAV LINKS */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/40">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 group relative ${
                      isActive
                        ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="hidden lg:inline">{label}</span>
                </NavLink>
              ))}
            </div>

            {/* PROFILE SECTION */}
            <div className="relative" ref={dropdownRef}>
              {/* AVATAR TRIGGER */}
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-slate-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shadow-sm uppercase tracking-wider text-sm select-none transform active:scale-95 transition-transform duration-150">
                  {firstLetter}
                </div>
                <span className="hidden md:inline text-sm font-semibold text-slate-700 max-w-[100px] truncate">
                  {name}
                </span>
              </button>

              {/* DROPDOWN MENU */}
              {open && (
                <div className="absolute right-0 mt-2.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden origin-top-right transform transition-all animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Dropdown User Info Banner */}
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Signed in as
                    </p>
                    <p className="text-sm font-bold text-slate-800 truncate mt-0.5">
                      {name}
                    </p>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition duration-150"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      View Profile
                    </button>

                    <hr className="border-slate-100 my-1 mx-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition duration-150"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
        <Outlet />
      </main>
    </div>
  );
}