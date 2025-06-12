interface AIEventContext {
  userId?: string;
  route: string;
  device: string;
  userAgent: string;
  timestamp: Date;
}

export async function emitAIEvent(intentId: string, context: Partial<AIEventContext>): Promise<number> {
  try {
    const eventData = {
      intentId,
      userId: context.userId || null,
      context: {
        route: context.route || window.location.pathname,
        device: context.device || (window.innerWidth < 768 ? 'mobile' : 'desktop'),
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        ...context
      }
    };

    const response = await fetch('/api/ai/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      throw new Error(`Failed to emit AI event: ${response.statusText}`);
    }

    const result = await response.json();
    return result.eventId;
  } catch (error) {
    console.error('Failed to emit AI event:', error);
    return -1; // Return invalid ID on failure
  }
}