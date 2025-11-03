import { Outlet, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col border-r border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 h-[70px] flex items-center">
          <h2 className="text-xl font-bold text-gray-800">My Dashboard</h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            Dashboard
          </Link>
         
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1">
          <Outlet />
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
