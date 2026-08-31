// BackgroundEffects.jsx
import { useMemo } from 'react';

/**
 * Ambient particle overlay behind the app. Picks a particle type from the
 * current weather condition: rain, snow, stars (clear night), or none.
 */
export default function BackgroundEffects({ wmoCode = 0, isDay = 1 }) {
  const kind = useMemo(() => {
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(wmoCode)) return 'rain';
    if ([71, 73, 75, 85, 86].includes(wmoCode)) return 'snow';
    if ([95, 96, 99].includes(wmoCode)) return 'storm';
    if (wmoCode === 0 && !isDay) return 'stars';
    return 'none';
  }, [wmoCode, isDay]);

  const particles = useMemo(() => {
    const count = kind === 'stars' ? 40 : kind === 'none' ? 0 : 28;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 3 + Math.random() * 4,
      size: 2 + Math.random() * 3,
    }));
  }, [kind]);

  if (kind === 'none' || particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className={
            kind === 'rain'
              ? 'absolute w-[2px] h-4 bg-sky-400/40 rounded-full bg-fall'
              : kind === 'snow'
              ? 'absolute rounded-full bg-white/70 bg-fall-slow'
              : kind === 'storm'
              ? 'absolute w-[2px] h-5 bg-violet-400/40 rounded-full bg-fall-fast'
              : 'absolute rounded-full bg-white bg-twinkle'
          }
          style={{
            left: `${p.left}%`,
            top: kind === 'stars' ? `${Math.random() * 60}%` : '-5%',
            width: kind === 'snow' || kind === 'stars' ? `${p.size}px` : undefined,
            height: kind === 'snow' || kind === 'stars' ? `${p.size}px` : undefined,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes fall {
          to { transform: translateY(110vh); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        .bg-fall { animation-name: fall; animation-timing-function: linear; animation-iteration-count: infinite; }
        .bg-fall-slow { animation-name: fall; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        .bg-fall-fast { animation-name: fall; animation-timing-function: linear; animation-iteration-count: infinite; }
        .bg-twinkle { animation-name: twinkle; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        @media (prefers-reduced-motion: reduce) {
          .bg-fall, .bg-fall-slow, .bg-fall-fast, .bg-twinkle { animation: none; }
        }
      `}</style>
    </div>
  );
}