import { useState, useEffect, useRef } from 'react';
import { Menu, User, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const tools = [
    { name: 'Mortgage Calculator', href: '/mortgage-calculator' },
    { name: 'Suggested Products Chatbot', href: '/suggested-products' },
  ];

  return (
    <header className="w-full border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <button
              className="md:hidden mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <a href="/" className="flex items-center">
              <img
                src="./images/suunlifeicon_large_trans.png"
                alt="Sun Life logo"
                className="h-10"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              >
                Tools
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              {isToolsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  {tools.map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {tool.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Sign in button */}
            <a
              href="#"
              className="inline-flex items-center text-sm font-medium text-gray-700"
            >
              <User className="mr-1 h-4 w-4" />
              Sign in
            </a>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {/* Mobile Tools Menu */}
              {tools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700"
                >
                  {tool.name}
                </a>
              ))}
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-700"
              >
                Sign in
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;