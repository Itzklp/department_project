import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/auth/ResetPassword";

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

// Components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes - Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/api/v1/auth/resetpassword/:resetToken" element={<ResetPassword />} />
          {/* Semi-Protected - Change Password */}
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Manual Forms - Protected */}
          <Route 
            path="/forms/faculty" 
            element={
              <ProtectedRoute>
                <FacultyForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forms/publication" 
            element={
              <ProtectedRoute>
                <PublicationForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forms/project" 
            element={
              <ProtectedRoute>
                <ProjectForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forms/conference" 
            element={
              <ProtectedRoute>
                <ConferenceForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forms/phd-thesis" 
            element={
              <ProtectedRoute>
                <PhdThesisForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forms/patent" 
            element={
              <ProtectedRoute>
                <PatentForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forms/published-book" 
            element={
              <ProtectedRoute>
                <PublishedBookForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forms/department-event" 
            element={
              <ProtectedRoute>
                <DepartmentEventForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forms/invited-talk" 
            element={
              <ProtectedRoute>
                <InvitedTalkForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forms/faculty-award" 
            element={
              <ProtectedRoute>
                <FacultyAwardForm />
              </ProtectedRoute>
            } 
          />

          {/* Bulk Upload - Protected */}
          <Route 
            path="/bulk-upload" 
            element={
              <ProtectedRoute>
                <BulkUpload />
              </ProtectedRoute>
            } 
          />

          {/* Redirect root to login or dashboard */}
          <Route 
            path="/" 
            element={
              localStorage.getItem("token") ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/login" replace />
            } 
          />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;