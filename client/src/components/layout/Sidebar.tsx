import { Link, useLocation } from "wouter";
import { ChartPie, Users, PlusCircle, Search, BarChart3, Presentation, MessageCircle, Settings, Brain, Mic, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/userSlice";
import { removeUserFromStorage } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: ChartPie },
  { name: "Instructor Management", href: "/instructors", icon: Users },
  { name: "Create Teacher", href: "/create", icon: PlusCircle },
  { name: "Search & Filter", href: "/search", icon: Search },
  { name: "Chat Demo", href: "/chat", icon: MessageCircle },
  { name: "Voice Chat", href: "/voice-chat", icon: Mic },
  { name: "AI Tutoring", href: "/tutoring", icon: Brain },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleLogout = () => {
    removeUserFromStorage();
    dispatch(clearUser());
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/login");
  };

  return (
    <div className="w-64 bg-gradient-to-br from-slate-50 to-slate-100 shadow-xl h-full border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-lg animate-float">
            <Presentation className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">AI Teachers</h1>
            <p className="text-sm text-slate-600">Management Hub</p>
          </div>
        </div>
      </div>
      
      {/* Scrollable navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 btn-shine",
                    isActive
                      ? "gradient-bg text-white shadow-lg"
                      : "text-slate-700 hover:bg-white hover:shadow-md hover:text-slate-900"
                  )}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout button at bottom */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-slate-700 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
