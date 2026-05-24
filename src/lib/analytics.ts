type EventType = 'job_view' | 'whatsapp_click' | 'instagram_click' | 'studio_view';

export function trackEvent(eventType: EventType, studioUserId: string, jobId?: string) {
  // Fire and forget — don't block the UI
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventType, studioUserId, jobId }),
  }).catch(() => {
    // Silently fail — analytics should never break user experience
  });
}
