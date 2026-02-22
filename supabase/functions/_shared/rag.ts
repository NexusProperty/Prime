import { createClient } from 'jsr:@supabase/supabase-js@2';
import { env, OPENAI_API_KEY } from './env.ts';

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const OPENROUTER_API_KEY: string = Deno.env.get('OPENROUTER_API_KEY') ?? '';
const EMBED_KEY = OPENROUTER_API_KEY || OPENAI_API_KEY;
const EMBED_URL = OPENROUTER_API_KEY
  ? 'https://openrouter.ai/api/v1/embeddings'
  : 'https://api.openai.com/v1/embeddings';
const EMBED_MODEL = 'text-embedding-3-small';
const EMBED_TIMEOUT_MS = 3000;

interface KBRow {
  title: string;
  content: string;
  source: string;
}

export async function searchKnowledgeBase(
  query: string,
  brand: 'prime' | 'akf' | 'cleanjet',
): Promise<string> {
  if (!EMBED_KEY) {
    console.warn('[RAG] No embedding key set (OPENROUTER_API_KEY or OPENAI_API_KEY) — knowledge base search unavailable');
    return 'I do not have specific information on that right now. I will have someone from the team follow up with you.';
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), EMBED_TIMEOUT_MS);

  const embedHeaders: Record<string, string> = {
    'Authorization': `Bearer ${EMBED_KEY}`,
    'Content-Type': 'application/json',
  };
  if (OPENROUTER_API_KEY) {
    embedHeaders['HTTP-Referer'] = env.SUPABASE_URL;
    embedHeaders['X-Title'] = 'Prime Group Voice Agent';
  }

  let embedding: number[];
  try {
    const embedRes = await fetch(EMBED_URL, {
      method: 'POST',
      headers: embedHeaders,
      body: JSON.stringify({ model: EMBED_MODEL, input: query }),
      signal: controller.signal,
    });

    if (!embedRes.ok) {
      console.error(`[RAG][embed-error] HTTP ${embedRes.status}`);
      return 'I could not find that information right now. I will make sure someone follows up with you.';
    }

    const embedJson = await embedRes.json() as { data: Array<{ embedding: number[] }> };
    embedding = embedJson.data[0]?.embedding ?? [];
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === 'AbortError';
    console.error(`[RAG][embed-${isTimeout ? 'timeout' : 'error'}]`, err);
    return 'I could not find that information right now. I will make sure someone follows up with you.';
  } finally {
    clearTimeout(timeoutId);
  }

  if (embedding.length === 0) {
    return 'I could not find that information right now.';
  }

  const { data, error } = await supabase.rpc('match_knowledge_base', {
    query_embedding: embedding,
    filter_brand: brand,
    match_threshold: 0.75,
    match_count: 3,
  });

  if (error) {
    console.error(`[RAG][db-error]`, error);
    return 'I could not find that information right now.';
  }

  if (!data || (data as KBRow[]).length === 0) {
    return 'I do not have specific information on that. I will have someone call you back with the details.';
  }

  return (data as KBRow[])
    .map((row) => `${row.title}. ${row.content}`)
    .join('. ');
}
