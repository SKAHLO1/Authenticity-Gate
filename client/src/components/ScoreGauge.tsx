import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  label: string;
  color?: string;
  inverse?: boolean; // If true, lower score is better (like risk)
}

export function ScoreGauge({ score, label, color = "var(--primary)", inverse = false }: ScoreGaugeProps) {
  // Normalize score to 0-100
  const normalizedScore = Math.min(100, Math.max(0, score));
  
  // Calculate circumference for SVG stroke
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const displayColor = inverse 
    ? (score > 70 ? "text-red-500" : score > 30 ? "text-yellow-500" : "text-green-500")
    : (score > 70 ? "text-green-500" : score > 30 ? "text-yellow-500" : "text-red-500");

  const ringColor = inverse
    ? (score > 70 ? "#ef4444" : score > 30 ? "#eab308" : "#22c55e")
    : (score > 70 ? "#22c55e" : score > 30 ? "#eab308" : "#ef4444");

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Background Ring */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-muted/30"
          />
          {/* Progress Ring */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="64"
            cy="64"
            r={radius}
            stroke={ringColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Value Text */}
        <div className="absolute flex flex-col items-center">
          <span className={`text-3xl font-bold font-display ${displayColor}`}>
            {score}%
          </span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
