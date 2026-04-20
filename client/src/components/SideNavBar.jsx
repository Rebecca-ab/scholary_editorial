import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

export default function SideNavBar({ selectedCourse, onCourseChange }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get('/courses').then((res) => setCourses(res.data)).catch(() => {});
  }, []);

  function select(courseId) {
    onCourseChange(courseId);
    navigate('/');
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 pt-20 bg-slate-50 border-r border-slate-100 flex flex-col gap-2 p-3 z-40 overflow-y-auto">
      <nav className="flex flex-col gap-1">
        {/* All Notes */}
        <button
          onClick={() => select(null)}
          className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:translate-x-1 transition-transform duration-200 ${
            selectedCourse === null
              ? 'bg-white text-cyan-900 font-semibold shadow-sm'
              : 'text-slate-500 hover:bg-slate-200'
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={selectedCourse === null ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            menu_book
          </span>
          <span className="font-manrope text-xs">All Notes</span>
        </button>

        {/* Course items */}
        {courses.map((course) => {
          const isActive = selectedCourse === course.id;
          return (
            <button
              key={course.id}
              onClick={() => select(course.id)}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:translate-x-1 transition-transform duration-200 ${
                isActive
                  ? 'bg-white text-cyan-900 font-semibold shadow-sm'
                  : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                class
              </span>
              <span className="font-manrope text-xs text-left leading-tight">{course.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Upload Button */}
      {location.pathname !== '/upload' && (
        <button
          onClick={() => navigate('/upload')}
          className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-white font-manrope font-bold text-sm rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-200 mt-auto"
        >
          Upload New Note
        </button>
      )}
    </aside>
  );
}
