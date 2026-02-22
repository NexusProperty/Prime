/**
 * Knowledge Base Embedding Script
 *
 * Reads the seed markdown files, chunks them at paragraph boundaries,
 * generates OpenAI embeddings (text-embedding-3-small), and upserts
 * rows into the Supabase knowledge_base table.
 *
 * Usage:
 *   export SUPABASE_URL=https://tfdxlhkaziskkwwohtwd.supabase.co
 *   export SUPABASE_SERVICE_ROLE_KEY=your-key
 *   export OPENAI_API_KEY=your-key
 *   deno run --allow-net --allow-env --allow-read supabase/seed/embed-knowledge-base.ts
 */
import { createClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY') ?? '';

if (!SUPABASE_URL || !SUPABASE_KEY || !OPENAI_KEY) {
  console.error('Missing required env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY');
  Deno.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SEED_FILES: Array<{ brand: string; path: string; source: string }> = [
  { brand: 'prime',    path: './supabase/seed/knowledge_base/prime-faq.md',    source: 'faq' },
  { brand: 'akf',      path: './supabase/seed/knowledge_base/akf-faq.md',      source: 'faq' },
  { brand: 'cleanjet', path: './supabase/seed/knowledge_base/cleanjet-faq.md', source: 'faq' },
];

interface Chunk {
  brand: string;
  title: string;
  content: string;
  source: string;
}

function chunkMarkdown(text: string, brand: string, source: string): Chunk[] {
  const chunks: Chunk[] = [];
  const sections = text.split(/\n## /);

  for (const section of sections) {
    if (!section.trim()) continue;
    const lines = section.split('\n');
    const sectionTitle = (lines[0] ?? '').replace(/^#+ /, '').trim();
    const subsections = section.split(/\n### /);

    for (const sub of subsections.slice(1)) {
      const subLines = sub.split('\n');
      const subTitle = (subLines[0] ?? '').trim();
      const content = subLines.slice(1).join('\n').trim();

      if (content.length > 20) {
        chunks.push({
          brand,
          title: `${sectionTitle} — ${subTitle}`,
          content: content.replace(/\n+/g, ' ').trim(),
          source,
        });
      }
    }
  }

  return chunks;
}

async function embedText(text: string): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: text }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI embedding error: ${res.status} ${await res.text()}`);
  }

  const json = await res.json() as { data: Array<{ embedding: number[] }> };
  return json.data[0]?.embedding ?? [];
}

async function main(): Promise<void> {
  console.log('Starting knowledge base embedding...');
  let totalInserted = 0;

  for (const file of SEED_FILES) {
    console.log(`\nProcessing ${file.path}...`);

    let text: string;
    try {
      text = await Deno.readTextFile(file.path);
    } catch {
      console.error(`Could not read ${file.path} — skipping`);
      continue;
    }

    const chunks = chunkMarkdown(text, file.brand, file.source);
    console.log(`  ${chunks.length} chunks extracted`);

    for (const chunk of chunks) {
      try {
        const embedding = await embedText(`${chunk.title}\n${chunk.content}`);

        const { error } = await supabase.from('knowledge_base').upsert(
          {
            brand: chunk.brand,
            title: chunk.title,
            content: chunk.content,
            embedding,
            source: chunk.source,
          },
          { onConflict: 'title', ignoreDuplicates: false },
        );

        if (error) {
          console.error(`  Error inserting "${chunk.title}":`, error.message);
        } else {
          console.log(`  ✓ "${chunk.title}"`);
          totalInserted++;
        }

        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (err) {
        console.error(`  Error embedding "${chunk.title}":`, err);
      }
    }
  }

  console.log(`\nDone. ${totalInserted} chunks embedded and inserted.`);
}

main();
