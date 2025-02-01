import { useState } from 'react';
import { Menu, User } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                src="images/suunlifeicon_large_trans.png" 
                alt="Sun Life logo" 
                className="h-10"
              />
            </a>
          </div>

          {/* Sign in button */}
          <div className="flex items-center">
            <a 
              href="#" 
              className="hidden md:inline-flex items-center text-sm font-medium text-gray-700"
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