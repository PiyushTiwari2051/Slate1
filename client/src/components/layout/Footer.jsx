import { Github, Linkedin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-border-subtle bg-bg-secondary py-8 mt-auto select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display text-base font-bold text-text-primary">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-accent-amber text-bg-primary text-sm font-bold font-mono">
              S
            </span>
            Slate
          </div>
          
          <p className="text-xs text-text-muted flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-accent-red fill-accent-red" /> for Slate © {new Date().getFullYear()}
          </p>

          <div className="flex items-center gap-4 text-text-secondary">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-amber transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-amber transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
