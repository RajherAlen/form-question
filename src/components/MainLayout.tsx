import { LayoutDashboard, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { logOut } from "../lib/auth";
import LogoIcon from "./Logo";

export default function MainLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-[200px] bg-white shadow-lg flex flex-col border-r border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 h-[70px] flex items-center">
          <LogoIcon />
        </div>

        <nav className="flex-1 flex flex-col justify-between px-2 py-6 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 text-gray-700 cursor-pointer rounded text-sm"
          >
            <LayoutDashboard width={18} height={18} />
            Dashboard
          </Link>

          <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 text-gray-700 cursor-pointer rounded text-sm" onClick={logOut}>
            <LogOut width={18} height={18} />
            Log out
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1">
          {children}
        </main>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
