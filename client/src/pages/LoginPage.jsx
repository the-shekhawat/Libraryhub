import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Library, ArrowRight, ShieldCheck } from "lucide-react";
import API from "../api/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const { data } = await API.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "name",
        data.user?.name || data.name || "Administrator"
      );

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Invalid email or password credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 antialiased text-slate-800">
      {/* LEFT COLUMN: AUTH FORM PANEL */}
      <div className="lg:col-span-5 flex flex-col justify-center p-8 sm:p-12 md:p-16 bg-white z-10 shadow-xl lg:shadow-none">
        {/* BRAND IDENTITY */}
        <div className="flex items-center gap-2.5 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
            <Library className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            Library<span className="text-blue-600">Hub</span>
          </span>
        </div>

        {/* HEADER BLOCK */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Sign in to manage active workspaces, track collections, and audit
            accounts.
          </p>
        </div>

        {/* ERROR CALLOUT BANNER */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="p-0.5 bg-rose-500 rounded-full text-white mt-0.5">
              <span className="text-[10px] font-bold block w-3.5 h-3.5 text-center leading-none">
                !
              </span>
            </div>
            <p className="text-xs font-semibold text-rose-700">{error}</p>
          </div>
        )}

        {/* FORM OPERATOR */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* EMAIL FIELD */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="admin@libraryhub.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 bg-slate-50 text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Password
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 bg-slate-50 text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* ACTION OPERATION SUBMIT */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/15 hover:shadow-xl hover:shadow-blue-500/25 transition disabled:bg-blue-400 group flex items-center justify-center gap-2 mt-2"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Access Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* SIGNUP LINK FOOTER */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 font-medium">
            New to the platform?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-bold hover:underline inline-flex items-center gap-0.5 group transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* SYSTEM AUDIT LOGO SUBTEXT */}
        <div className="mt-auto pt-8 flex items-center gap-2 text-xs text-slate-400 font-medium border-t border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secured Terminal End-to-End Encryption Enabled</span>
        </div>
      </div>

      {/* RIGHT COLUMN: MARKETING PROMO HERO */}
      <div className="hidden lg:col-span-7 lg:block relative bg-slate-900 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]"></div>

        <div className="absolute inset-0 flex flex-col justify-between p-16 z-10 text-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold self-start border border-white/10">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            Version 2026 Core Platform Upgrades Live
          </div>

          <div className="max-w-xl space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
              Transforming your traditional reading hall into a modern digital
              space.
            </h2>
            <p className="text-base text-slate-300 font-medium leading-relaxed">
              Eliminate messy manual clipboards. Safely lock down reserved
              seating maps, instantly calculate collection streams, and manage
              member renewals in real-time.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            <div>
              <p className="text-2xl font-black tracking-tight text-white">
                100%
              </p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                Seat Allocation
              </p>
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight text-white">
                Zero
              </p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                Missing Invoices
              </p>
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight text-white">
                Real-time
              </p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                Analytics Flow
              </p>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 object-cover w-full h-full opacity-30 select-none pointer-events-none scale-105 transform hover:scale-100 transition-transform duration-[10s]"></div>
      </div>
    </div>
  );
}