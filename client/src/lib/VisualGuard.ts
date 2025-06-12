import { devAssert, checkSingletonIntegrity, checkLayoutIntegrity } from './DevAssert';
import { getAllRegisteredSingletons } from './SingletonRegistry';

export class VisualGuard {
  private static instance: VisualGuard;
  private checkInterval: number | null = null;
  private isEnabled = false;

  static getInstance(): VisualGuard {
    if (!VisualGuard.instance) {
      VisualGuard.instance = new VisualGuard();
    }
    return VisualGuard.instance;
  }

  enable() {
    if (!import.meta.env.DEV || this.isEnabled) return;
    
    this.isEnabled = true;
    console.log('🛡️ Visual Contract Firewall: Enabled');
    
    // Run checks every 2 seconds in development
    this.checkInterval = window.setInterval(() => {
      this.runAllChecks();
    }, 2000);
    
    // Run initial check
    setTimeout(() => this.runAllChecks(), 100);
  }

  disable() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isEnabled = false;
    console.log('🛡️ Visual Contract Firewall: Disabled');
  }

  private runAllChecks() {
    try {
      this.checkSingletonViolations();
      this.checkLayoutViolations();
      this.checkContrastViolations();
      this.checkResponsiveIntegrity();
    } catch (error) {
      console.error('🚨 Visual Contract Violation:', error);
    }
  }

  private checkSingletonViolations() {
    checkSingletonIntegrity();
    
    // Additional runtime checks
    const registeredSingletons = getAllRegisteredSingletons();
    registeredSingletons.forEach(id => {
      const elements = document.querySelectorAll(`[data-singleton="${id}"]`);
      devAssert(elements.length <= 1, `Multiple ${id} elements found in DOM (${elements.length})`);
    });
  }

  private checkLayoutViolations() {
    checkLayoutIntegrity();
    
    // Check for mobile viewport overflow
    if (window.innerWidth <= 768) {
      const horizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
      if (horizontalScroll) {
        console.warn('⚠️ Mobile Layout Warning: Horizontal scroll detected');
      }
    }
  }

  private checkContrastViolations() {
    // Simple contrast check for common text elements
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, a, label');
    
    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Basic check for transparent or same color as background
      if (color === backgroundColor || backgroundColor === 'rgba(0, 0, 0, 0)') {
        const hasContrast = this.hasGoodContrast(color, this.getEffectiveBackgroundColor(element));
        if (!hasContrast) {
          console.warn('⚠️ Contrast Warning: Poor text contrast detected', element);
        }
      }
    });
  }

  private checkResponsiveIntegrity() {
    // Check for elements that might be too wide for mobile
    if (window.innerWidth <= 375) {
      const wideElements = document.querySelectorAll('*');
      wideElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.width > window.innerWidth + 10) { // 10px tolerance
          console.warn('⚠️ Mobile Overflow Warning: Element wider than viewport', element);
        }
      });
    }
  }

  private hasGoodContrast(color1: string, color2: string): boolean {
    // Simplified contrast check - in production would use proper WCAG calculation
    const rgb1 = this.parseColor(color1);
    const rgb2 = this.parseColor(color2);
    
    if (!rgb1 || !rgb2) return true; // Assume good if can't parse
    
    const luminance1 = this.getLuminance(rgb1);
    const luminance2 = this.getLuminance(rgb2);
    
    const contrast = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);
    return contrast >= 4.5; // WCAG AA minimum
  }

  private parseColor(color: string): [number, number, number] | null {
    // Simple RGB extraction - would use proper color parsing in production
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
    return null;
  }

  private getLuminance([r, g, b]: [number, number, number]): number {
    // WCAG luminance calculation
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  private getEffectiveBackgroundColor(element: Element): string {
    let currentElement: Element | null = element;
    while (currentElement) {
      const styles = window.getComputedStyle(currentElement);
      const bgColor = styles.backgroundColor;
      if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        return bgColor;
      }
      currentElement = currentElement.parentElement as Element;
    }
    return 'rgb(255, 255, 255)'; // Default to white
  }
}

// Auto-enable in development - disabled to reduce console noise
// if (import.meta.env.DEV) {
//   const guard = VisualGuard.getInstance();
//   // Delay enabling to allow components to mount
//   setTimeout(() => guard.enable(), 1000);
// }