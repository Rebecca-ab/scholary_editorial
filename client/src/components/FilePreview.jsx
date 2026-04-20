import { useEffect, useState } from 'react';

export default function FilePreview({ file }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!file || !url) return null;

  const isPdf   = file.type === 'application/pdf';
  const isImage = file.type.startsWith('image/');

  if (isPdf) {
    return (
      <iframe
        src={url}
        title="File preview"
        className="w-full h-full"
      />
    );
  }

  if (isImage) {
    return (
      <img
        src={url}
        alt="File preview"
        className="w-full h-full object-contain"
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-on-surface-variant">
      <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>description</span>
      <p className="font-manrope text-sm font-semibold">{file.name}</p>
      <p className="font-body text-xs">Preview not available for this file type</p>
    </div>
  );
}
