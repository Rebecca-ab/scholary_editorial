import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import TopNavBar from './components/TopNavBar';
import SideNavBar from './components/SideNavBar';
import Footer from './components/Footer';
import BrowsePage from './pages/BrowsePage';
import NoteDetailPage from './pages/NoteDetailPage';
import UploadPage from './pages/UploadPage';
import AuthPage from './pages/AuthPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Auth page: full-screen, no sidebar/navbar/footer
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  // Authenticated layout
  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      <TopNavBar />
      <div className="flex">
        <SideNavBar
          selectedCourse={selectedCourse}
          onCourseChange={setSelectedCourse}
        />
        <div className="flex-1 ml-64 pt-16 min-w-0 overflow-x-hidden flex flex-col min-h-screen">
          <main className="flex-1 p-8">
            <Routes>
              <Route path="/" element={<BrowsePage selectedCourse={selectedCourse} />} />
              <Route path="/notes/:id" element={<NoteDetailPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/auth" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
