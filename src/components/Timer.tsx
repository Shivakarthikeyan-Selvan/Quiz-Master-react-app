import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimerCircleProps {
  isActive: boolean;
  onTimeUp: () => void;
}

const TimerCircle = ({ isActive, onTimeUp }: TimerCircleProps) => {
  const DURATION = 10;
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // When question changes (component remounts due to key), reset timer
  useEffect(() => {
    setTimeLeft(DURATION);
  }, []);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // start new interval
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const getColor = () => (timeLeft <= 5 ? "red" : "green");

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (timeLeft / DURATION) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg width="150" height="150" className="transform -rotate-90">
          <circle
            cx="75"
            cy="75"
            r={radius}
            stroke="#ddd"
            strokeWidth="10"
            fill="none"
          />
          <motion.circle
            cx="75"
            cy="75"
            r={radius}
            stroke={getColor()}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        <AnimatePresence mode="wait">
          <motion.div
            key={timeLeft}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, color: getColor() }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${
              timeLeft <= 5 ? "animate-pulse" : ""
            }`}
          >
            {timeLeft}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="text-gray-400 text-sm mt-3">Seconds remaining</p>
    </div>
  );
};

export default TimerCircle;
