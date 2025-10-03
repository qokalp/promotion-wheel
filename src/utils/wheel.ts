import { WheelSlice } from '../types';

export function calculateSliceAngles(slices: WheelSlice[]): { start: number; end: number; center: number }[] {
  const totalWeight = slices.reduce((sum, slice) => sum + slice.weight, 0);
  const sliceAngles: { start: number; end: number; center: number }[] = [];
  
  let currentAngle = 0;
  
  for (const slice of slices) {
    const sliceAngle = (slice.weight / totalWeight) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    const centerAngle = startAngle + sliceAngle / 2;
    
    sliceAngles.push({
      start: startAngle,
      end: endAngle,
      center: centerAngle,
    });
    
    currentAngle = endAngle;
  }
  
  return sliceAngles;
}

export function selectWinningSlice(slices: WheelSlice[]): { index: number; slice: WheelSlice; targetAngle: number } {
  const totalWeight = slices.reduce((sum, slice) => sum + slice.weight, 0);
  const random = Math.random() * totalWeight;
  
  let currentWeight = 0;
  let selectedIndex = 0;
  
  for (let i = 0; i < slices.length; i++) {
    currentWeight += slices[i].weight;
    if (random <= currentWeight) {
      selectedIndex = i;
      break;
    }
  }
  
  const sliceAngles = calculateSliceAngles(slices);
  
  // Calculate target angle so that the pointer points to the selected slice
  // Pointer is at 0 degrees (top), so we need to rotate the wheel so that
  // the selected slice's center is at the pointer position
  const selectedSliceCenter = sliceAngles[selectedIndex].center;
  
  // The wheel needs to rotate so that the selected slice center aligns with the pointer
  // Since pointer is at 0 degrees, we need to rotate the wheel by (360 - selectedSliceCenter)
  const targetAngle = 360 - selectedSliceCenter;
  
  // Add small random jitter to make it more natural (±5 degrees)
  const jitter = (Math.random() - 0.5) * 10;
  
  console.log('🎯 Select Winning Slice:', {
    selectedIndex,
    selectedSlice: slices[selectedIndex].label,
    selectedSliceCenter,
    targetAngle: targetAngle + jitter,
    jitter
  });
  
  return {
    index: selectedIndex,
    slice: slices[selectedIndex],
    targetAngle: targetAngle + jitter,
  };
}

export function calculateSpinAngle(currentAngle: number, targetAngle: number): number {
  // Calculate the shortest path to the target
  const normalizedCurrent = currentAngle % 360;
  const normalizedTarget = targetAngle % 360;
  
  let angleDiff = normalizedTarget - normalizedCurrent;
  
  // Ensure we take the shorter path
  if (angleDiff > 180) {
    angleDiff -= 360;
  } else if (angleDiff < -180) {
    angleDiff += 360;
  }
  
  // Add multiple full rotations (3-8 turns)
  const fullRotations = 3 + Math.random() * 5; // 3-8 turns
  const totalAngle = currentAngle + (fullRotations * 360) + angleDiff;
  
  return totalAngle;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Calculate which slice the pointer is pointing to based on the current wheel angle
 * Pointer is at the top (0 degrees), so we need to find which slice contains that angle
 */
export function getPointerSlice(slices: WheelSlice[], currentAngle: number): { index: number; slice: WheelSlice } | null {
  if (slices.length === 0) return null;
  
  const sliceAngles = calculateSliceAngles(slices);
  
  // Normalize current angle to 0-360 range
  const normalizedAngle = ((currentAngle % 360) + 360) % 360;
  
  console.log('🔍 Pointer Debug:', {
    currentAngle,
    normalizedAngle,
    sliceAngles: sliceAngles.map((s, i) => ({
      index: i,
      label: slices[i].label,
      start: s.start,
      end: s.end,
      center: s.center
    }))
  });
  
  // Simplified approach: Find which slice the pointer (0 degrees) is pointing to
  // The pointer is always at the top (0 degrees), so we need to find which slice
  // contains the angle that is opposite to the current wheel rotation
  
  // Calculate the angle that the pointer is pointing to relative to the wheel
  const pointerAngle = (360 - normalizedAngle) % 360;
  
  console.log('🎯 Pointer angle relative to wheel:', pointerAngle);
  
  // Find which slice contains this angle
  for (let i = 0; i < sliceAngles.length; i++) {
    const slice = sliceAngles[i];
    const startAngle = slice.start;
    const endAngle = slice.end;
    
    console.log(`🎯 Slice ${i} (${slices[i].label}):`, {
      start: startAngle,
      end: endAngle,
      pointerAngle,
      containsPointer: (startAngle <= pointerAngle && pointerAngle < endAngle) || 
                      (endAngle < startAngle && (pointerAngle >= startAngle || pointerAngle < endAngle))
    });
    
    // Check if pointer angle falls within this slice
    if (startAngle <= endAngle) {
      // Normal case: slice doesn't cross 0 degrees
      if (startAngle <= pointerAngle && pointerAngle < endAngle) {
        console.log(`✅ Found pointer slice: ${i} - ${slices[i].label}`);
        return { index: i, slice: slices[i] };
      }
    } else {
      // Special case: slice crosses 0 degrees (e.g., from 350° to 10°)
      if (pointerAngle >= startAngle || pointerAngle < endAngle) {
        console.log(`✅ Found pointer slice (crossing): ${i} - ${slices[i].label}`);
        return { index: i, slice: slices[i] };
      }
    }
  }
  
  // Fallback: return the first slice if no match found
  console.log('⚠️ No slice found, using fallback: 0 -', slices[0].label);
  return { index: 0, slice: slices[0] };
}

