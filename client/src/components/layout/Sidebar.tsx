import { Link, useLocation } from "wouter";
import { ChartPie, Users, PlusCircle, Search, BarChart3, Presentation, MessageCircle, Settings, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: ChartPie },
  { name: "All Teachers", href: "/teachers", icon: Users },
  { name: "Create Teacher", href: "/create", icon: PlusCircle },
  { name: "Search & Filter", href: "/search", icon: Search },
  { name: "Chat Demo", href: "/chat", icon: MessageCircle },
  { name: "AI Tutoring", href: "/tutoring", icon: Brain },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-gradient-to-br from-slate-50 to-slate-100 shadow-xl sidebar-transition transform lg:translate-x-0 -translate-x-full fixed lg:relative z-30 h-full border-r border-slate-200">
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
      
      <nav className="p-4">
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
    </aside>
  );
}
