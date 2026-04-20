export default function Footer() {
  const columns = [
    {
      heading: 'Explore',
      links: ['All Notes', 'University Partnerships', 'Elite Contributors'],
    },
    {
      heading: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Copyright Policy'],
    },
    {
      heading: 'Contact',
      links: ['Contact Librarian', 'Help Center'],
      icons: ['mail', 'language'],
    },
  ];

  return (
    <footer className="w-full py-10 px-6 border-t border-slate-200 bg-slate-50 overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-full">
        {/* Col 1: Brand */}
        <div>
          <p className="font-body italic text-slate-800 text-lg mb-3">
            The Scholarly Editorial
          </p>
          <p className="font-manrope text-sm text-slate-500 leading-relaxed">
            A curated platform for sharing and discovering high-quality academic
            study notes across disciplines.
          </p>
        </div>

        {/* Cols 2–4 */}
        {columns.map((col) => (
          <div key={col.heading}>
            <h4 className="font-manrope text-xs font-bold uppercase tracking-widest text-slate-800 mb-6">
              {col.heading}
            </h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-manrope text-sm text-slate-500 hover:text-cyan-600 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
            {col.icons && (
              <div className="flex gap-3 mt-4">
                {col.icons.map((icon) => (
                  <span
                    key={icon}
                    className="material-symbols-outlined text-slate-400 hover:text-cyan-600 cursor-pointer transition-colors"
                  >
                    {icon}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 mt-8 pt-6 text-center">
        <p className="font-body text-xs uppercase tracking-widest text-slate-400">
          &copy; {new Date().getFullYear()} The Scholarly Editorial. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
