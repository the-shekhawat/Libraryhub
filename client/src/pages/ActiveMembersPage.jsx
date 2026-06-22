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
  UserCheck,
  X,
  MapPin,
} from "lucide-react";

export function ActiveMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [removingId, setRemovingId] = useState(null);

  // States for Editing Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState({
    full_name: "",
    seat_number: "",
    phone_number: "",
    verification_number: "",
    joining_date: "",
  });

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", errorText);
        setMembers([]);
        return;
      }

      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error("Fetch failed:", err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleEditClick = (member) => {
    setUpdatingId(member._id);
    setEditFormData({
      full_name: member.full_name || "",
      seat_number: member.seat_number || "",
      phone_number: member.phone_number || "",
      verification_number: member.verification_number || "",
      joining_date: member.joining_date ? member.joining_date.split("T")[0] : "",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API}/api/members/${updatingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editFormData,
          seat_number: Number(editFormData.seat_number),
        }),
      });

      const updatedMember = await res.json();

      console.log("Status:", res.status);
      console.log("Response:", updatedMember);

      if (!res.ok) {
        alert(updatedMember.message || "Update failed");
        return;
      }

      // Update the member in state
      setMembers((prev) =>
        prev.map((m) =>
          m._id === updatedMember._id ? updatedMember : m
        )
      );

      // Close the modal
      setShowEditModal(false);

      // Clear form
      setUpdatingId(null);
      setEditFormData({
        full_name: "",
        seat_number: "",
        phone_number: "",
        verification_number: "",
        joining_date: "",
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update Error:", err);
      alert("An error occurred while updating profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm("Remove this member?")) return;

    setRemovingId(id);
    try {
      const res = await fetch(`${API}/api/members/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Delete error:", errorText);
        alert("Failed to delete member");
        return;
      }

      setMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    } finally {
      setRemovingId(null);
    }
  };

  const filtered = members.filter((m) => {
    return (
      (m.full_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (m.phone_number || "").includes(searchTerm) ||
      String(m.seat_number || "").includes(searchTerm)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      {/* HEADER CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100/60">
            <Users className="text-emerald-600 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Active Members</h1>
            <p className="text-slate-400 text-xs sm:text-sm font-medium mt-0.5">
              Currently monitoring <span className="text-emerald-600 font-bold">{members.length}</span> active library profiles
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search by name, seat, phone..."
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/80 outline-none w-full md:w-72 text-sm font-medium transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={fetchMembers}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition shadow-sm font-semibold text-xs uppercase tracking-wider"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh List
          </button>
        </div>
      </div>

      {/* GRID CONTAINER */}
      {loading ? (
        <div className="flex justify-center py-32">
          <div className="animate-spin w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/60 shadow-sm max-w-md mx-auto">
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-6 h-6 text-slate-400" />
          </div>
          <h2 className="text-base font-bold text-slate-800">No Members Found</h2>
          <p className="text-slate-400 text-sm mt-1 px-6">We couldn't find matches matching your criteria. Try adjusting your search keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((m) => {
            const initial = m.full_name ? m.full_name.charAt(0).toUpperCase() : "?";
            return (
              <div
                key={m._id}
                className="group bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_4px_rgba(15,23,42,0.01)] hover:shadow-[0_16px_32px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30"
              >
                {/* CARD TOP CARD BANNER */}
                <div className="p-5 pb-4 bg-gradient-to-b from-slate-50/70 to-transparent border-b border-slate-100 flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Professional Color Gradient Avatar Box */}
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-700/10 flex items-center justify-center font-bold text-white shrink-0 text-sm select-none shadow-sm shadow-blue-500/10">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-base text-slate-800 tracking-tight truncate group-hover:text-blue-600 transition-colors">
                        {m.full_name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5 text-blue-600 text-xs font-bold bg-blue-50 px-2 py-0.5 rounded-md inline-flex w-fit">
                        <MapPin className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                        <span>Seat {m.seat_number}</span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION LAYER */}
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => handleEditClick(m)}
                      className="p-2 rounded-lg bg-slate-50 text-slate-500 border border-slate-200/60 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all duration-150"
                      title="Edit Profile"
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleRemove(m._id)}
                      disabled={removingId === m._id}
                      className="p-2 rounded-lg bg-slate-50 text-slate-500 border border-slate-200/60 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-150 disabled:opacity-50"
                      title="Delete Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* CARD DETAIL DATA SECTION */}
                <div className="p-5 bg-slate-50/30 space-y-3 text-xs font-medium text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone
                    </span>
                    <span className="text-slate-800 font-semibold tracking-wide bg-white px-2 py-1 rounded-md border border-slate-200/40">{m.phone_number}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Verification ID
                    </span>
                    <span className="bg-indigo-50/60 text-indigo-700 border border-indigo-100 px-2 py-1 rounded-md text-[11px] font-bold tracking-wide">
                      {m.verification_number || "None Supplied"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Enrollment Date
                    </span>
                    <span className="text-slate-700 font-semibold bg-white px-2 py-1 rounded-md border border-slate-200/40">
                      {m.joining_date ? new Date(m.joining_date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT MODAL DIALOG CONTAINER */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200/50 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-50/80 p-4 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Modify Profile Parameters
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 sm:p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={editFormData.full_name}
                  onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                  className="border border-slate-200 rounded-xl p-3 w-full bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition outline-none text-sm font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Seat Number</label>
                  <input
                    type="number"
                    value={editFormData.seat_number}
                    onChange={(e) => setEditFormData({ ...editFormData, seat_number: e.target.value })}
                    className="border border-slate-200 rounded-xl p-3 w-full bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition outline-none text-sm font-medium"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    value={editFormData.phone_number}
                    onChange={(e) => setEditFormData({ ...editFormData, phone_number: e.target.value })}
                    className="border border-slate-200 rounded-xl p-3 w-full bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition outline-none text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification Id/No.</label>
                <input
                  type="text"
                  value={editFormData.verification_number}
                  onChange={(e) => setEditFormData({ ...editFormData, verification_number: e.target.value })}
                  className="border border-slate-200 rounded-xl p-3 w-full bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition outline-none text-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Joining Date</label>
                <input
                  type="date"
                  value={editFormData.joining_date}
                  onChange={(e) => setEditFormData({ ...editFormData, joining_date: e.target.value })}
                  className="border border-slate-200 rounded-xl p-3 w-full bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition outline-none text-sm font-medium text-slate-600"
                  required
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-full border border-slate-200 p-3 rounded-xl text-slate-600 text-xs uppercase tracking-wider font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 text-white p-3 rounded-xl text-xs uppercase tracking-wider font-bold hover:bg-emerald-700 shadow-sm transition disabled:opacity-60"
                >
                  {isSubmitting ? "Saving changes..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}