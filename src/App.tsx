import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./features/dashboard/Dashboard";
import FormPage from "./features/questions/FormPage";
import { IsLoggedInGuard } from "./components/IsLoggedInGuard";
import Login from "./features/login/Login";
import { ToastContainer } from "react-toastify";
import TeamsPage from "./features/TeamsPage";

export default function App() {
  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<IsLoggedInGuard><Dashboard /></IsLoggedInGuard>} />
            <Route path="/form/:id" element={<IsLoggedInGuard><FormPage /></IsLoggedInGuard>} />
            <Route path="/teams" element={<IsLoggedInGuard><TeamsPage /></IsLoggedInGuard>} />
          </Route>
        </Routes>
      </BrowserRouter>
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
    </>

  );
}
