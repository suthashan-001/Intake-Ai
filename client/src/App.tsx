// Suthashan Tharmarajah
// 100-748-346

// react router
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

// app Pages
import DashboardPage from "./pages/DashboardPage";
import MyPatientsPage from "./pages/MyPatientsPage";
import PatientDetailPage from "./pages/PatientDetailPage";
import IntakeFormPage from "./pages/intake/IntakeFormPage";

function App() {
  return (
    // https://reactrouter.com/api/hooks/useLocation
    // uses react useLocation state
    <BrowserRouter>
      <Routes>
        {/* Dashboard - home page */}
        <Route path="/" element={<DashboardPage />} />

        {/* My Patients page */}
        <Route path="/patients" element={<MyPatientsPage />} />

        {/* Patient detail page - :id is the patient ID */}
        <Route path="/patients/:id" element={<PatientDetailPage />} />

        {/* Patient intake form - public route for patients */}
        {/* The concept is that the doctor sends a "public route link" to patients
        instead of patients loging into the platform themselves and creating an account, they just complete a form on a public route" */}
        <Route path="/intake/:token" element={<IntakeFormPage />} />

        {/* Placeholder routes for future pages - to implement in the future */}
        <Route path="/intake-links" element={<DashboardPage />} />
        <Route path="/settings" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
