import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Users,
  DollarSign,
  Armchair,
  UserPlus,
  Mail,
  Lock,
  User,
  Library,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import API from "../api/axios";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/api/auth/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("email", res.data.user.email);

      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registration failed.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    {
      label: "Active Members",
      icon: Users,
      path: "/active-members",
    },
    {
      label: "Add Member",
      icon: UserPlus,
      path: "/add-member",
    },
    {
      label: "Fee Payments",
      icon: DollarSign,
      path: "/money",
    },
    {
      label: "Seat Allocations",
      icon: Armchair,
      path: "/seating",
    },
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50">
      {/* Left Side */}
      <div className="hidden lg:flex lg:col-span-7 bg-slate-900 text-white p-10 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <Library className="w-10 h-10 text-blue-400" />
            <h1 className="text-3xl font-bold">LibraryHub</h1>
          </div>

          <h2 className="text-5xl font-bold leading-tight">
            Library
            <br />
            Management
            <br />
            System
          </h2>

          <p className="text-slate-300 mt-6 max-w-lg">
            Manage members, seats, fee payments and library activities from one
            beautiful dashboard.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {quickLinks.map((item) => (
            <div key={item.label} className="bg-white/10 rounded-xl p-5">
              <item.icon className="w-8 h-8 mb-3 text-blue-400" />
              <h3 className="font-semibold">{item.label}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side */}
      <div className="lg:col-span-5 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-6">
          <div>
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <ShieldCheck className="text-blue-600 w-10 h-10" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center">Create Account</h2>

            <p className="text-center text-gray-500 mt-2">
              Register to access LibraryHub.
            </p>

            {error && (
              <div className="mt-5 bg-red-100 text-red-700 p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 disabled:opacity-60 transition"
            >
              {loading ? (
                "Creating..."
              ) : (
                <>
                  Register
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="space-y-6">
            <p className="text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Login
              </Link>
            </p>

            {/* Added Security Session Badge Container */}
            <div className="flex items-center justify-center gap-2 border-t border-slate-100 pt-6 text-xs font-medium text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Secured, end-to-end encrypted session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}