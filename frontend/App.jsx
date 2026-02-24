import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CitizenApp from "./citizen-portal/App";
import AdminApp from "./admin-portal/App";
import EmployeeApp from "./employee-portal/App";
import PartnerApp from "./partner-portal/App";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/citizen" element={<CitizenApp />} />
        <Route path="/admin" element={<AdminApp />} />
        <Route path="/employee" element={<EmployeeApp />} />
        <Route path="/partner" element={<PartnerApp />} />
        <Route path="*" element={<CitizenApp />} /> {/* Default */}
      </Routes>
    </Router>
  );
}
