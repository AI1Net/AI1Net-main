import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { 
  useGetAITool, 
  getGetAIToolQueryKey,
  useSubmitAIRequest
} from "@workspace/api-client-react";
import { ArrowLeft, Send, Terminal, Loader2, Zap } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const MOCK_MODELS = {
  TEXT: ["GPT-4o", "Claude-3.5-Sonnet", "Llama-3-70b"],
  IMAGE: ["Midjourney-v6", "DALL-E-3", "Stable-Diffusion-3"],
  VIDEO: ["Sora", "Runway-Gen-3", "Kling"],
  CODE: ["Claude-3.5-Sonnet", "GPT-4o", "Codestral"],
  VOICE: ["ElevenLabs", "OpenAI-TTS", "PlayHT"],
  MULTIMODAL: ["GPT-4o", "Claude-3.5-Sonnet", "Gemini-1.5-Pro"]
};

export default function AITool() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const slug = params.slug || "";
  const queryClient = useQueryClient();

  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>("");
  const [output, setOutput] = useState<string | null>(null);

  const { data: tool, isLoading: isToolLoading } = useGetAITool(slug, {
    query: { enabled: !!slug, queryKey: getGetAIToolQueryKey(slug) }
  });

  const submitMutation = useSubmitAIRequest();

  // Set default model when tool loads
  if (tool && !model && MOCK_MODELS[tool.category]?.[0]) {
    setModel(MOCK_MODELS[tool.category][0]);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !tool) return;

    submitMutation.mutate({
      data: { toolSlug: tool.slug, input, model }
    }, {
      onSuccess: (res) => {
        setOutput(res.output);
        // Refresh token balance globally
        queryClient.invalidateQueries({ queryKey: ["/api/tokens/balance"] });
        queryClient.invalidateQueries({ queryKey: ["/api/usage/stats"] });
      }
    });
  };

  if (isToolLoading) {
    return <div className="p-8 font-mono animate-pulse">LOADING MODEL INTERFACE...</div>;
  }

  if (!tool) {
    return <div className="p-8 font-mono">MODEL NOT FOUND</div>;
  }

  const availableModels = MOCK_MODELS[tool.category] || ["Default-Model"];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 border-b-[4px] border-black dark:border-white pb-4">
        <button 
          onClick={() => setLocation("/explore")}
          className="brutalist-button p-2 bg-white text-black hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">{tool.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-mono text-sm bg-black text-white px-2 py-0.5 border-2 border-black dark:border-white uppercase font-bold">
              {tool.category}
            </span>
            <span className="font-mono text-sm text-muted-foreground">
              {tool.providerName}
            </span>
          </div>
        </div>
        <div className="ml-auto text-right hidden md:block">
          <div className="font-mono text-sm text-muted-foreground">COST_ESTIMATE</div>
          <div className="font-black text-xl text-primary filter drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
            {tool.pricePerUse} A1N
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="brutalist-card p-6 bg-card flex flex-col gap-4">
            <div className="flex justify-between items-center border-b-[3px] border-black dark:border-white pb-3">
              <div className="font-bold uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                INPUT_STREAM
              </div>
              <select 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-background border-2 border-black dark:border-white p-1 font-mono text-sm font-bold uppercase focus:outline-none"
              >
                {availableModels.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ENTER PROMPT SEQUENCE..."
              className="w-full h-48 bg-background border-2 border-black dark:border-white p-4 font-mono resize-none focus:outline-none focus:border-primary focus:ring-0 placeholder:text-muted-foreground"
              required
            />

            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                disabled={submitMutation.isPending || !input.trim()}
                className="brutalist-button bg-primary text-black px-6 py-3 flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
              >
                {submitMutation.isPending ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> EXECUTING...</>
                ) : (
                  <><Send className="w-5 h-5" /> EXECUTE_QUERY</>
                )}
              </button>
            </div>
          </form>

          {/* Output Box */}
          <div className="brutalist-card p-0 bg-card overflow-hidden flex flex-col min-h-[300px]">
            <div className="bg-black text-primary p-3 font-mono font-bold text-sm uppercase flex items-center gap-2 border-b-[3px] border-black dark:border-white">
              <Zap className="w-4 h-4" />
              OUTPUT_STREAM
            </div>
            <div className="p-6 font-mono whitespace-pre-wrap flex-1 bg-background">
              {submitMutation.isPending ? (
                <div className="flex items-center gap-3 text-muted-foreground animate-pulse">
                  <span className="w-2 h-5 bg-primary animate-ping"></span>
                  PROCESSING...
                </div>
              ) : output ? (
                <div className="text-foreground">{output}</div>
              ) : (
                <div className="text-muted-foreground opacity-50">AWAITING EXECUTION...</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Info & Status */}
        <div className="space-y-6">
          <div className="brutalist-card p-6 bg-card space-y-4">
            <h3 className="font-black uppercase text-lg border-b-[3px] border-black dark:border-white pb-2">MODEL_INFO</h3>
            <p className="font-mono text-sm text-muted-foreground">{tool.description}</p>
            
            <div className="space-y-2 pt-4 border-t-[3px] border-black dark:border-white">
              <div className="flex justify-between font-mono text-sm">
                <span className="text-muted-foreground">PROVIDER</span>
                <span className="font-bold">{tool.providerName}</span>
              </div>
              <div className="flex justify-between font-mono text-sm">
                <span className="text-muted-foreground">BASE_COST</span>
                <span className="font-bold">{tool.pricePerUse} A1N</span>
              </div>
            </div>
          </div>

          {submitMutation.isSuccess && submitMutation.data && (
            <div className="brutalist-card p-6 bg-secondary text-secondary-foreground space-y-4 animate-in zoom-in-95">
              <h3 className="font-black uppercase text-lg border-b-[3px] border-black dark:border-white pb-2">TRANSACTION_LOG</h3>
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-sm">
                  <span className="opacity-80">STATUS</span>
                  <span className="font-bold text-green-300">{submitMutation.data.status}</span>
                </div>
                <div className="flex justify-between font-mono text-sm">
                  <span className="opacity-80">TOKENS_USED</span>
                  <span className="font-bold">{submitMutation.data.tokensUsed}</span>
                </div>
                <div className="flex justify-between font-mono text-sm border-t-2 border-white/20 pt-2 mt-2">
                  <span className="opacity-80">REMAINING_BAL</span>
                  <span className="font-bold">{submitMutation.data.remainingBalance} A1N</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
