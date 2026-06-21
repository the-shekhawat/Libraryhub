import { useState, useEffect } from "react";
import {
  Users,
  Trash2,
  UserPlus,
  Search,
  RefreshCw,
  Calendar,
  Phone,
  ShieldCheck,
} from "lucide-react";

export function ActiveMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleRemove = async (id) => {
    if (!confirm("Remove this member?")) return;

    setRemovingId(id);

    try {
      await fetch(`${API}/api/members/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert("Failed to delete");
    } finally {
      setRemovingId(null);
    }
  };

  const filtered = members.filter(
    (m) =>
      m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone_number.includes(searchTerm) ||
      m.seat_number.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* HEADER CARD */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Users className="text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Active Members
            </h1>
            <p className="text-slate-500 text-sm">
              Total {members.length} members
            </p>
          </div>
        </div>

        {/* SEARCH + REFRESH */}
        <div className="flex gap-3">
          <button
            onClick={fetchMembers}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition text-slate-700 font-medium text-sm"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              placeholder="Search members..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* CONTENT SYSTEM */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow border border-slate-100">
          <UserPlus className="w-14 h-14 mx-auto text-slate-300" />
          <h2 className="text-xl font-semibold mt-2 text-slate-700">
            No Members Found
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((m) => (
            <div
              key={m._id}
              className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div>
                <div className="bg-blue-50 border-b border-blue-100/50 p-4 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 transition-colors group-hover:text-blue-700">
                      {m.full_name}
                    </h3>
                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-indigo-600 text-white font-semibold text-xs rounded-full">
                      Seat {m.seat_number}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemove(m._id)}
                    disabled={removingId === m._id}
                    className="p-2 rounded-lg bg-white text-red-500 shadow-sm border border-slate-100 hover:bg-red-50 hover:text-red-600 transition-all opacity-80 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 space-y-3.5 text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>{m.phone_number}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">
                      Verification:{" "}
                      <span className="font-medium text-slate-700">
                        {m.verification_number || "None"}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>
                      Joined:{" "}
                      <span className="font-medium text-slate-700">
                        {new Date(m.joining_date).toLocaleDateString()}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}