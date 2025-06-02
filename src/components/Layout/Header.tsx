import React from 'react';
import { BusIcon, UserIcon, MenuIcon } from 'lucide-react';
export const Header = () => {
  return <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BusIcon className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              BusConnect
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              Home
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              Routes
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              Services
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              About Us
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              Contact
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-4 py-2 backdrop-blur-lg">
              <UserIcon className="h-5 w-5 text-white" />
              <span className="text-white hidden md:inline">Account</span>
            </button>
            <button className="md:hidden text-white">
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>;
};