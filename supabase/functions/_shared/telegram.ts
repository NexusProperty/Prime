const TELEGRAM_API_BASE = 'https://api.telegram.org';

function getTelegramToken(): string {
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN not set');
  return token;
}

/** Send a plain text or MarkdownV2 message to a chat */
export async function sendMessage(
  chatId: number,
  text: string,
  parseMode?: 'MarkdownV2' | 'HTML',
): Promise<void> {
  const token = getTelegramToken();
  const body: Record<string, unknown> = { chat_id: chatId, text };
  if (parseMode) body.parse_mode = parseMode;

  const res = await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('[telegram][sendMessage] API error:', err);
  }
}

/** Send a typing indicator */
export async function sendTyping(chatId: number): Promise<void> {
  const token = getTelegramToken();
  await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendChatAction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
    signal: AbortSignal.timeout(5_000),
  }).catch(() => {/* non-critical */});
}

/** Escape text for Telegram MarkdownV2 */
export function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

/** Send a message with inline keyboard buttons */
export async function sendInlineKeyboard(
  chatId: number,
  text: string,
  buttons: Array<Array<{ text: string; callback_data: string }>>,
): Promise<void> {
  const token = getTelegramToken();
  await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_markup: { inline_keyboard: buttons },
    }),
    signal: AbortSignal.timeout(10_000),
  }).catch((err: unknown) => console.error('[telegram][sendInlineKeyboard]', err));
}

/** Answer a callback query (dismiss loading spinner on inline button) */
export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
): Promise<void> {
  const token = getTelegramToken();
  await fetch(`${TELEGRAM_API_BASE}/bot${token}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
    signal: AbortSignal.timeout(5_000),
  }).catch(() => {/* non-critical */});
}
