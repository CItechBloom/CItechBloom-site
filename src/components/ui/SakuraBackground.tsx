"use client";

import { useEffect, useState } from "react";

type Petal = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  swayDuration: number;
  spinDuration: number;
  opacity: number;
  color: string;
};

const COLORS = ["#ffb7c5", "#ff9ab2", "#ffc8d5", "#fff0f5"];
const PETAL_COUNT = 25;

function createPetal(id: number): Petal {
  return {
    id,
    left: Math.random() * 100,
    size: 10 + Math.random() * 12,
    duration: 8 + Math.random() * 10,
    delay: Math.random() * -18,
    drift: -30 + Math.random() * 60,
    swayDuration: 3 + Math.random() * 2,
    spinDuration: 4 + Math.random() * 4,
    opacity: 0.5 + Math.random() * 0.35,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

function PetalSvg({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 30 40">
      <path
        d="M15 0 C22 8 28 18 24 28 C21 34 18 38 15 34 C12 38 9 34 6 28 C2 18 8 8 15 0Z"
        fill={color}
      />
    </svg>
  );
}

export function SakuraBackground() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    setPetals(Array.from({ length: PETAL_COUNT }, (_, i) => createPetal(i)));
  }, []);

  if (petals.length === 0) return null;

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.left}%`,
            opacity: petal.opacity,
            // CSS変数で花びらごとのdriftを渡す
            "--petal-drift": `${petal.drift}px`,
            animation: `fall ${petal.duration}s linear ${petal.delay}s infinite`,
          } as React.CSSProperties}
        >
          <div
            style={{
              animation: `sway ${petal.swayDuration}s ease-in-out ${petal.delay}s infinite alternate, spin ${petal.spinDuration}s linear ${petal.delay}s infinite`,
            }}
          >
            <PetalSvg color={petal.color} size={petal.size} />
          </div>
        </div>
      ))}

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-5vh) translateX(0px);
          }
          100% {
            transform: translateY(105vh) translateX(var(--petal-drift, 0px));
          }
        }
        @keyframes sway {
          0% { transform: translateX(-15px); }
          100% { transform: translateX(15px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
