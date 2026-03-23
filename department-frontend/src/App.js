import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layout & Security
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import ResetPassword from "./pages/auth/ResetPassword";

// App Pages
import Dashboard from "./pages/Dashboard";
import QuickActions from "./pages/QuickActions"; // <-- Restored import
import Analytics from "./pages/Analytics";

// Form Pages
import FacultyForm from "./pages/forms/FacultyForm";
import PublicationForm from "./pages/forms/PublicationForm";
import ProjectForm from "./pages/forms/ProjectForm";
import ConferenceForm from "./pages/forms/ConferenceForm";
import PhdThesisForm from "./pages/forms/PhdThesisForm";
import PatentForm from "./pages/forms/PatentForm";
import PublishedBookForm from "./pages/forms/PublishedBookForm";
import DepartmentEventForm from "./pages/forms/DepartmentEventForm";
import InvitedTalkForm from "./pages/forms/InvitedTalkForm";
import FacultyAwardForm from "./pages/forms/FacultyAwardForm";
import BulkUpload from "./pages/bulk/BulkUpload";
import ManageUsers from "./pages/ManageUsers";

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/api/v1/auth/resetpassword/:resetToken" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* PROTECTED ROUTES (Wrapped in Layout with Navbar) */}
        <Route 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          {/* Restored Quick Actions Route */}
          <Route path="/quick-actions" element={<QuickActions />} /> 
          
          {/* Forms */}
          <Route path="/forms/faculty" element={<FacultyForm />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/forms/publication" element={<PublicationForm />} />
          <Route path="/forms/project" element={<ProjectForm />} />
          <Route path="/forms/conference" element={<ConferenceForm />} />
          <Route path="/forms/phd-thesis" element={<PhdThesisForm />} />
          <Route path="/forms/patent" element={<PatentForm />} />
          <Route path="/forms/published-book" element={<PublishedBookForm />} />
          <Route path="/forms/department-event" element={<DepartmentEventForm />} />
          <Route path="/forms/invited-talk" element={<InvitedTalkForm />} />
          <Route path="/forms/faculty-award" element={<FacultyAwardForm />} />
          <Route path="/bulk-upload" element={<BulkUpload />} />
        </Route>

        {/* REDIRECTS */}
        <Route 
          path="/" 
          element={
            localStorage.getItem("token") ? 
              <Navigate to="/dashboard" replace /> : 
              <Navigate to="/login" replace />
          } 
        />
        {/* If route is not found, it triggers this which sends you to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App; 