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
  Trash2,
  Clock,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function MoneyPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  // Custom states tracking manual active session adjustments
  const [renewingPayment, setRenewingPayment] = useState(null);

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
    months_paid: 1, 
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
      const payload = {
        member_id: formData.member_id,
        payment_date: formData.payment_date,
        amount: Number(formData.amount),
        months_paid: Number(formData.months_paid),
      };

      // DYNAMIC DISPATCH: Put updates existing entries; Post creates a new one
      if (renewingPayment) {
        await axios.put(
          `${API}/api/fees/${renewingPayment._id}`,
          payload,
          authHeader
        );
      } else {
        await axios.post(
          `${API}/api/fees`,
          payload,
          authHeader
        );
      }

      setShowForm(false);
      setRenewingPayment(null);
      setFormData({
        member_id: "",
        payment_date: new Date().toISOString().split("T")[0],
        amount: "",
        months_paid: 1,
      });

      fetchData();
    } catch (err) {
      console.error("Failed to process fee transaction payload:", err);
      alert("Failed to submit fee processing transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenRenewal = (payment) => {
    // Force the renewal cycle transaction date to start exactly from today
    const todayFormatted = new Date().toISOString().split("T")[0];

    const targetMemberId = typeof payment.member_id === "object" ? payment.member_id?._id : payment.member_id;

    setRenewingPayment(payment);
    setFormData({
      member_id: targetMemberId || "",
      payment_date: todayFormatted,
      amount: payment.amount || "",
      months_paid: payment.months_paid || 1,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this fee entry?")) {
      return;
    }

    setDeletingId(id);
    try {
      await axios.delete(`${API}/api/fees/${id}`, authHeader);
      setPayments((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete fee record:", err);
      alert("Failed to delete the transaction record.");
    } finally {
      setDeletingId(null);
    }
  };

  const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

  const getNextDueDate = (paymentDateString, monthsCount) => {
    if (!paymentDateString) return null;
    const paymentDate = new Date(paymentDateString);
    paymentDate.setMonth(paymentDate.getMonth() + (monthsCount || 1));
    return paymentDate;
  };

  const getCycleStyle = (months) => {
    if (months >= 12) return "bg-rose-50 text-rose-700 border border-rose-100/80";
    if (months >= 6) return "bg-amber-50 text-amber-700 border border-amber-100/80";
    if (months >= 3) return "bg-purple-50 text-purple-700 border border-purple-100/80";
    if (months >= 2) return "bg-indigo-50 text-indigo-700 border border-indigo-100/80";
    return "bg-slate-100 text-slate-700 border border-transparent";
  };

  return (
    <div className="space-y-6 sm:space-y-8 antialiased text-slate-800 p-3 sm:p-6 max-w-7xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 sm:p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition shadow-sm active:scale-95 flex items-center justify-center group shrink-0"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-inner shrink-0">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">Fee Audits</h1>
            <p className="text-slate-500 text-[11px] sm:text-xs font-medium mt-0.5 leading-normal">
              Track accounting records, manage multi-month cycles, and audit renewal pipelines
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-xl hover:bg-slate-50 transition disabled:opacity-60 shadow-sm"
          >
            <RefreshCw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button
            onClick={() => {
              setRenewingPayment(null);
              setShowForm(true);
            }}
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/25 hover:bg-blue-700 transition transform active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Record Invoice
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
          <div className="p-2.5 sm:p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100/50 shrink-0">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Total Net Collections</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h3>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
          <div className="p-2.5 sm:p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-100/50 shrink-0">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Processed Receipts</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">{payments.length}</h3>
          </div>
        </div>
      </div>

      {/* RENDER CONTROLLER */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 sm:p-24 flex justify-center items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div>
          {/* MOBILE ADAPTIVE VIEW */}
          <div className="block md:hidden space-y-4">
            {payments.map((p) => {
              const backendPopulatedMember = p.member_id && typeof p.member_id === "object" ? p.member_id : undefined;
              const matchedMember = p.member || backendPopulatedMember || members.find((m) => m._id === p.member_id);
              const resolvedName = matchedMember?.full_name;
              const resolvedSeat = matchedMember?.seat_number;
              const stringId = typeof p.member_id === "string" ? p.member_id : p.member_id?._id || String(p._id);
              const calculatedNextDue = p.next_due_date ? new Date(p.next_due_date) : getNextDueDate(p.payment_date, p.months_paid || 1);

              return (
                <div key={p._id} className="bg-white rounded-2xl p-4 border border-slate-150/80 shadow-sm space-y-3.5 relative">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 max-w-[65%]">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {resolvedName || `Archived Member (${stringId.slice(-4)})`}
                      </h4>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {new Date(p.payment_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenRenewal(p)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                        title="Renew Subscription"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        disabled={deletingId === p._id}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-150 active:scale-95"
                      >
                        {deletingId === p._id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    {resolvedSeat ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                        <Armchair className="w-3 h-3 text-slate-500 shrink-0" />
                        Seat {resolvedSeat}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md text-[11px]">No Unit</span>
                    )}

                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${getCycleStyle(p.months_paid)}`}>
                      {p.months_paid || 1} {p.months_paid > 1 ? "Months Plan" : "Month Single"}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Next Target Due</p>
                      {calculatedNextDue ? (
                        <div className="flex items-center gap-1 mt-0.5 text-xs font-bold text-amber-700">
                          <Clock className="w-3 h-3 text-amber-500" />
                          {calculatedNextDue.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Amount Cleared</p>
                      <span className="text-base font-black text-slate-900">₹{p.amount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto px-1">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-slate-400 font-bold text-xs tracking-wider uppercase whitespace-nowrap">
                  <th className="pb-1 pl-6">Settlement Date</th>
                  <th className="pb-1 pl-4">Account Member</th>
                  <th className="pb-1 pl-4">Assigned Unit</th>
                  <th className="pb-1 pl-4">Coverage Duration</th>
                  <th className="pb-1 pl-4 text-amber-600">Next Renewal Target</th>
                  <th className="pb-1 text-right pr-4">Amount Cleared</th>
                  <th className="pb-1 text-center pr-6 w-28">Actions</th>
                </tr>
              </thead>

              <tbody className="text-sm text-slate-600 font-medium">
                {payments.map((p) => {
                  const backendPopulatedMember = p.member_id && typeof p.member_id === "object" ? p.member_id : undefined;
                  const matchedMember = p.member || backendPopulatedMember || members.find((m) => m._id === p.member_id);
                  const resolvedName = matchedMember?.full_name;
                  const resolvedSeat = matchedMember?.seat_number;
                  const stringId = typeof p.member_id === "string" ? p.member_id : p.member_id?._id || String(p._id);
                  const calculatedNextDue = p.next_due_date ? new Date(p.next_due_date) : getNextDueDate(p.payment_date, p.months_paid || 1);

                  return (
                    <tr key={p._id} className="bg-white shadow-sm rounded-2xl border border-slate-100 group hover:shadow-md hover:bg-slate-50/50 transition-all duration-150 whitespace-nowrap">
                      <td className="p-4 pl-6 rounded-l-2xl">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          {new Date(p.payment_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-slate-800">
                        {resolvedName || (
                          <span className="text-slate-400 italic inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md text-xs">
                            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            Archived Member ({stringId.slice(-4)})
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {resolvedSeat ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                            <Armchair className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            Seat {resolvedSeat}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${getCycleStyle(p.months_paid)}`}>
                          {p.months_paid || 1} {p.months_paid > 1 ? "Months Plan" : "Month Single"}
                        </span>
                      </td>

                      <td className="p-4 font-semibold text-amber-700">
                        {calculatedNextDue ? (
                          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-800 w-fit px-2.5 py-1 rounded-lg text-xs font-bold">
                            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            {calculatedNextDue.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      <td className="p-4 text-right font-black text-slate-900 pr-4">
                        ₹{p.amount.toLocaleString("en-IN")}
                      </td>

                      <td className="p-4 text-center pr-6 rounded-r-2xl">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenRenewal(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 text-xs font-bold transition active:scale-95"
                            title="Renew Subscription Layout"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            ReNew
                          </button>
                          
                          <button
                            onClick={() => handleDelete(p._id)}
                            disabled={deletingId === p._id}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-150 active:scale-95"
                            title="Delete Entry"
                          >
                            {deletingId === p._id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                            ) : (
                              <Trash2 className="w-4 h-4 mx-auto" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TRANSACTION / RENEWAL MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 transition-all">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col">
            <div className="bg-slate-50/80 p-4 sm:p-5 flex justify-between items-center border-b border-slate-100 shrink-0">
              <h2 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <Wallet className="w-4 h-4 text-blue-600" />
                {renewingPayment ? "Renew Membership Term" : "Record Transaction"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setRenewingPayment(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Select Account Member</label>
                <select
                  value={formData.member_id}
                  onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
                  disabled={renewingPayment !== null}
                  required
                  className="border border-slate-200 rounded-xl p-2.5 sm:p-3 w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none text-xs sm:text-sm font-medium disabled:opacity-75 disabled:cursor-not-allowed"
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
                <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {renewingPayment ? "Renewal Cycle Start Date" : "Settlement Date (Starts From)"}
                </label>
                <input
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                  className="border border-slate-200 rounded-xl p-2.5 sm:p-3 w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none text-xs sm:text-sm font-medium text-slate-700"
                  required
                />
              </div>

              {/* RENEWAL CYCLE SELECTOR CONTAINER */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Deposit Plan Horizon (Cycle)</label>
                <select
                  value={formData.months_paid}
                  onChange={(e) => setFormData({ ...formData, months_paid: Number(e.target.value) })}
                  required
                  className="border border-slate-200 rounded-xl p-2.5 sm:p-3 w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none text-xs sm:text-sm font-semibold text-slate-800"
                >
                  <option value={1} className="text-slate-700 font-medium">1 Month (Standard Cycle)</option>
                  <option value={2} className="text-indigo-600 font-semibold">2 Months (Bi-Monthly Term)</option>
                  <option value={3} className="text-purple-600 font-semibold">3 Months (Quarterly Horizon Advance)</option>
                  <option value={6} className="text-amber-600 font-semibold">6 Months (Half-Yearly Long Plan)</option>
                  <option value={12} className="text-rose-600 font-bold">12 Months (Annual Mega Subscription)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Total Cleared Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="border border-slate-200 rounded-xl p-2.5 sm:p-3 w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none text-xs sm:text-sm font-semibold text-slate-800"
                  min="1"
                  required
                />
              </div>

              {formData.payment_date && (
                <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-[11px] sm:text-xs text-slate-500 flex flex-col gap-1">
                  <div>
                    Estimated Next Due Date:{" "}
                    <span className="font-bold text-slate-700">
                      {getNextDueDate(formData.payment_date, formData.months_paid)?.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setRenewingPayment(null);
                  }}
                  className="w-full border border-slate-200 p-2.5 sm:p-3 rounded-xl text-slate-600 text-[10px] sm:text-xs uppercase tracking-wider font-bold hover:bg-slate-50 transition active:scale-95"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white p-2.5 sm:p-3 rounded-xl text-[10px] sm:text-xs uppercase tracking-wider font-bold hover:bg-blue-700 shadow-md shadow-blue-500/10 transition disabled:opacity-60 active:scale-95"
                >
                  {submitting ? "Processing..." : renewingPayment ? "Confirm Renewal" : "Commit Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}