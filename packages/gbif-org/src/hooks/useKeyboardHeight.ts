import { useEffect, useState } from 'react';

/**
 * Hook to detect virtual keyboard height on mobile devices using the Visual Viewport API
 * Returns the keyboard height in pixels, or 0 if keyboard is not active
 */
export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check if we're on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (!isMobile) return;

    // Check if Visual Viewport API is supported
    if (!window.visualViewport) {
      console.warn('Visual Viewport API not supported');
      return;
    }

    const updateKeyboardHeight = () => {
      const visualViewport = window.visualViewport;
      if (!visualViewport) return;

      // Calculate keyboard height as the difference between window height and visual viewport height
      const keyboardHeight = window.innerHeight - visualViewport.height;

      // Only set keyboard height if it's significant (>50px to avoid false positives)
      if (keyboardHeight > 50) {
        setKeyboardHeight(keyboardHeight);
      } else {
        setKeyboardHeight(0);
      }
    };

    // Initial calculation
    updateKeyboardHeight();

    // Listen for visual viewport changes
    window.visualViewport.addEventListener('resize', updateKeyboardHeight);
    window.visualViewport.addEventListener('scroll', updateKeyboardHeight);

    // Also listen for orientation changes to reset
    const handleOrientationChange = () => {
      setTimeout(() => {
        updateKeyboardHeight();
      }, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    // Cleanup
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateKeyboardHeight);
        window.visualViewport.removeEventListener('scroll', updateKeyboardHeight);
      }
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return keyboardHeight;
}
