export function devAssert(condition: boolean, message: string) {
  if (!condition && import.meta.env.DEV) {
    console.error(`⚠️ UI Contract Violation: ${message}`);
    throw new Error(`⚠️ UI Contract Violation: ${message}`);
  }
}

export function devWarn(condition: boolean, message: string) {
  if (!condition && import.meta.env.DEV) {
    console.warn(`⚠️ UI Warning: ${message}`);
  }
}

export function checkSingletonIntegrity() {
  if (!import.meta.env.DEV) return;
  
  const singletonSelectors = [
    { selector: '[data-singleton="magic-star"]', name: 'Magic Star FAB' },
    { selector: '[data-singleton="theme-toggle"]', name: 'Theme Toggle' },
    { selector: '[data-singleton="assistant-overlay"]', name: 'Assistant Overlay' }
  ];

  singletonSelectors.forEach(({ selector, name }) => {
    const elements = document.querySelectorAll(selector);
    devAssert(elements.length <= 1, `More than one ${name} found (${elements.length} instances)`);
  });
}

export function checkLayoutIntegrity() {
  if (!import.meta.env.DEV) return;
  
  const fab = document.querySelector('[data-singleton="magic-star"]');
  const overlay = document.querySelector('[data-singleton="assistant-overlay"]');
  
  if (fab && overlay) {
    const fabRect = fab.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    
    const isOverlapping = !(
      fabRect.right < overlayRect.left ||
      fabRect.left > overlayRect.right ||
      fabRect.bottom < overlayRect.top ||
      fabRect.top > overlayRect.bottom
    );
    
    devWarn(!isOverlapping, 'FAB and Assistant Overlay are overlapping');
  }
}