import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  Plus,
  RefreshCw,
  Calendar,
  User,
  Armchair,
  Wallet,
  X,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function MoneyPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [formData, setFormData] = useState({
    member_id: "",
    payment_date: new Date().toISOString().split("T")[0],
    amount: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [membersRes, paymentsRes] = await Promise.all([
        axios.get(`${API}/api/members`, authHeader),
        axios.get(`${API}/api/fees`, authHeader),
      ]);

      setMembers(membersRes.data);
      setPayments(paymentsRes.data);
    } catch (err) {
      console.error("Error fetching database information:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(
        `${API}/api/fees`,
        {
          member_id: formData.member_id,
          payment_date: formData.payment_date,
          amount: Number(formData.amount),
        },
        authHeader
      );

      setShowForm(false);

      setFormData({
        member_id: "",
        payment_date: new Date().toISOString().split("T")[0],
        amount: "",
      });

      fetchData();
    } catch (err) {
      console.error("Failed to append fee payload entry:", err);
      alert("Failed to record fee processing transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalRevenue = payments.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  return (
    <div className="space-y-8 antialiased text-slate-800 p-4 sm:p-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition shadow-sm active:scale-95 flex items-center justify-center group"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-inner">
            <DollarSign className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">
              Fee Audits
            </h1>
            <p className="text-slate-500 text-xs font-medium mt-0.5">
              Track accounting records and log real-time library platform dues
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-50 transition disabled:opacity-60 shadow-sm"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-blue-600 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/25 hover:bg-blue-700 transition transform active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Record Invoice
          </button>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100/50">
            <Wallet className="w-5 h-5" />
          </div>

          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">
              Total Net Collections
            </p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-100/50">
            <User className="w-5 h-5" />
          </div>

          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">
              Processed Receipts
            </p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              {payments.length}
            </h3>
          </div>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-24 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto px-1">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-slate-400 font-bold text-xs tracking-wider uppercase">
                <th className="pb-1 pl-6">Settlement Date</th>
                <th className="pb-1 pl-4">Account Member</th>
                <th className="pb-1 pl-4">Assigned Unit</th>
                <th className="pb-1 text-right pr-6">Amount Cleared</th>
              </tr>
            </thead>

            <tbody className="text-sm text-slate-600 font-medium">
              {payments.map((p) => {
                const backendPopulatedMember =
                  p.member_id && typeof p.member_id === "object"
                    ? p.member_id
                    : undefined;

                const matchedMember =
                  p.member ||
                  backendPopulatedMember ||
                  members.find((m) => m._id === p.member_id);

                const resolvedName = matchedMember?.full_name;
                const resolvedSeat = matchedMember?.seat_number;

                const stringId =
                  typeof p.member_id === "string"
                    ? p.member_id
                    : p.member_id?._id || String(p._id);

                return (
                  <tr 
                    key={p._id} 
                    className="bg-white shadow-sm rounded-2xl border border-slate-100 group hover:shadow-md hover:bg-slate-50/50 transition-all duration-150"
                  >
                    <td className="p-4 pl-6 rounded-l-2xl">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        {new Date(p.payment_date).toLocaleDateString("en-IN", {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-800">
                      {resolvedName || (
                        <span className="text-slate-400 italic inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md text-xs">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                          Archived Member ({stringId.slice(-4)})
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      {resolvedSeat ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                          <Armchair className="w-3.5 h-3.5 text-slate-500" />
                          Seat {resolvedSeat}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    <td className="p-4 text-right font-black text-slate-900 pr-6 rounded-r-2xl">
                      ₹{p.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 transform scale-100 transition-transform">
            <div className="bg-slate-50/80 p-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <Wallet className="w-4 h-4 text-blue-600" />
                Record Transaction
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Account Member</label>
                <select
                  value={formData.member_id}
                  onChange={(e) =>
                    setFormData({ ...formData, member_id: e.target.value })
                  }
                  required
                  className="border border-slate-200 rounded-xl p-3 w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none text-sm font-medium"
                >
                  <option value="">Choose Member</option>
                  {members.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.full_name} — Seat {m.seat_number || "N/A"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Settlement Date</label>
                <input
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      payment_date: e.target.value,
                    })
                  }
                  className="border border-slate-200 rounded-xl p-3 w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none text-sm font-medium text-slate-700"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cleared Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: e.target.value,
                    })
                  }
                  className="border border-slate-200 rounded-xl p-3 w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none text-sm font-semibold text-slate-800"
                  min="1"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-full border border-slate-200 p-3 rounded-xl text-slate-600 text-xs uppercase tracking-wider font-bold hover:bg-slate-50 transition active:scale-95"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white p-3 rounded-xl text-xs uppercase tracking-wider font-bold hover:bg-blue-700 shadow-md shadow-blue-500/10 transition disabled:opacity-60 active:scale-95"
                >
                  {submitting ? "Processing..." : "Commit Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}