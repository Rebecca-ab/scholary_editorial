import { Link } from 'react-router-dom';

const SERVER = 'http://localhost:5000';

const deptColor = {
  Sciences: 'text-green-700',
  Humanities: 'text-tertiary',
  Engineering: 'text-on-surface-variant',
  Arts: 'text-pink-700',
};

function formatDownloads(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k downloads` : `${n} downloads`;
}

function StarDisplay({ rating }) {
  return (
    <span className="flex items-center gap-1 text-tertiary">
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
      >
        star
      </span>
      <span className="font-manrope text-sm font-bold">
        {rating > 0 ? rating.toFixed(1) : '—'}
      </span>
    </span>
  );
}

function FeaturedCard({ note }) {
  const isImage = note.fileType?.startsWith('image/');

  return (
    <div className="w-full group cursor-pointer">
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row w-full">
        {/* Image side */}
        <div className="md:w-1/2 relative overflow-hidden bg-surface-container-high">
          {isImage ? (
            <img
              src={`${SERVER}/${note.filePath.replace(/\\/g, '/').replace(/^src\//, '')}`}
              alt={note.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full min-h-[240px] flex items-center justify-center bg-surface-container-high">
              <span
                className="material-symbols-outlined text-on-surface-variant/30"
                style={{ fontSize: '80px' }}
              >
                description
              </span>
            </div>
          )}
        </div>

        {/* Content side */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-manrope text-[10px] uppercase tracking-widest text-tertiary font-bold">
                {note.course?.code}
              </span>
              {note.pageCount && (
                <>
                  <span className="w-1 h-1 bg-outline-variant rounded-full inline-block" />
                  <span className="font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {note.pageCount} Pages
                  </span>
                </>
              )}
            </div>
            <h2 className="font-manrope text-xl font-bold text-on-surface mb-4 leading-tight">
              {note.title}
            </h2>
            <p className="font-body text-sm text-on-surface-variant mb-6 line-clamp-3">
              {note.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-manrope font-bold text-primary">
                {note.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-manrope text-sm font-bold">{note.user?.name}</p>
                <p className="font-manrope text-[10px] text-on-surface-variant uppercase tracking-wide">
                  {note.user?.university}
                </p>
              </div>
            </div>
            <StarDisplay rating={note.avgRating} />
          </div>
        </div>
      </div>
    </div>
  );
}

function RegularCard({ note }) {
  const dept = note.course?.department;
  const colorClass = deptColor[dept] || 'text-cyan-600';
  const isImage = note.fileType?.startsWith('image/');

  return (
    <div className="w-full group cursor-pointer bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-all h-full border-b-4 border-transparent hover:border-primary flex flex-col">
      {/* Image / placeholder */}
      <div className="aspect-video mb-6 rounded-lg overflow-hidden bg-surface-container-high flex items-center justify-center">
        {isImage ? (
          <img
            src={`${SERVER}/${note.filePath.replace(/\\/g, '/').replace(/^src\//, '')}`}
            alt={note.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className="material-symbols-outlined text-on-surface-variant/30"
            style={{ fontSize: '48px' }}
          >
            description
          </span>
        )}
      </div>

      {/* Department */}
      <p className={`font-manrope text-[10px] uppercase tracking-widest font-bold mb-1 ${colorClass}`}>
        {dept || 'General'}
      </p>

      {/* Title */}
      <h3 className="font-manrope text-xl font-bold text-on-surface mb-3 leading-snug">
        {note.title}
      </h3>

      {/* Meta row */}
      <div className="flex items-center gap-2 mb-4">
        {note.user?.university && (
          <>
            <span className="font-manrope text-[10px] text-on-surface-variant">
              {note.user.university}
            </span>
            <span className="w-1 h-1 bg-outline-variant rounded-full inline-block" />
          </>
        )}
        <span className="font-manrope text-[10px] text-on-surface-variant">
          {note.user?.name}
        </span>
      </div>

      {/* Bottom */}
      <div className="mt-auto flex items-center justify-between">
        <span className="font-body italic text-sm text-on-surface-variant">
          {formatDownloads(note.totalDownloads ?? 0)}
        </span>
        <StarDisplay rating={note.avgRating} />
      </div>
    </div>
  );
}

export default function NoteCard({ note, featured = false }) {
  return (
    <Link to={`/notes/${note.id}`} className="block h-full no-underline">
      {featured ? <FeaturedCard note={note} /> : <RegularCard note={note} />}
    </Link>
  );
}
