import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./features/dashboard/Dashboard";
import FormPage from "./features/questions/FormPage";
import MainLayout from "./components/MainLayout";

export default function App() {
  return (
       <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/form/:clientId" element={<FormPage />} />
          <Route path="/form/create" element={<FormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
