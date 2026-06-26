import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Cpu, Terminal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { askPhoenix } from "@/lib/api/ai";
import aiLogo from "@/assets/ai.png";

interface Message {
  id: string;
  sender: "user" | "phoenix";
  text: string;
}

export function PhoenixChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "phoenix",
      text: "I am Phoenix, your AI Guardian. Secure connection established. How can I assist with your training today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (textToSubmit: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSubmit.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Gather conversation history to send to Gemini API
      const history = [...messages, userMsg].map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await askPhoenix({
        data: {
          messages: history,
        },
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "phoenix",
          text: res.text,
        },
      ]);
    } catch (err) {
      console.error("Failed to query Phoenix AI:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "phoenix",
          text: "Neural Anomaly: Connection to the AI Guardian core was disrupted. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const text = input;
    setInput("");
    sendMessage(text);
  };

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ initialMessage?: string }>;
      setIsOpen(true);
      if (customEvent.detail?.initialMessage) {
        const text = customEvent.detail.initialMessage.trim();
        if (text) {
          sendMessage(text);
        }
      }
    };

    window.addEventListener("open-phoenix-chat" as any, handleOpen);
    return () => window.removeEventListener("open-phoenix-chat" as any, handleOpen);
  }, [messages]);


  // Do not render floating widget on the landing page if the user is not authenticated, 
  // or just render it globally. Let's render it globally but maybe not on auth screens.
  // We'll let it be global.

  return (
    <>
      {/* Floating Orb Trigger */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[100] group flex items-center justify-center w-14 h-14 rounded-full bg-black/60 border border-primary/50 backdrop-blur-md shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.6)] hover:border-primary transition-all cursor-pointer"
          >
            {/* Pulsing core */}
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-50" />
            <img src={aiLogo} alt="AI Guardian" className="w-11 h-11 object-cover filter drop-shadow-[0_0_8px_rgba(255,107,0,0.8)] relative z-10 group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-[100] w-[350px] sm:w-[400px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] rounded-lg border border-primary/30 bg-black/80 backdrop-blur-xl shadow-[0_0_40px_rgba(255,107,0,0.2)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20 bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-full border border-primary/50 bg-black/50 overflow-hidden">
                  <img src={aiLogo} alt="AI Guardian" className="w-full h-full object-cover filter drop-shadow-[0_0_4px_rgba(255,107,0,0.8)]" />
                  <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e] z-10" />
                </div>
                <div>
                  <h3 className="font-orbitron text-sm font-bold text-white tracking-wider">PHOENIX</h3>
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-primary/80">AI Guardian</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 grain-light">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`flex items-center gap-2 mb-1 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground/60">
                      {msg.sender === "user" ? (user?.user_metadata?.username || "Operative") : "System"}
                    </span>
                  </div>
                  <div
                    className={`max-w-[85%] rounded p-3 text-sm ${
                      msg.sender === "user"
                        ? "bg-white/10 text-white border border-white/20 rounded-tr-none"
                        : "bg-primary/10 text-primary-foreground border border-primary/30 rounded-tl-none font-mono"
                    }`}
                  >
                    {msg.sender === "phoenix" && <Terminal className="w-3 h-3 inline-block mr-2 text-primary opacity-70" />}
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground/60 mb-1">System</div>
                  <div className="bg-primary/5 border border-primary/20 rounded p-3 rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 border-t border-primary/20 bg-black/60 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Transmit message..."
                disabled={isTyping}
                className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 font-mono text-xs text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2 rounded bg-primary text-black hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
