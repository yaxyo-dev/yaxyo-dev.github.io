import { ui } from '../content/ui';

export default function ChatMock({ lang }) {
  const t = ui[lang].bot;
  return (
    <figure className="chat" aria-label={t.chatLabel}>
      <div className="chat-thread">
        {t.chat.map(([who, text]) => (
          <p key={text} className={`chat-line chat-${who}`}>{text}</p>
        ))}
      </div>
      <figcaption>{t.chatCaption}</figcaption>
    </figure>
  );
}
