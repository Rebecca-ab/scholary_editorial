import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopNavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-cyan-700 font-bold border-b-2 border-cyan-700 pb-1 transition-all duration-200'
      : 'text-slate-500 hover:text-cyan-800 transition-all duration-200';

  const dashboardActive = location.pathname === '/' || location.pathname.startsWith('/notes');
  const dashboardClass = dashboardActive
    ? 'text-cyan-700 font-bold border-b-2 border-cyan-700 pb-1 transition-all duration-200'
    : 'text-slate-500 hover:text-cyan-800 transition-all duration-100';

  return (
    <nav className="bg-white/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="flex justify-between items-center px-6 py-3 max-w-full">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-8">
          <span className="text-lg font-bold tracking-tighter text-cyan-950 font-manrope select-none">
            The Scholarly Editorial
          </span>
          <div className="hidden md:flex items-center gap-6 font-manrope text-xs uppercase tracking-widest">
            <button onClick={() => navigate('/')} className={dashboardClass}>Dashboard</button>
            <NavLink to="/upload" className={linkClass}>Uploads</NavLink>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>notifications</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary font-manrope font-bold text-sm flex items-center justify-center cursor-pointer select-none">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => { logout(); navigate('/auth'); }}
                className="font-manrope text-xs uppercase tracking-widest text-slate-500 hover:text-error transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="font-manrope text-xs uppercase tracking-widest text-primary font-bold hover:underline"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
