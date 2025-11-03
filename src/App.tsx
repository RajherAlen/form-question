import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./features/dashboard/Dashboard";
import FormPage from "./features/questions/FormPage";
import { IsLoggedInGuard } from "./components/IsLoggedInGuard";
import Login from "./features/login/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<IsLoggedInGuard><Dashboard /></IsLoggedInGuard>} />
          <Route path="/form/:clientId" element={<IsLoggedInGuard><FormPage /></IsLoggedInGuard>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
