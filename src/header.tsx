import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useUser } from './UserContext';

const Header = () => {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const { selectedUser, setSelectedUser, users } = useUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const tools = [
    { name: 'Mortgage Tools', href: '/suggested-products' },
    { name: 'Insurance Tools', href: '/InsuranceTools' },

  ];

  return (
    <header className="w-full border-b border-gray-200 px-4 py-2">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img
                src="./images/suunlifeicon_large_trans.png"
                alt="Sun Life logo"
                className="h-12 sm:h-10"
              />
            </a>
          </div>

          {/* Navigation - Always Visible */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full sm:w-auto">
            {/* Tools Dropdown */}
            <div className="relative w-full sm:w-auto" ref={dropdownRef}>
              <button
                className="bg-[#ffcb4d] hover:bg-[#e6b745] flex items-center justify-center text-base font-medium px-6 py-3 rounded w-full sm:w-auto"
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              >
                Tools
                <ChevronDown className="ml-2 h-5 w-5" />
              </button>
              {isToolsDropdownOpen && (
                <div className="absolute right-0 left-0 sm:left-auto mt-2 w-full sm:w-64 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  {tools.map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.href}
                      className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-100 hover:text-[#144953]"
                    >
                      {tool.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative w-full sm:w-auto" ref={userDropdownRef}>
              <button
                className="bg-[#ffcb4d] hover:bg-[#e6b745] flex items-center justify-center text-base font-medium px-6 py-3 rounded w-full sm:w-auto"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                {selectedUser ? selectedUser.name : 'Select User'}
                <ChevronDown className="ml-2 h-5 w-5" />
              </button>
              {isUserDropdownOpen && (
                <div className="absolute right-0 left-0 sm:left-auto mt-2 w-full sm:w-64 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  {users.map((user) => (
                    <a
                      key={user.name}
                      href="#"
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault();
                        setSelectedUser(user);
                        setIsUserDropdownOpen(false);
                      }}
                      className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-100 hover:text-[#144953]"
                    >
                      {user.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;