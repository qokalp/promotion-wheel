import { WheelSlice } from '../types';
import { calculateSliceAngles } from '../utils/wheel';

interface WheelProps {
  slices: WheelSlice[];
  currentAngle: number;
  isSpinning: boolean;
  size?: number;
}

const COLORS = [
  '#28AFFA', // Brand cyan
  '#00D796', // Brand green
  '#FF5012', // Brand orange
  '#28AFFA', // Brand cyan
  '#00D796', // Brand green
  '#FF5012', // Brand orange
  '#28AFFA', // Brand cyan
  '#00D796', // Brand green
  '#FF5012', // Brand orange
  '#28AFFA', // Brand cyan
  '#00D796', // Brand green
  '#FF5012', // Brand orange
  '#28AFFA', // Brand cyan
  '#00D796', // Brand green
  '#FF5012', // Brand orange
  '#28AFFA', // Brand cyan
];

export function Wheel({ slices, currentAngle, isSpinning, size = 500 }: WheelProps) {
  const sliceAngles = calculateSliceAngles(slices);
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;



  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Wheel container with reflection effect */}
      <div 
        className="relative rounded-full overflow-hidden"
        style={{
          width: size,
          height: size,
          boxShadow: `
            0 0 0 8px rgba(40, 175, 250, 0.3),
            0 0 0 12px rgba(0, 215, 150, 0.2),
            0 0 0 16px rgba(255, 80, 18, 0.1),
            inset 0 0 50px rgba(255, 255, 255, 0.1),
            0 20px 40px rgba(0, 0, 0, 0.3)
          `,
        }}
      >
        {/* Reflection overlay */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.1) 100%)',
          }}
        />
        
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform transition-transform duration-1000 ease-out"
          style={{ transform: `rotate(${currentAngle}deg)` }}
        >
          {/* Wheel slices with text */}
          {sliceAngles.map((slice, index) => {
            const startAngleRad = (slice.start * Math.PI) / 180;
            const endAngleRad = (slice.end * Math.PI) / 180;
            
            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);
            
            const largeArcFlag = slice.end - slice.start <= 180 ? '0' : '1';
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            // Calculate text position
            const midAngle = (slice.start + slice.end) / 2;
            const textAngleRad = (midAngle * Math.PI) / 180;
            const textRadius = radius * 0.7;
            
            const textX = centerX + textRadius * Math.cos(textAngleRad);
            const textY = centerY + textRadius * Math.sin(textAngleRad);
            
            // Calculate text rotation
            const textRotation = midAngle > 90 && midAngle < 270 ? midAngle + 180 : midAngle;
            
            return (
              <g key={index}>
                {/* Slice path */}
                <path
                  d={pathData}
                  fill={COLORS[index % COLORS.length]}
                  stroke="white"
                  strokeWidth="2"
                />
                
                {/* Slice text */}
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                  className="fill-white font-bold pointer-events-none select-none"
                  style={{
                    fontSize: `${Math.min(size / 20, 14)}px`,
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                  }}
                >
                  {slices[index]?.label || `Slice ${index + 1}`}
                </text>
              </g>
            );
          })}
          
          
          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r="25"
            fill="rgba(255, 255, 255, 0.95)"
            stroke="#28AFFA"
            strokeWidth="6"
            className="drop-shadow-lg"
          />
          {/* Center dot */}
          <circle
            cx={centerX}
            cy={centerY}
            r="12"
            fill="#FF5012"
            className="animate-pulse"
          />
        </svg>
      </div>
      
      {/* Glow effect when spinning */}
      {isSpinning && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(40, 175, 250, 0.4) 0%, transparent 70%)',
            animation: 'pulse-glow 0.5s ease-in-out infinite alternate',
          }}
        />
      )}

      {/* Pointer - Clean and professional */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12"
        style={{ 
          zIndex: 100,
          width: 40,
          height: 40
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          className="drop-shadow-2xl"
        >
          {/* Large pointer triangle - pointing down */}
          <polygon
            points="20,40 0,0 40,0"
            fill="#FF5012"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          {/* Inner highlight */}
          <polygon
            points="20,36 6,4 34,4"
            fill="#FF6B35"
          />
          {/* Center dot */}
          <circle
            cx="20"
            cy="10"
            r="3"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </div>
  );
}