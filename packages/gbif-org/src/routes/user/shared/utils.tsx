// Common class combinations
export const commonClasses = {
  input: {
    base: 'g-w-full g-px-4 g-py-2 g-border g-rounded-lg focus:g-ring-2 focus:g-ring-primary-500 focus:g-border-primary-500',
    withIcon: 'g-pl-10',
    error: 'g-border-red-500',
    normal: 'g-border-gray-300',
  },
  button: {
    primary:
      'g-w-full g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-transparent g-rounded-lg g-shadow-sm g-text-white g-bg-primary-600 hover:g-bg-primary-700 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-primary-500',
    secondary:
      'g-w-full g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-gray-300 g-rounded-lg g-shadow-sm g-bg-white g-text-gray-700 hover:g-bg-gray-50 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-primary-500',
    disabled: 'disabled:g-opacity-50 disabled:g-cursor-not-allowed',
  },
  messageBox: {
    success:
      'g-bg-green-50 g-border g-border-green-200 g-text-green-700 g-rounded-lg g-p-4 g-text-sm',
    error: 'g-bg-red-50 g-border g-border-red-200 g-text-red-600 g-rounded-lg g-p-4 g-text-sm',
  },
  icon: {
    inputIcon: 'g-absolute g-left-3 g-top-1/2 g--translate-y-1/2 g-text-gray-400 g-h-5 g-w-5',
    large: 'g-h-16 g-w-16',
    medium: 'g-h-12 g-w-12',
  },
};
