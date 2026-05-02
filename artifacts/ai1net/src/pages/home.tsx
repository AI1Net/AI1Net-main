import { Link } from "wouter";
import { ArrowRight, Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col font-sans bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px]">
      <header className="h-20 border-b-[3px] border-black dark:border-white bg-primary flex items-center justify-between px-8 z-10">
        <div className="flex items-center gap-3 text-black">
          <Terminal className="w-8 h-8" />
          <span className="font-black text-2xl tracking-widest">AI1NET</span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/sign-in" 
            className="font-bold uppercase tracking-wider px-6 py-2 border-[3px] border-black bg-white text-black hover:bg-black hover:text-white transition-colors"
          >
            LOGIN
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-secondary border-[3px] border-black dark:border-white opacity-20 transform rotate-12 pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-destructive border-[3px] border-black dark:border-white opacity-20 transform -rotate-6 pointer-events-none"></div>

        <div className="max-w-4xl w-full brutalist-card p-10 md:p-16 relative bg-card">
          <div className="absolute -top-4 -left-4 px-4 py-1 bg-black text-primary font-mono font-bold text-sm">SYSTEM.INIT</div>
          
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-6">
            The <span className="text-primary filter drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] dark:drop-shadow-[3px_3px_0px_rgba(255,255,255,1)]">Command Center</span><br/>
            For The AI Economy
          </h1>
          
          <p className="text-xl md:text-2xl font-mono mb-10 max-w-2xl text-muted-foreground border-l-[4px] border-primary pl-6">
            Access multiple models, track token usage, earn rewards, and govern the protocol from a single, dense interface.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <Link 
              href="/sign-up" 
              className="brutalist-button bg-primary text-black px-8 py-5 text-xl inline-flex items-center justify-center hover:bg-primary/90"
            >
              INITIALIZE NODE
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
            <Link 
              href="/explore" 
              className="brutalist-button bg-white text-black px-8 py-5 text-xl inline-flex items-center justify-center hover:bg-gray-100"
            >
              EXPLORE NETWORK
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-sm border-t-[3px] border-black dark:border-white pt-8">
            <div>
              <div className="font-bold text-black dark:text-white mb-2 uppercase border-b-2 border-black dark:border-white inline-block">UNIFIED ACCESS</div>
              <p className="text-muted-foreground">Route requests across top LLMs effortlessly.</p>
            </div>
            <div>
              <div className="font-bold text-black dark:text-white mb-2 uppercase border-b-2 border-black dark:border-white inline-block">TOKEN ECONOMICS</div>
              <p className="text-muted-foreground">Pay per use, earn rewards, stake for yield.</p>
            </div>
            <div>
              <div className="font-bold text-black dark:text-white mb-2 uppercase border-b-2 border-black dark:border-white inline-block">GOVERNANCE</div>
              <p className="text-muted-foreground">Vote on protocol upgrades and parameter changes.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
