import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg-primary text-center">
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-accent-amber/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl bg-accent-red/10 border border-accent-red/20 text-accent-red flex items-center justify-center mb-6">
          <HelpCircle className="w-10 h-10" />
        </div>

        <h1 className="text-7xl font-extrabold font-display text-accent-amber tracking-tighter mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-text-primary mb-2 font-display">
          Task Not Found
        </h2>
        
        <p className="text-sm text-text-secondary mb-8 leading-relaxed">
          The page or resource you are looking for has been completed, deleted, or never existed in the first place.
        </p>

        <Link to="/" className="w-full sm:w-auto">
          <Button variant="primary" size="lg" className="animate-glow-pulse w-full">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
