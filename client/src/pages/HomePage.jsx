import { useNavigate } from "react-router-dom";
import { Users, UserPlus, DollarSign, Armchair, BookOpen } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Add New Member",
      desc: "Register new library members with personal details and seat assignments.",
      icon: UserPlus,
      path: "/add-member",
      bgIcon:
        "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
      borderHover: "hover:border-blue-200",
    },
    {
      title: "Manage Members",
      desc: "View all active members, manage their status and details.",
      icon: Users,
      path: "/active-members",
      bgIcon:
        "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white",
      borderHover: "hover:border-green-200",
    },
    {
      title: "Payments",
      desc: "Track fee payments and view payment history in chronological order.",
      icon: DollarSign,
      path: "/money",
      bgIcon:
        "bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
      borderHover: "hover:border-amber-200",
    },
    {
      title: "Seating System",
      desc: "Visualize seating arrangements and track available seats.",
      icon: Armchair,
      path: "/seating",
      bgIcon:
        "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
      borderHover: "hover:border-purple-200",
    },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 py-6">
      {/* HERO / HEADER SECTION */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl">
        <BookOpen className="w-20 h-20 text-white mx-auto mb-6 animate-fade-in" />
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Library Management System
        </h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Manage members, payments, and seating arrangements in one efficient
          workspace.
        </p>
      </div>

      {/* GRID CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className={`
              group bg-white rounded-xl shadow-md p-6 cursor-pointer
              border border-slate-100 transition-all duration-300
              hover:shadow-xl hover:-translate-y-1 ${item.borderHover}
              animate-fade-in
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Icon Wrapper */}
            <div
              className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-colors ${item.bgIcon}`}
            >
              <item.icon className="w-7 h-7 transition-colors" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {item.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS / STATS SECTION */}
      <div className="bg-white rounded-xl shadow-md p-8 border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/add-member")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Register New Member
          </button>
          <button
            onClick={() => navigate("/seating")}
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            View Seating Map
          </button>
        </div>
      </div>

      {/* EMBEDDED KEYFRAME ANIMATION */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}