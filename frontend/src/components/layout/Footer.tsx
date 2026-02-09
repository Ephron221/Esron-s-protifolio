import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/90 border-t border-white/10 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-primary cyan-glow mb-4">ESRON</h3>
            <p className="text-gray-400 max-w-xs">
              Building modern, scalable, and interactive digital experiences with passion and precision.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-primary transition-colors">Home</a></li>
              <li><a href="/projects" className="text-gray-400 hover:text-primary transition-colors">Projects</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-primary transition-colors">About</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-2 glass rounded-full hover:text-primary transition-all">
                <Github size={20} />
              </a>
              <a href="#" className="p-2 glass rounded-full hover:text-primary transition-all">
                <Linkedin size={20} />
              </a>
              <a href="#" className="p-2 glass rounded-full hover:text-primary transition-all">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-2 glass rounded-full hover:text-primary transition-all">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {currentYear} Esron Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
