import { useState, useEffect } from 'react';

interface DockPosition {
  y: number;
}

export function useDock(storageKey: string = 'magicStarY') {
  const [position, setPosition] = useState<DockPosition>({ y: 0 });

  useEffect(() => {
    // Load saved position from localStorage
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsedPosition = JSON.parse(saved);
        setPosition(parsedPosition);
      } catch (error) {
        console.warn('Failed to parse dock position from localStorage');
      }
    }
  }, [storageKey]);

  const updatePosition = (newPosition: DockPosition) => {
    setPosition(newPosition);
    localStorage.setItem(storageKey, JSON.stringify(newPosition));
  };

  const constrainY = (y: number): number => {
    const maxY = window.innerHeight / 2 - 60; // 60px padding from top/bottom
    const minY = -(window.innerHeight / 2 - 120);
    return Math.max(minY, Math.min(maxY, y));
  };

  return {
    position,
    updatePosition,
    constrainY,
  };
}