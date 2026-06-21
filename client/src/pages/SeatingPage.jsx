import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Armchair,
  RefreshCw,
  CheckCircle,
  HelpCircle,
  LayoutGrid,
  UserCheck,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

export default function SeatingPage() {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSeats, setTotalSeats] = useState(100);

  const getToken = () => localStorage.getItem("token");

  const fetchSeating = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${API}/api/members`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const members = res.data || [];
      const occupiedSeats = members.map((m) => m.seat_number);
      const maxSeat = Math.max(totalSeats, ...occupiedSeats, 1);

      setTotalSeats(maxSeat);

      const memberMap = new Map();

      members.forEach((member) => {
        if (member.seat_number) {
          memberMap.set(member.seat_number, member);
        }
      });

      const seatMap = [];

      for (let i = 1; i <= maxSeat; i++) {
        const member = memberMap.get(i);

        seatMap.push({
          seat_number: i,
          is_filled: !!member,
          member_name: member?.full_name,
          member_id: member?._id,
        });
      }

      setSeats(seatMap);
    } catch (err) {
      console.error("Failed to fetch seating:", err);
    } finally {
      setLoading(false);
    }
  }, [totalSeats]);

  useEffect(() => {
    fetchSeating();
  }, [fetchSeating]);

  const filledSeats = seats.filter((s) => s.is_filled).length;
  const emptySeats = seats.filter((s) => !s.is_filled).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 space-y-8">

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shadow-inner">
            <Armchair className="text-indigo-600 w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Seating Arrangement
            </h1>
            <p className="text-slate-500 text-sm">
              Monitor floor allocation map and seat vacancies real-time
            </p>
          </div>
        </div>

        <button
          onClick={fetchSeating}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 shadow-sm transition-colors"
        >
          <RefreshCw
            className={`w-4 h-4 text-indigo-600 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh Layout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4 border border-slate-100">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <LayoutGrid className="w-5 h-5" />
          </div>

          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">
              Total Capacity
            </p>
            <h3 className="text-2xl font-bold text-slate-800">{seats.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4 border border-slate-100">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>

          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">
              Filled Seats
            </p>
            <h3 className="text-2xl font-bold text-emerald-600">
              {filledSeats}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4 border border-slate-100">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <HelpCircle className="w-5 h-5" />
          </div>

          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">
              Available Seats
            </p>
            <h3 className="text-2xl font-bold text-amber-600">
              {emptySeats}
            </h3>
          </div>
        </div>

      </div>

      {/* Seat Grid */}
      {loading ? (
        <div className="flex justify-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100">

          <h2 className="font-bold text-lg mb-6 text-slate-800">
            Main Floor Seating Grid
          </h2>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {seats.map((seat) => (
              <div
                key={seat.seat_number}
                className={`group relative flex flex-col items-center justify-center aspect-square rounded-2xl border cursor-pointer 
                transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-md
                ${
                  seat.is_filled
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-200"
                    : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100 hover:border-slate-200 hover:text-slate-600"
                }`}
              >
                {seat.is_filled ? (
                  <UserCheck className="w-6 h-6 mb-1" />
                ) : (
                  <Armchair className="w-6 h-6 mb-1" />
                )}

                <span className="text-xs font-bold">
                  #{seat.seat_number}
                </span>

                {seat.is_filled && seat.member_name && (
                  <div className="absolute hidden group-hover:block bottom-full mb-2 bg-slate-900 text-white text-xs px-3 py-2 rounded-xl z-10 pointer-events-none whitespace-nowrap shadow-lg">
                    Assigned To
                    <div className="font-bold text-emerald-400">
                      {seat.member_name}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}