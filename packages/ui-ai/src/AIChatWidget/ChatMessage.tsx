import clsx from 'clsx'
import { brandConfig } from '../brandConfig'
import type { Brand, ChatMessageData } from '../types'

interface Props {
  message: ChatMessageData
  brand: Brand
}

export function ChatMessage({ message, brand }: Props) {
  const { bg } = brandConfig[brand]
  const isUser = message.role === 'user'

  return (
    <div className={clsx('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed',
          isUser ? clsx(bg, 'rounded-tr-sm text-white') : 'rounded-tl-sm bg-slate-100 text-slate-800',
        )}
      >
        {message.content}
        {message.isStreaming && (
          <span
            className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-current align-middle motion-reduce:animate-none"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  )
}
