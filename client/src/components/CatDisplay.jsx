// CatDisplay.jsx
export default function CatDisplay({ image, alt = 'Fore-cat mascot', animated = true, size = 'lg' }) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40 sm:w-48 sm:h-48',
  }[size];

  return (
    <div className={`relative shrink-0 ${sizeClasses}`}>
      <div
        className={`absolute inset-0 rounded-full bg-white/50 blur-md ${
          animated ? 'animate-pulse' : ''
        }`}
        aria-hidden="true"
      />
      <img
        src={image}
        alt={alt}
        className={`relative w-full h-full object-contain drop-shadow-[3px_5px_0px_rgba(120,53,15,0.35)] ${
          animated ? 'cat-bob' : ''
        }`}
        draggable={false}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/cats/cat-error.png';
        }}
      />

      <style>{`
        @keyframes catBob {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        .cat-bob {
          animation: catBob 3.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .cat-bob { animation: none; }
        }
      `}</style>
    </div>
  );
}