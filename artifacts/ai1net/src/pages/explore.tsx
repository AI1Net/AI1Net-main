import { useState } from "react";
import { Link } from "wouter";
import { 
  useListAITools, 
  getListAIToolsQueryKey, 
  AICategory,
  useListAIProviders,
  getListAIProvidersQueryKey
} from "@workspace/api-client-react";
import { Search, Filter, Cpu, Terminal, ArrowRight } from "lucide-react";

export default function Explore() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<AICategory | undefined>(undefined);
  const [providerId, setProviderId] = useState<string | undefined>(undefined);

  const { data: tools, isLoading } = useListAITools(
    { search: search || undefined, category, providerId },
    { query: { queryKey: getListAIToolsQueryKey({ search: search || undefined, category, providerId }) } }
  );

  const { data: providers } = useListAIProviders({
    query: { queryKey: getListAIProvidersQueryKey() }
  });

  const categories = Object.values(AICategory);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b-[4px] border-black dark:border-white pb-4 gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">Model Registry</h1>
          <p className="font-mono text-muted-foreground mt-2">EXPLORE // DEPLOY // INTEGRATE</p>
        </div>
      </div>

      {/* Filters */}
      <div className="brutalist-card p-4 bg-card flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="SEARCH MODELS..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border-2 border-black dark:border-white p-2 pl-10 font-mono font-bold uppercase focus:outline-none focus:border-primary focus:ring-0"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={category || ""} 
            onChange={(e) => setCategory(e.target.value ? e.target.value as AICategory : undefined)}
            className="bg-background border-2 border-black dark:border-white p-2 font-mono font-bold uppercase focus:outline-none"
          >
            <option value="">ALL CATEGORIES</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select 
            value={providerId || ""} 
            onChange={(e) => setProviderId(e.target.value || undefined)}
            className="bg-background border-2 border-black dark:border-white p-2 font-mono font-bold uppercase focus:outline-none"
          >
            <option value="">ALL PROVIDERS</option>
            {providers?.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="brutalist-card p-6 h-64 animate-pulse flex flex-col">
              <div className="h-8 bg-muted w-1/2 mb-4"></div>
              <div className="h-4 bg-muted w-3/4 mb-2"></div>
              <div className="h-4 bg-muted w-full mb-auto"></div>
              <div className="h-10 bg-muted w-full"></div>
            </div>
          ))}
        </div>
      ) : tools?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
            <Link key={tool.id} href={`/ai/${tool.slug}`} className="block group">
              <div className="brutalist-card p-6 bg-card h-full flex flex-col group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:group-hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all cursor-pointer relative overflow-hidden">
                {/* Category Badge */}
                <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 font-mono text-xs font-bold border-l-[3px] border-b-[3px] border-black dark:border-white">
                  {tool.category}
                </div>
                
                <h3 className="text-2xl font-black uppercase mb-2 pr-16">{tool.name}</h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-mono text-sm bg-accent/20 text-accent-foreground px-2 py-0.5 border-2 border-accent uppercase">
                    {tool.providerName}
                  </span>
                  <span className="font-mono text-sm bg-primary/20 text-primary-foreground px-2 py-0.5 border-2 border-primary">
                    {tool.pricePerUse} A1N/req
                  </span>
                </div>
                
                <p className="text-muted-foreground font-mono text-sm mb-6 flex-1">
                  {tool.description}
                </p>
                
                <div className="mt-auto flex items-center justify-between border-t-[3px] border-black dark:border-white pt-4">
                  <span className="font-bold uppercase tracking-wider text-sm flex items-center group-hover:text-primary transition-colors">
                    INIT_NODE <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="brutalist-card p-12 text-center flex flex-col items-center justify-center">
          <Terminal className="w-12 h-12 mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-black uppercase mb-2">NO MODELS FOUND</h3>
          <p className="font-mono text-muted-foreground">Adjust filters to broaden search space.</p>
        </div>
      )}
    </div>
  );
}
