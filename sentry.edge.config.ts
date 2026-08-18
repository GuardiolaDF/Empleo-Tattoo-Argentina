import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://f8fcb59ca760e71e6d1042e829b6ab3e@o4511933458939904.ingest.us.sentry.io/4511933475258368",
  tracesSampleRate: 1.0,
});
