import React from 'react';
import { BusIcon, FacebookIcon, TwitterIcon, InstagramIcon, PhoneIcon, MailIcon, MapPinIcon } from 'lucide-react';
export const Footer = () => {
  return <footer className="bg-white/10 backdrop-blur-lg border-t border-white/20 mt-10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BusIcon className="h-6 w-6 text-white" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                BusConnect
              </span>
            </div>
            <p className="text-white/70 text-sm">
              Providing comfortable and reliable interprovincial bus services
              across the country.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  Routes
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  Express Routes
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  VIP Buses
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  Night Travel
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  Package Delivery
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  Charter Services
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <PhoneIcon className="h-5 w-5 text-white/70 mt-0.5" />
                <span className="text-white/70 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MailIcon className="h-5 w-5 text-white/70 mt-0.5" />
                <span className="text-white/70 text-sm">
                  info@busconnect.com
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-white/70 mt-0.5" />
                <span className="text-white/70 text-sm">
                  123 Transport Ave, Central Terminal, Main City
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-white/50 text-sm">
          © {new Date().getFullYear()} BusConnect. All rights reserved.
        </div>
      </div>
    </footer>;
};