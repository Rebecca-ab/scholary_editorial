import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import FilePreview from '../components/FilePreview';

const STEPS = [
  { number: 1, label: 'File Upload' },
  { number: 2, label: 'Details & Metadata' },
  { number: 3, label: 'Review & Publish' },
];

function formatFileSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export default function UploadPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile]               = useState(null);
  const [dragOver, setDragOver]       = useState(false);
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId]       = useState('');
  const [pageCount, setPageCount]     = useState('');
  const [courses, setCourses]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [success, setSuccess]         = useState(false);
  const [publishedNote, setPublishedNote] = useState(null);

  useEffect(() => {
    api.get('/courses').then((res) => setCourses(res.data)).catch(() => {});
  }, []);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', title);
      fd.append('description', description);
      fd.append('courseId', courseId);
      if (pageCount) fd.append('pageCount', pageCount);
      const res = await api.post('/notes', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPublishedNote(res.data);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function resetAll() {
    setCurrentStep(1);
    setFile(null);
    setDragOver(false);
    setTitle('');
    setDescription('');
    setCourseId('');
    setPageCount('');
    setError(null);
    setSuccess(false);
    setPublishedNote(null);
  }

  /* ── Success screen ───────────────────────────────────────────────── */
  if (success) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span
            className="text-green-500 material-symbols-outlined"
            style={{ fontSize: '80px', fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          <h2 className="mt-6 mb-3 text-3xl font-bold font-manrope text-primary">
            Published Successfully!
          </h2>
          <p className="mb-8 font-body text-on-surface-variant">
            Your notes are now live in the editorial.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/notes/${publishedNote.id}`)}
              className="px-8 py-3 font-bold text-white transition-all rounded-full bg-primary font-manrope hover:opacity-90"
            >
              View Note
            </button>
            <button
              onClick={resetAll}
              className="px-8 py-3 font-bold transition-all border rounded-full border-outline-variant text-on-surface font-manrope hover:bg-surface-container"
            >
              Upload Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Drop zone class ──────────────────────────────────────────────── */
  const dropZoneClass = [
    'border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all bg-surface-container-lowest h-full',
    dragOver
      ? 'border-primary/60 bg-primary-fixed/20'
      : 'border-outline-variant/40 hover:border-primary/40',
  ].join(' ');

  /* ── Main render ──────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <h1 className="mb-1 text-4xl font-extrabold tracking-tight font-manrope text-primary">
        Share Your Academic Research
      </h1>
      <p className="text-lg italic font-body text-on-surface-variant">
        Contribute to the collective intelligence of the academic community.
      </p>

      {/* Progress indicator */}
      <div className="grid grid-cols-3 gap-4 my-5">
        {STEPS.map((step) => {
          const isActive = currentStep === step.number;
          return (
            <div
              key={step.number}
              className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-manrope font-bold shrink-0 ${
                  isActive ? 'bg-white/20' : 'bg-surface-container-highest'
                }`}
              >
                {step.number}
              </div>
              <span className="text-sm font-semibold font-manrope">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* ── STEP 1 ── */}
      {currentStep === 1 && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Drop zone */}
            <div className="lg:col-span-8">
              {!file ? (
                <div
                  className={dropZoneClass}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    setFile(e.dataTransfer.files[0]);
                  }}
                >
                  <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary-fixed">
                    <span
                      className="material-symbols-outlined text-primary"
                      style={{ fontSize: '34px' }}
                    >
                      upload_file
                    </span>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold font-manrope text-primary">
                    Drag and drop your file
                  </h3>
                  <p className="mb-5 font-body text-on-surface-variant">
                    PDF, DOC, DOCX, PNG, JPG supported — max 20MB
                  </p>
                  <label className="px-8 py-3 text-sm font-bold text-white transition-all rounded-full cursor-pointer bg-primary font-manrope hover:opacity-90">
                    Select File from Device
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </label>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden border-2 border-primary/40 bg-surface-container-lowest h-[380px]">
                  <FilePreview file={file} />
                  {/* Overlay action icons */}
                  <div className="absolute flex gap-2 bottom-4 right-4">
                    <button
                      onClick={() => window.open(URL.createObjectURL(file), '_blank')}
                      title="View full file"
                      className="flex items-center justify-center w-10 h-10 text-white transition-all rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
                    </button>
                    <button
                      onClick={() => setFile(null)}
                      title="Remove file"
                      className="flex items-center justify-center w-10 h-10 text-white transition-all rounded-full bg-black/50 hover:bg-red-500/80 backdrop-blur-sm"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Info cards */}
            <div className="flex flex-col gap-4 lg:col-span-4">
              <div className="p-6 bg-surface-container-low rounded-3xl">
                <span className="block mb-3 material-symbols-outlined text-tertiary">
                  verified_user
                </span>
                <h4 className="mb-2 font-bold font-manrope text-primary">
                  Encrypted Storage
                </h4>
                <p className="text-sm text-on-surface-variant">
                  Stored on secure servers
                </p>
              </div>
              <div className="p-6 border bg-secondary-container/30 rounded-3xl border-secondary-container/50">
                <span className="block mb-3 material-symbols-outlined text-primary">
                  folder_open
                </span>
                <h4 className="mb-2 font-bold font-manrope text-primary">
                  Supported Formats
                </h4>
                <p className="text-sm text-on-surface-variant">
                  PDF, DOC, DOCX, PNG, JPG — max 20MB
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-5">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!file}
              className="px-10 py-3 font-bold text-white transition-all rounded-full bg-primary font-manrope disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
            >
              Continue to Details →
            </button>
          </div>
        </>
      )}

      {/* ── STEP 2 ── */}
      {currentStep === 2 && (
        <div className="p-8 bg-surface-container-low rounded-3xl">
          <div className="flex items-baseline justify-between pb-3 mb-6 border-b border-outline-variant/20">
            <h2 className="text-2xl font-bold font-manrope text-primary">
              Details &amp; Metadata
            </h2>
            <span className="text-xs tracking-widest uppercase font-manrope text-slate-500">
              Required Information
            </span>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block mb-2 text-xs font-bold tracking-widest uppercase font-manrope text-primary">
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Wave-Particle Duality Notes"
                className="w-full py-2 text-xl transition-colors bg-transparent border-b-2 outline-none border-outline-variant/30 focus:border-primary font-body text-on-surface placeholder:text-slate-400"
              />
            </div>

            {/* Course + Page Count */}
            <div className="grid grid-cols-2 gap-10">
              <div>
                <label className="block mb-2 text-xs font-bold tracking-widest uppercase font-manrope text-primary">
                  Course
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full py-2 text-lg transition-colors bg-transparent border-b-2 outline-none border-outline-variant/30 focus:border-primary font-body text-on-surface"
                >
                  <option value="">Select a course...</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-xs font-bold tracking-widest uppercase font-manrope text-primary">
                  Page Count
                </label>
                <input
                  type="number"
                  min="1"
                  value={pageCount}
                  onChange={(e) => setPageCount(e.target.value)}
                  placeholder="42"
                  className="w-full py-2 text-lg transition-colors bg-transparent border-b-2 outline-none border-outline-variant/30 focus:border-primary font-body text-on-surface placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-xs font-bold tracking-widest uppercase font-manrope text-primary">
                Abstract / Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Summarize your notes — topics covered, exam relevance..."
                className="w-full p-4 text-lg border-none shadow-sm outline-none resize-none bg-surface-container-lowest rounded-xl focus:ring-1 focus:ring-primary font-body text-on-surface"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-8 py-3 font-bold transition-all border rounded-full border-outline-variant text-on-surface font-manrope hover:bg-surface-container"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              disabled={!title || !courseId || !description}
              className="px-10 py-3 font-bold text-white transition-all rounded-full bg-primary font-manrope disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
            >
              Review &amp; Publish →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3 ── */}
      {currentStep === 3 && (
        <>
          <div className="p-8 mb-4 shadow-sm bg-surface-container-lowest rounded-3xl">
            <h2 className="mb-4 text-2xl font-bold font-manrope text-primary">
              Review Your Submission
            </h2>

            <div className="divide-y divide-outline-variant/20">
              {[
                { label: 'File',        value: file?.name },
                { label: 'Title',       value: title },
                { label: 'Course',      value: courses.find((c) => c.id === courseId)?.name },
                { label: 'Page Count',  value: pageCount || 'Not specified' },
                {
                  label: 'Description',
                  value: description.length > 100
                    ? description.slice(0, 100) + '...'
                    : description,
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-3">
                  <span className="text-xs tracking-widest uppercase font-manrope text-on-surface-variant">
                    {label}
                  </span>
                  <span className="max-w-xs font-bold text-right font-manrope text-on-surface">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="mb-4 text-sm text-error font-manrope">{error}</p>
          )}

          <div className="flex flex-col items-center justify-between gap-4 pt-6 border-t sm:flex-row border-outline-variant/20">
            <div>
              <p className="text-lg font-bold font-manrope text-primary">
                Ready to contribute?
              </p>
              <p className="text-sm italic font-body text-on-surface-variant">
                You can delete this note later from your profile.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-8 py-4 font-bold transition-all border rounded-full border-outline-variant text-on-surface font-manrope hover:bg-surface-container"
              >
                ← Edit Details
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-3 px-10 py-4 font-bold text-white transition-all rounded-full shadow-lg bg-gradient-to-r from-primary to-primary-container font-manrope hover:opacity-90 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    Publish to Editorial
                    <span className="text-lg material-symbols-outlined">library_add</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
