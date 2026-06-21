import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Armchair,
  Mail,
  ShieldAlert,
  ArrowLeft,
  Layers,
  Sparkles,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function ProfilePage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "Not Available";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/api/members`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers(res.data);
      } catch (err) {
        console.error("Error loading profile data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const totalMembers = members.length;
  const occupiedSeats = members.map((m) => m.seat_number);
  const maxSeat = Math.max(50, ...occupiedSeats, 1);
  const emptySeats = maxSeat - totalMembers;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6 animate-pulse">
        <div className="h-32 bg-slate-200/60 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200/60 rounded-2xl" />
          ))}
        </div>
        <div className="h-80 bg-slate-200/60 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-8 antialiased text-slate-800 bg-slate-50/30 min-h-screen">
      {/* HEADER UTILITY BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Return to Hub
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100/50">
          <Activity className="w-3 h-3 animate-pulse" />
          System Live
        </div>
      </div>

      {/* HERO AVATAR BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-950/10 border border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center rounded-2xl text-3xl font-black shadow-inner uppercase">
              {name.charAt(0)}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {name}
              </h1>
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 hidden sm:block" />
            </div>

            <p className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-400 font-medium">
              <Mail className="w-4 h-4 text-slate-500" />
              {email}
            </p>
          </div>
        </div>
      </div>

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Members
            </p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {totalMembers}
            </h2>
          </div>

          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform duration-300">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Empty Seats
            </p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {emptySeats}
            </h2>
          </div>

          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-105 transition-transform duration-300">
            <Armchair className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Capacity
            </p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {maxSeat}
            </h2>
          </div>

          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform duration-300">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* MEMBER DIRECTORY */}
      <div className="bg-white border border-slate-200/70 shadow-sm rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Recent Member Directory
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Realtime sync with database registration logs
            </p>
          </div>

          <span className="self-start sm:self-auto text-xs font-extrabold text-blue-600 bg-blue-50/80 border border-blue-100/40 px-3 py-1.5 rounded-xl">
            Showing last 5 entries
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {members.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm font-medium flex flex-col items-center justify-center gap-3">
              <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <span>No active database workspace records detected.</span>
            </div>
          ) : (
            members
              .slice(-5)
              .reverse()
              .map((m) => (
                <div
                  key={m._id}
                  className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-600 font-bold text-sm flex items-center justify-center rounded-xl transition-all duration-300 uppercase shadow-sm">
                      {m.full_name.charAt(0)}
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                        {m.full_name}
                      </span>

                      <p className="text-[11px] text-slate-400 font-medium">
                        ID: {m._id.slice(-8)}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 font-bold rounded-xl text-xs border border-slate-200/60 group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:border-indigo-100/70 transition-all duration-300">
                    <Armchair className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    Seat {m.seat_number}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}