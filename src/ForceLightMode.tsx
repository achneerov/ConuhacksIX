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
          
          /* Preserve header button styles */
          [class*="bg-[#ffcb4d]"] {
            background-color: #ffcb4d !important;
          }
          [class*="bg-[#ffcb4d]"]:hover {
            background-color: #e6b745 !important;
          }
          
          /* Button specific overrides - exclude header buttons */
          button:not([class*="bg-[#ffcb4d]"]):not([class*="bg-[#144953]"]),
          [type='button']:not([class*="bg-[#ffcb4d]"]):not([class*="bg-[#144953]"]),
          [type='reset']:not([class*="bg-[#ffcb4d]"]):not([class*="bg-[#144953]"]),
          [type='submit']:not([class*="bg-[#ffcb4d]"]):not([class*="bg-[#144953]"]) {
            background-color: #e5e7eb !important;
            color: black !important;
            border-color: #d1d5db !important;
          }
          
          /* Hover states for non-header buttons */
          button:not([class*="bg-[#ffcb4d]"]):not([class*="bg-[#144953]"]):hover,
          [type='button']:not([class*="bg-[#ffcb4d]"]):not([class*="bg-[#144953]"]):hover,
          [type='reset']:not([class*="bg-[#ffcb4d]"]):not([class*="bg-[#144953]"]):hover,
          [type='submit']:not([class*="bg-[#ffcb4d]"]):not([class*="bg-[#144953]"]):hover {
            background-color: #d1d5db !important;
          }
          
          /* Active states for non-header buttons */
          button:not([class*="bg-[#ffcb4d]"]):not([class*="bg-[#144953]"]):active,
          [type='button']:not([class*="bg-[#ffcb4d]"]):not([class*="bg-[#144953]"]):active,
          [type='reset']:not([class*="bg-[#ffcb4d]"]):not([class*="bg-[#144953]"]):active,
          [type='submit']:not([class*="bg-[#ffcb4d]"]):not([class*="bg-[#144953]"]):active {
            background-color: #9ca3af !important;
          }
          
          /* Override dark mode specific button classes - exclude header buttons */
          button:not([class*="bg-[#ffcb4d]"]):not([class*="bg-[#144953]"])[class*="dark:"],
          [type='button']:not([class*="bg-[#ffcb4d]"]):not([class*="bg-[#144953]"])[class*="dark:"],
          [type='reset']:not([class*="bg-[#ffcb4d]"]):not([class*="bg-[#144953]"])[class*="dark:"],
          [type='submit']:not([class*="bg-[#ffcb4d]"]):not([class*="bg-[#144953]"])[class*="dark:"] {
            background-color: #e5e7eb !important;
            color: black !important;
            border-color: #d1d5db !important;
          }
          
          /* Preserve blue submit button styles */
          [class*="bg-[#144953]"] {
            background-color: #144953 !important;
            color: white !important;
          }
          [class*="bg-[#144953]"]:hover {
            background-color: #1a5d69 !important;
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