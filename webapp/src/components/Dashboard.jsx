import { useState, useEffect } from "react";
import supabase from "@/config/supabase";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  Settings,
  BarChart,
  Menu,
  ChevronLeft,
  MessageCircle,
  ChartScatterIcon,
  AlarmClock,
  ChartLine,
  ChartNoAxesGantt,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "@/components/ui/button";
import LoGo from "../assets/images/Logo.webp";
import bodysqllogo from "../assets/images/bodysql-logo.png";
import github from "../assets/images/github.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Navigate } from "react-router-dom";

const menuItems = [
  { icon: ChartNoAxesGantt, label: "Overview", to: "/" },
  { icon: ChartLine, label: "Analytics", to: "/analytics" },
  { icon: AlarmClock, label: "Medication Reminder", to: "/medi-alarm" },
  { icon: MessageCircle, label: "Chat", to: "/chat" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log("Error deleting applicant : ", error.message);
      } else {
        //console("Applicant Deleted Successfully");
        navigate("/login");
      }
    } catch (error) {
      console.log("Error deleting user:", error.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 z-50 flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          "bg-bgsidebar text-white"
        )}
      >
        {/* Sidebar Header */}
        <div className="border-b border-blue-500 bg-white text-black px-3 py-2 mb-3">
          <Link to="/">
            <div className="flex h-12 items-center justify-left">
              <img
                src={bodysqllogo}
                className="w-[200px] pb-5"
                alt="BodySQL Logo"
              />
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-sans transition-all",
                  "hover:bg-bgnavlink hover:text-white",
                  isActive
                    ? "bg-bgnavlink text-white"
                    : "text-blue-200 hover:text-white",
                  collapsed && "justify-center"
                )}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 bg-pagebg",
          collapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="sticky top-0 z-40 border-b bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <div>{/*  */}</div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      /* Navigate to Profile */
                    }}
                  >
                    Contribute
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      /* Navigate to Settings */
                    }}
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
