// App configuration — single source of truth for all identity/attribution text.
// Layout & Navigation Builder populates these values from the Job Analyst brief.
export const APP_CONFIG = {
  appName: "App Name",          // Display name for the app (sidebar header)
  projectName: "Project Name",  // What the client calls their project
  clientName: null as string | null,  // Client first name from Job Analyst, or null
  domain: "tech",               // Domain classification (finance, health, marketplace, etc.)
} as const;
