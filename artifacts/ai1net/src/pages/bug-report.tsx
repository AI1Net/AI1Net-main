import { useState } from "react";
import { Bug, Send, AlertTriangle } from "lucide-react";

export default function BugReport() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);

    try {
      // 👉 Replace this with your API / webhook / telegram bot later
      console.log({
        title,
        description,
        steps,
        severity,
      });

      alert("Bug report submitted!");

      setTitle("");
      setDescription("");
      setSteps("");
      setSeverity("medium");
    } catch (err) {
      alert("Failed to submit bug.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in">
      
      {/* HEADER */}
      <div className="border-b-[4px] border-black dark:border-white pb-4">
        <h1 className="text-4xl font-black uppercase">Bug Report</h1>
        <p className="font-mono text-muted-foreground mt-2">
          REPORT.SYSTEM.ERROR // HELP IMPROVE AI1NET
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="brutalist-card p-6 space-y-6 bg-card">

        {/* TITLE */}
        <div className="space-y-2">
          <label className="font-bold uppercase text-sm">BUG TITLE</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short description of the bug"
            className="w-full p-3 border-2 border-black dark:border-white bg-background font-mono"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <label className="font-bold uppercase text-sm">DESCRIPTION</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened?"
            rows={4}
            className="w-full p-3 border-2 border-black dark:border-white bg-background font-mono"
          />
        </div>

        {/* STEPS */}
        <div className="space-y-2">
          <label className="font-bold uppercase text-sm">STEPS TO REPRODUCE</label>
          <textarea
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            placeholder="1. Go to...\n2. Click...\n3. Crash"
            rows={4}
            className="w-full p-3 border-2 border-black dark:border-white bg-background font-mono"
          />
        </div>

        {/* SEVERITY */}
        <div className="space-y-2">
                <label
                htmlFor="severity"
                className="font-bold uppercase text-sm"
                >
                SEVERITY
                </label>

                <select
                id="severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full p-3 border-2 border-black dark:border-white bg-background font-mono"
                >
                <option value="low">LOW</option>
                <option value="medium">MEDIUM</option>
                <option value="high">HIGH</option>
                <option value="critical">CRITICAL</option>
                </select>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="brutalist-button bg-primary text-black px-6 py-3 flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          {loading ? "SUBMITTING..." : "SUBMIT REPORT"}
        </button>
      </form>

      {/* QUICK LINKS */}
      <div className="brutalist-card p-6 bg-card space-y-4">
        <h2 className="text-xl font-black uppercase flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Other Channels
        </h2>

        <div className="flex flex-col gap-3 font-mono text-sm">
          <a href="https://github.com/AI1Net" target="_blank" rel="noopener noreferrer" className="brutalist-button p-3 flex justify-between">
            REPORT ON GITHUB
            <span>↗</span>
          </a>

          <a href="https://t.me/Ai1_Net" target="_blank" rel="noopener noreferrer" className="brutalist-button p-3 flex justify-between">
            TELEGRAM SUPPORT
            <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}