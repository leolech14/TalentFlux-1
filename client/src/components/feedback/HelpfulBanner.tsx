import { useState } from "react";
import { Button } from "@/components/ui/button";
import { recordFeedback } from "@/ai/recordFeedback";

export function HelpfulBanner({ eventId }: { eventId: number }) {
  const [closed, setClosed] = useState(false);
  if (closed) return null;

  const send = async (thumbsUp: boolean) => {
    try {
      await recordFeedback(eventId, thumbsUp);
    } finally {
      setClosed(true);
    }
  };

  return (
    <div className="p-4 border rounded-lg mb-4 bg-muted/50">
      <p className="font-medium mb-2">Was this helpful?</p>
      <div className="flex gap-2">
        <Button size="sm" className="bg-green-600" onClick={() => send(true)}>
          👍 Yes
        </Button>
        <Button size="sm" variant="destructive" onClick={() => send(false)}>
          👎 No
        </Button>
      </div>
    </div>
  );
}
