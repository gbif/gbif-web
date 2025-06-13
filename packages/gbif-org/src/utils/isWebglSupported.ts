let isWebglSupportedCache: boolean | null = null;

export function isWebglSupported() {
  if (isWebglSupportedCache !== null) {
    return isWebglSupportedCache;
  }
  isWebglSupportedCache = checkWebglSupport();
  return isWebglSupportedCache;
}

// check webgl support and dispose canvas afterwards
function checkWebglSupport() {
  // Check if the browser supports WebGL
  if (window.WebGLRenderingContext) {
    const canvas = document.createElement('canvas');
    try {
      // Note that { failIfMajorPerformanceCaveat: true } can be passed as a second argument
      // to canvas.getContext(), causing the check to fail if hardware rendering is not available. See
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
      // for more details.
      const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (context && typeof context.getParameter == 'function') {
        // WebGL is supported
        canvas.remove(); // Clean up the canvas element
        return true;
      }
    } catch (e) {
      // WebGL is supported, but disabled
    }
    canvas.remove(); // Clean up the canvas element
    return false;
  }
  // WebGL not supported
  return false;
}
