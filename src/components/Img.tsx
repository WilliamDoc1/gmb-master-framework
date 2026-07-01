interface ImgProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  fallbackLabel?: string;
}

export function Img({ src, alt, className = '', eager = false, fallbackLabel }: ImgProps) {
  if (!src) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-[var(--color-accent)]/20 flex flex-col items-center justify-center gap-2 ${className}`}>
        <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-[var(--color-accent)]/30"></div>
        </div>
        <span className="text-[9px] tracking-widest uppercase text-gray-400 font-black text-center px-4">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={(e) => {
        const t = e.currentTarget;
        t.style.display = 'none';
        const ph = document.createElement('div');
        ph.className = t.className + ' bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center';
        ph.innerHTML = `<span style="font-size:9px;text-transform:uppercase;letter-spacing:0.2em;color:#999;font-weight:700;text-align:center;padding:8px">${fallbackLabel || alt}</span>`;
        t.parentNode?.insertBefore(ph, t);
      }}
    />
  );
}
