const REQUIRED_VARS = [
  'VAPI_WEBHOOK_SECRET',
  'VAPI_API_KEY',
  'VAPI_ASSISTANT_PRIME',
  'VAPI_ASSISTANT_AKF',
  'VAPI_ASSISTANT_CLEANJET',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'TELNYX_API_KEY',
] as const;

type EnvKey = (typeof REQUIRED_VARS)[number];

export const env = Object.fromEntries(
  REQUIRED_VARS.map((key) => {
    const value = Deno.env.get(key);
    if (!value) throw new Error(`[VAPI] Missing required env var: ${key}`);
    return [key, value];
  }),
) as Record<EnvKey, string>;

/** Optional — only needed for RAG / knowledge-base search. */
export const OPENAI_API_KEY: string = Deno.env.get('OPENAI_API_KEY') ?? '';

export const BRAND_ASSISTANT_MAP: Record<string, string> = {
  [env.VAPI_ASSISTANT_PRIME]:    'prime',
  [env.VAPI_ASSISTANT_AKF]:      'akf',
  [env.VAPI_ASSISTANT_CLEANJET]: 'cleanjet',
};
