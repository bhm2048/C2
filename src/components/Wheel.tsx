import React, { useRef, useState, useMemo } from 'react';
import { motion, useAnimation, useMotionValue } from 'motion/react';
import confetti from 'canvas-confetti';
import { Student } from '../types';
import { cn } from '../lib/utils';

interface WheelProps {
  students: Student[];
  onWinner: (student: Student) => void;
  allowRepeat: boolean;
}

export const Wheel: React.FC<WheelProps> = ({ students, onWinner, allowRepeat }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Student | null>(null);
  const controls = useAnimation();
  const rotation = useMotionValue(0);
  const audioCtx = useRef<AudioContext | null>(null);

  const playTick = () => {
    try {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtx.current.state === 'suspended') {
        audioCtx.current.resume();
      }
      const osc = audioCtx.current.createOscillator();
      const gain = audioCtx.current.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, audioCtx.current.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.current.destination);
      osc.start();
      osc.stop(audioCtx.current.currentTime + 0.05);
    } catch (e) {
      console.error('Audio error:', e);
    }
  };

  const playWinSound = () => {
    try {
      if (!audioCtx.current) return;
      const osc = audioCtx.current.createOscillator();
      const gain = audioCtx.current.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.current.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.current.currentTime + 0.5);
      gain.gain.setValueAtTime(0.2, audioCtx.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.current.destination);
      osc.start();
      osc.stop(audioCtx.current.currentTime + 0.5);
    } catch (e) {
      console.error('Audio error:', e);
    }
  };

  const spin = async () => {
    if (isSpinning || students.length === 0) return;
    setIsSpinning(true);
    setWinner(null);

    const spinDuration = 4;
    const extraSpins = 5 + Math.random() * 5;
    const targetRotation = rotation.get() + extraSpins * 360 + Math.random() * 360;

    let lastTickAngle = rotation.get();
    const tickInterval = 360 / students.length;

    const unsubscribe = rotation.on("change", (latest) => {
      if (Math.abs(latest - lastTickAngle) >= tickInterval) {
        playTick();
        lastTickAngle = latest;
      }
    });

    await controls.start({
      rotate: targetRotation,
      transition: { duration: spinDuration, ease: [0.1, 0, 0.2, 1] }
    });

    unsubscribe();
    setIsSpinning(false);

    const finalRotation = targetRotation % 360;
    const sliceAngle = 360 / students.length;
    // Pointer is at the top (0 degrees). Wheel rotates clockwise.
    // The slice at the top is the one that was at (360 - finalRotation) degrees initially.
    const winnerIndex = Math.floor(((360 - finalRotation) % 360) / sliceAngle);
    const selectedWinner = students[winnerIndex];
    
    setWinner(selectedWinner);
    playWinSound();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    onWinner(selectedWinner);
  };

  const slices = useMemo(() => {
    if (students.length === 0) return [];
    const angle = 360 / students.length;
    return students.map((student, i) => {
      const startAngle = i * angle;
      const endAngle = (i + 1) * angle;
      
      // Calculate path for the slice
      const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
      const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
      const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
      const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      const d = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      return {
        id: student.id,
        name: student.name,
        d,
        color: `hsl(${i * (360 / students.length)}, 70%, 75%)`,
        textRotation: startAngle + angle / 2
      };
    });
  }, [students]);

  if (students.length === 0) {
    return <div className="text-center p-10 text-slate-400">請先匯入名單</div>;
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* Pointer */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-rose-500 drop-shadow-md" />
        
        {/* Wheel SVG */}
        <motion.div
          animate={controls}
          style={{ rotate: rotation }}
          className="w-full h-full rounded-full border-8 border-slate-800 shadow-2xl relative bg-white"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            {slices.map((slice) => (
              <g key={slice.id}>
                <path
                  d={slice.d}
                  fill={slice.color}
                  stroke="white"
                  strokeWidth="0.2"
                />
                <g transform={`rotate(${slice.textRotation} 50 50)`}>
                  <text
                    x="75"
                    y="50"
                    fill="#334155"
                    fontSize={students.length > 20 ? "2.5" : "3.5"}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform="rotate(90 75 50)"
                  >
                    {slice.name}
                  </text>
                </g>
              </g>
            ))}
            <circle cx="50" cy="50" r="2" fill="#1e293b" />
          </svg>
        </motion.div>
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        className={cn(
          "px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all transform active:scale-95",
          isSpinning 
            ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
            : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200"
        )}
      >
        {isSpinning ? "轉動中..." : "開始抽籤"}
      </button>

      {winner && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-4 p-6 bg-yellow-100 border-2 border-yellow-400 rounded-2xl text-center shadow-xl"
        >
          <h3 className="text-yellow-800 font-bold text-xl mb-1">恭喜中獎！</h3>
          <p className="text-3xl font-black text-slate-900">{winner.name}</p>
        </motion.div>
      )}
    </div>
  );
};
