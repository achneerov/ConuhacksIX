import { useState } from 'react';
import { ChevronDown, Menu, Search, User } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      label: 'Investments',
      href: '#',
      children: []
    },
    {
      label: 'Insurance',
      href: '#',
      children: []
    },
    {
      label: 'Health',
      href: '#',
      children: []
    }
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
                src="images/suunlifeicon_large_trans.png" 
                alt="Sun Life logo" 
                className="h-10"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                <a
                  href={item.href}
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  {item.label}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </a>
              </div>
            ))}
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Top nav items */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="#" className="text-sm text-gray-700">Support</a>
              <button className="text-sm text-gray-700 inline-flex items-center">
                Canada
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <button className="text-sm text-gray-700 inline-flex items-center">
                English
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>

            {/* Search, Sign in, Get started */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-700">
                <Search className="h-5 w-5" />
              </button>
              <a 
                href="#" 
                className="hidden md:inline-flex items-center text-sm font-medium text-gray-700"
              >
                <User className="mr-1 h-4 w-4" />
                Sign in
              </a>
              <a
                href="#"
                className="hidden md:inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Get started
              </a>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700"
                >
                  {item.label}
                </a>
              ))}
              <div className="border-t border-gray-200 pt-4">
                <a
                  href="#"
                  className="block px-3 py-2 text-base font-medium text-gray-700"
                >
                  Sign in
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 text-base font-medium text-blue-600"
                >
                  Get started
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;