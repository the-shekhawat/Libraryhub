import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  User,
  Phone,
  Layers,
  Calendar,
  Armchair,
  ArrowLeft,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL||"";

export function AddMemberPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    verification_number: "",
    joining_date: new Date().toISOString().split("T")[0],
    seat_number: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${API}/api/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          verification_number: formData.verification_number || null,
          joining_date: formData.joining_date,
          seat_number: Number(formData.seat_number),
          is_active: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add member");
      }

      setSuccess(true);

      setFormData({
        full_name: "",
        phone_number: "",
        verification_number: "",
        joining_date: new Date().toISOString().split("T")[0],
        seat_number: "",
      });

      setTimeout(() => {
        navigate("/money");
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50/50 to-slate-50 p-6 sm:p-10 animate-fade-in">
      
      {/* EXPANDED CONTAINER SCALE */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-blue-500/5 border border-blue-100 overflow-hidden transition-all duration-300">
        
        {/* LIGHT BLUE BRANDING HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 p-8 text-white relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Decorative Overlay Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_45%)]" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center shadow-inner ring-1 ring-white/20">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Register New Subscriber</h1>
              <p className="text-blue-100/80 text-xs font-medium mt-0.5">Provision fresh database entries and real-time floor seat map bindings.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-white/10 relative z-10 self-start sm:self-center backdrop-blur-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Cancel
          </button>
        </div>

        {/* CORE FORM INTERFACE */}
        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
          
          {/* USER NOTIFICATION CHIPS CONTAINER */}
          {success && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl animate-pulse">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs font-bold tracking-wide uppercase">Member added successfully! Redirecting to treasury logs...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-xs font-bold tracking-wide uppercase">Operational Halt: {error}</p>
            </div>
          )}

          {/* DYNAMIC ROW FORM LABELS FIELD MATRIX */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* FULL NAME INPUT */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                <User className="w-3.5 h-3.5 text-blue-500" /> Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. Alexander Wright"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm transition-all text-sm text-slate-800 font-medium placeholder:text-slate-400"
                required
              />
            </div>

            {/* PHONE NUMBER INPUT */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                <Phone className="w-3.5 h-3.5 text-emerald-500" /> Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="e.g. +1 (555) 019-2834"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm transition-all text-sm text-slate-800 font-medium placeholder:text-slate-400"
                required
              />
            </div>

            {/* VERIFICATION NUMBER INPUT */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                <Layers className="w-3.5 h-3.5 text-amber-500" /> Verification Number
              </label>
              <input
                type="text"
                name="verification_number"
                value={formData.verification_number}
                onChange={handleChange}
                placeholder="National ID / Library Token (Optional)"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm transition-all text-sm text-slate-800 font-medium placeholder:text-slate-400"
              />
            </div>

            {/* JOINING DATE SELECTION */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                <Calendar className="w-3.5 h-3.5 text-purple-500" /> Enrollment Date
              </label>
              <input
                type="date"
                name="joining_date"
                value={formData.joining_date}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm transition-all text-sm text-slate-800 font-medium cursor-pointer"
                required
              />
            </div>

            {/* FULL-WIDTH SPECIFIC SEAT FIELD */}
            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                <Armchair className="w-3.5 h-3.5 text-indigo-500" /> Workspace Seat Assignment
              </label>
              <input
                type="number"
                name="seat_number"
                value={formData.seat_number}
                onChange={handleChange}
                placeholder="Assign structural chair coordinates (e.g. 42)"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm transition-all text-sm text-slate-800 font-medium placeholder:text-slate-400"
                min="1"
                required
              />
            </div>

          </div>

          {/* BRIGHT BLUE SUBMIT ACTION BUTTON TRIGGER */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/10 transition-all duration-300 disabled:from-slate-200 disabled:to-slate-300 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? "Syncing Platform Node..." : "Commit Member Entry"}
            </button>
          </div>

        </form>
      </div>

      <style>
        {`
          .animate-fade-in {
            animation: fadeInBlock 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes fadeInBlock {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}