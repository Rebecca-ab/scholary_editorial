import { useState, useEffect } from 'react';
import api from '../api/axios';
import NoteCard from '../components/NoteCard';

const SORT_OPTIONS = [
  { label: 'Relevant',  value: 'latest' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'Downloads', value: 'downloads' },
];

export default function BrowsePage({ selectedCourse }) {
  const [notes, setNotes]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch]           = useState('');
  const [sort, setSort]               = useState('latest');
  const [courses, setCourses]         = useState([]);

  useEffect(() => {
    api.get('/courses').then((res) => setCourses(res.data)).catch(() => {});
  }, []);

  // Debounce searchInput → search
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch notes on search / sort / department change
  useEffect(() => {
    let cancelled = false;
    async function fetchNotes() {
      setLoading(true);
      setError(null);
      try {
        const params = { sort };
        if (search) params.search = search;
        const res = await api.get('/notes', { params });
        if (cancelled) return;
        let data = res.data;
        if (selectedCourse) {
          data = data.filter((n) => n.courseId === selectedCourse);
        }
        setNotes(data);
      } catch {
        if (!cancelled) setError('Failed to load notes. Is the server running?');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchNotes();
    return () => { cancelled = true; };
  }, [search, sort, selectedCourse]);

  return (
    <div className="max-w-full overflow-x-hidden">
      {/* Header */}
      {selectedCourse ? (() => {
        const course = courses.find((c) => c.id === selectedCourse);
        return (
          <>
            <h1 className="mb-2 text-4xl font-extrabold tracking-tight font-manrope text-on-surface">
              {course?.name ?? ''}
            </h1>
            <p className="max-w-2xl mb-10 text-base font-body text-on-surface-variant">
              {course?.code ?? ''}
            </p>
          </>
        );
      })() : (
        <>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight font-manrope text-on-surface">
            Discovery Feed
          </h1>
          <p className="max-w-2xl mb-10 text-base font-body text-on-surface-variant">
            Explore peer-curated academic notes from the American University of Cyprus.
          </p>
        </>
      )}

      {/* Search & filter hub */}
      <div className="flex flex-wrap gap-4 mb-12">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <span className="absolute -translate-y-1/2 pointer-events-none select-none material-symbols-outlined left-5 top-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            placeholder="Search notes, topics, courses…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full py-4 pr-6 text-sm border-none rounded-full pl-14 bg-surface-container-highest font-manrope focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Sort pills */}
        <div className="flex items-center p-1 rounded-full bg-surface-container-low shrink-0">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setSort(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-manrope transition-all ${
                sort === opt.value
                  ? 'bg-surface-container-lowest shadow-sm font-semibold text-on-surface'
                  : 'text-on-surface-variant hover:bg-surface-container-lowest/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-12 h-12 border-4 rounded-full border-primary border-t-transparent animate-spin" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex justify-center py-24">
          <p className="text-center font-manrope text-error">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && notes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span
            className="material-symbols-outlined text-on-surface-variant/30"
            style={{ fontSize: '4rem' }}
          >
            description
          </span>
          <p className="mt-4 text-xl font-bold font-manrope text-on-surface">No notes found</p>
          <p className="mt-2 font-body text-on-surface-variant">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Bento grid */}
      {!loading && !error && notes.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 mb-12 lg:grid-cols-12">
            {notes.length === 1 ? (
              <div className="lg:col-span-12">
                <NoteCard note={notes[0]} featured />
              </div>
            ) : (
              <>
                <div className="lg:col-span-8">
                  <NoteCard note={notes[0]} featured />
                </div>
                <div className="lg:col-span-4">
                  <NoteCard note={notes[1]} />
                </div>
              </>
            )}
            {notes.slice(2).map((note) => (
              <div key={note.id} className="lg:col-span-4">
                <NoteCard note={note} />
              </div>
            ))}
          </div>

        </>
      )}
    </div>
  );
}
