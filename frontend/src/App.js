import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageCourses from './pages/ManageCourses';
import FeedbackReports from './pages/FeedbackReports';
import SubmitFeedback from './pages/SubmitFeedback';
import ProfilePage from './pages/ProfilePage';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}><div style={{ width: 48, height: 48, border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={`/${user.role}`} replace />;
  return children;
};

const App = () => {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={user ? <Navigate to={`/${user.role}`} replace /> : <LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute roles={['admin', 'coordinator']}><ManageCourses /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute roles={['admin', 'coordinator']}><FeedbackReports /></ProtectedRoute>} />
        <Route path="/faculty" element={<ProtectedRoute roles={['faculty']}><FacultyDashboard /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/submit" element={<ProtectedRoute roles={['student']}><SubmitFeedback /></ProtectedRoute>} />
        <Route path="/coordinator" element={<ProtectedRoute roles={['coordinator']}><CoordinatorDashboard /></ProtectedRoute>} />
        <Route path="/coordinator/courses" element={<ProtectedRoute roles={['coordinator']}><ManageCourses /></ProtectedRoute>} />
        <Route path="/coordinator/reports" element={<ProtectedRoute roles={['coordinator']}><FeedbackReports /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
