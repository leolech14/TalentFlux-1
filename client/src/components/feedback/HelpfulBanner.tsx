import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { recordFeedback } from "@/ai/recordFeedback";

export function HelpfulBanner({ eventId }: { eventId: number }) {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed in this session or within last 24 hours
    const dismissalKey = `feedback-dismissed-${eventId}`;
    const dismissedData = localStorage.getItem(dismissalKey);

    if (dismissedData) {
      try {
        const { timestamp } = JSON.parse(dismissedData);
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const now = Date.now();

        // If dismissed less than 24 hours ago, keep it closed
        if (now - timestamp < twentyFourHours) {
          setClosed(true);
        } else {
          // Remove expired dismissal
          localStorage.removeItem(dismissalKey);
        }
      } catch (e) {
        // Invalid data, remove it
        localStorage.removeItem(dismissalKey);
      }
    }
  }, [eventId]);

  if (closed) return null;

  const send = async (thumbsUp: boolean) => {
    try {
      await recordFeedback(eventId, thumbsUp);

      // Store dismissal with timestamp for 24-hour expiry
      const dismissalKey = `feedback-dismissed-${eventId}`;
      localStorage.setItem(dismissalKey, JSON.stringify({
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Failed to record feedback:', error);
    } finally {
      setClosed(true);
    }
  };

  return (
    <div className="p-4 border rounded-lg mb-4 bg-muted/50">
      <p className="font-medium mb-2">Was this helpful?</p>
      <div className="flex gap-2">
        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => send(true)}>
          👍 Yes
        </Button>
        <Button size="sm" variant="destructive" onClick={() => send(false)}>
          👎 No
        </Button>
      </div>
    </div>
  );
}
