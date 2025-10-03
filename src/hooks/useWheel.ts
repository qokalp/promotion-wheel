import { useState, useCallback, useRef } from 'react';
import { WheelSlice } from '../types';
import { selectWinningSlice, calculateSpinAngle, easeOutCubic } from '../utils/wheel';

interface UseWheelOptions {
  slices: WheelSlice[];
  onSpinComplete?: (result: { index: number; slice: WheelSlice }) => void;
}

export function useWheel({ slices, onSpinComplete }: UseWheelOptions) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [winningResult, setWinningResult] = useState<{ index: number; slice: WheelSlice } | null>(null);
  
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startAngleRef = useRef<number>();
  const targetAngleRef = useRef<number>();
  const durationRef = useRef<number>(3000); // 3 seconds

  const spin = useCallback(() => {
    if (isSpinning || slices.length === 0) return;

    // Select winning slice
    const { index, slice, targetAngle } = selectWinningSlice(slices);
    setWinningResult({ index, slice });

    // Calculate spin parameters
    const finalAngle = calculateSpinAngle(currentAngle, targetAngle);
    targetAngleRef.current = finalAngle;
    startAngleRef.current = currentAngle;
    startTimeRef.current = performance.now();

    setIsSpinning(true);

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) return;

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / durationRef.current, 1);
      
      // Use easing function for smooth deceleration
      const easedProgress = easeOutCubic(progress);
      
      const newAngle = startAngleRef.current! + (targetAngleRef.current! - startAngleRef.current!) * easedProgress;
      setCurrentAngle(newAngle);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        setIsSpinning(false);
        setCurrentAngle(targetAngleRef.current!);
        
        // Add delay before showing result
        setTimeout(() => {
          console.log('🎲 Spin Complete Debug:', {
            selectedResult: { index, slice: slice.label },
            finalAngle: targetAngleRef.current
          });
          
          // Use the originally selected result since selectWinningSlice now calculates
          // the correct target angle to align the pointer with the selected slice
          onSpinComplete?.({ index, slice });
        }, 1500); // 1.5 second delay
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [isSpinning, slices, currentAngle, onSpinComplete]);

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsSpinning(false);
    setWinningResult(null);
    setCurrentAngle(0);
  }, []);

  return {
    isSpinning,
    currentAngle,
    winningResult,
    spin,
    reset,
  };
}

