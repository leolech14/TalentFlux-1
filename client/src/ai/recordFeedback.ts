export async function recordFeedback(eventId: number, thumbsUp: boolean, comment: string = ''): Promise<void> {
  try {
    const response = await fetch('/api/ai/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, thumbsUp, comment })
    });

    if (!response.ok) {
      throw new Error(`Failed to record feedback: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to record AI feedback:', error);
  }
}