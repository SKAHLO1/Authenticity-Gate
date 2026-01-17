import { Link } from "wouter";
import { ShieldCheck, Github, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/components/UserProfile";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-body selection:bg-primary/30">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                Authenticity<span className="text-primary">Verifier</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <a href="https://docs.genlayer.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                How it Works
              </a>
              <Button variant="outline" size="sm" className="gap-2 rounded-full border-border/50 hover:bg-accent/50">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
              <UserProfile />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-muted-foreground hover:text-foreground"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background">
            <div className="px-4 py-6 space-y-4">
               <a href="https://docs.genlayer.com" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
                Documentation
              </a>
              <a href="#" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
                How it Works
              </a>
            </div>
          </div>
        )}
      </nav>

      <main className="relative">
        {children}
      </main>

      <footer className="border-t border-border/50 mt-20 py-12 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="font-display font-bold text-lg">AuthenticityVerifier</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto md:mx-0">
                Securing the web's content with decentralized AI consensus. 
                Verify originality, detect deepfakes, and ensure trust.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4 text-foreground">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground">
            © 2024 Authenticity Verifier. Built with GenLayer.
          </div>
        </div>
      </footer>
    </div>
  );
}
