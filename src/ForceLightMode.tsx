// ForceLightMode.tsx
import { useEffect, type ReactNode } from 'react';

interface ForceLightModeProps {
  children: ReactNode;
}

const ForceLightMode: React.FC<ForceLightModeProps> = ({ children }) => {
  useEffect(() => {
    // Function to force light mode
    const forceLightMode = () => {
      // Override dark mode styles with CSS
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        /* Override dark mode media query */
        @media (prefers-color-scheme: dark) {
          :root {
            color-scheme: light !important;
          }
          /* Override all dark: utility classes */
          .dark\\: {
            color-scheme: light !important;
          }
          [class*="dark:"] {
            color-scheme: light !important;
          }
          /* Force light mode colors */
          :root {
            background-color: white !important;
            color: black !important;
          }
          * {
            background-color: inherit;
            color: inherit;
          }
          /* Button specific overrides */
          button, 
          [type='button'],
          [type='reset'],
          [type='submit'] {
            background-color: #e5e7eb !important; /* gray-200 equivalent */
            color: black !important;
            border-color: #d1d5db !important; /* gray-300 equivalent */
          }
          
          button:hover,
          [type='button']:hover,
          [type='reset']:hover,
          [type='submit']:hover {
            background-color: #d1d5db !important; /* gray-300 equivalent */
          }
          
          button:active,
          [type='button']:active,
          [type='reset']:active,
          [type='submit']:active {
            background-color: #9ca3af !important; /* gray-400 equivalent */
          }

          /* Override any dark mode specific button classes */
          button[class*="dark:"],
          [type='button'][class*="dark:"],
          [type='reset'][class*="dark:"],
          [type='submit'][class*="dark:"] {
            background-color: #e5e7eb !important;
            color: black !important;
            border-color: #d1d5db !important;
          }
        }
      `;
      document.head.appendChild(styleElement);

      // Add meta tags
      const metaColor = document.createElement('meta');
      metaColor.name = 'color-scheme';
      metaColor.content = 'light';
      document.head.appendChild(metaColor);

      return { styleElement, metaColor };
    };

    // Apply force light mode
    const { styleElement, metaColor } = forceLightMode();

    // Cleanup function
    return () => {
      document.head.removeChild(styleElement);
      document.head.removeChild(metaColor);
    };
  }, []);

  return children;
};

export default ForceLightMode;