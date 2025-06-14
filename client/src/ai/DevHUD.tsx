import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Activity } from "lucide-react";
import type { AiEvent } from "@shared/schema";

export function DevHUD() {
  const [events, setEvents] = useState<AiEvent[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/ai/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data.slice(0, 10)); // Show last 10 events
        }
      } catch (error) {
        console.warn('Failed to fetch AI events:', error);
      }
    };

    // Initial fetch
    fetchEvents();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-2 left-2 z-[9999] text-xs">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-black/80 backdrop-blur text-white rounded-lg border border-gray-600 shadow-xl"
          >
            <div className="flex items-center justify-between p-2 border-b border-gray-600">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-blue-400" />
                <span className="text-blue-400 font-semibold">AI Events</span>
                <span className="text-gray-400">({events.length})</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 hover:bg-white/10 rounded"
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? "−" : "+"}
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 hover:bg-white/10 rounded"
                  title="Hide"
                >
                  <EyeOff size={12} />
                </button>
              </div>
            </div>

            {isExpanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-2 max-h-60 overflow-y-auto">
                  {events.length === 0 ? (
                    <div className="text-gray-400 py-2">No events yet</div>
                  ) : (
                    <div className="space-y-1">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="p-2 bg-white/5 rounded border-l-2 border-blue-500"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-blue-300 font-medium">
                              {event.intentId}
                            </span>
                            <span className="text-gray-400 text-xs">
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          {event.context ? (
                            <div className="text-gray-300 text-xs mt-1">
                              {typeof event.context === 'object' && event.context !== null ? (
                                <div>
                                  {(event.context as any).route && (
                                    <span className="mr-2">📍 {String((event.context as any).route)}</span>
                                  )}
                                  {(event.context as any).device && (
                                    <span className="mr-2">📱 {String((event.context as any).device)}</span>
                                  )}
                                </div>
                              ) : (
                                <span>{String(event.context)}</span>
                              )}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!isVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsVisible(true)}
          className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-full border border-gray-600 shadow-xl"
          title="Show AI Events"
        >
          <Eye size={16} />
        </motion.button>
      )}
    </div>
  );
}