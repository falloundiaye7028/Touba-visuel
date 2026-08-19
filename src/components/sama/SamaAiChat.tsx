"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, User } from "lucide-react";
import { askSamaAiAction, type AskState } from "@/lib/sama/actions/ai";

interface Msg { role: "user" | "ai"; text: string }

const SUGGESTIONS = [
  "Combien ai-je vendu aujourd'hui ?",
  "Quel est mon produit le plus rentable ?",
  "Quels produits risquent la rupture ?",
  "Quels clients n'ont rien acheté depuis 60 jours ?",
  "Quel vendeur a réalisé le plus de ventes ?",
  "Comment évoluent mes ventes ?",
];

export default function SamaAiChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Bonjour 👋 Je suis SAMA AI. Posez-moi une question sur votre activité — mes réponses s'appuient sur vos données réelles." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function ask(question: string) {
    if (!question.trim() || loading) return;
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    const fd = new FormData();
    fd.set("question", question);
    const res: AskState = await askSamaAiAction({}, fd);
    setLoading(false);
    setMessages((m) => [...m, { role: "ai", text: res.error ?? res.answer ?? "Je n'ai pas pu répondre." }]);
  }

  return (
    <div className="card flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <span className={`w-8 h-8 rounded-full grid place-items-center shrink-0 ${msg.role === "ai" ? "bg-vert-100 text-vert-700" : "bg-or-100 text-or-700"}`}>
              {msg.role === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </span>
            <div className={`rounded-2xl px-3 py-2 text-sm max-w-[80%] whitespace-pre-line ${msg.role === "ai" ? "bg-gray-100 text-gray-800" : "bg-vert-700 text-white"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <span className="w-8 h-8 rounded-full bg-vert-100 text-vert-700 grid place-items-center"><Bot className="w-4 h-4" /></span>
            <div className="rounded-2xl px-3 py-2 bg-gray-100"><span className="inline-flex gap-1"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" /><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]" /><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]" /></span></div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => ask(s)} className="text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-gray-600 hover:bg-vert-50 hover:text-vert-700">{s}</button>
          ))}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="border-t border-gray-100 p-3 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Posez votre question…" className="input-field !py-2.5" />
        <button type="submit" disabled={loading} className="btn-primary !px-4"><Send className="w-4 h-4" /></button>
      </form>
    </div>
  );
}
