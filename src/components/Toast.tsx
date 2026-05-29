import { useEffect, useRef, useState } from 'react';

type ToastKind = 'system' | 'rare';

interface ToastProps {
  message: string;
  subMessage: string;
  onClose: () => void;
  duration?: number;
  // /** 'system' (purple, default) | 'rare' (gold — 만렙 / 칭호 언락) */
  kind?: ToastKind;
}

const KIND_STYLE: Record<
  ToastKind,
  {
    header: string;
    border: string;
    glow: string;
    msgColor: string;
    msgGlow: string;
  }
> = {
  system: {
    header: '>>> SYSTEM <<<',
    border: 'var(--color-purple-glow)',
    glow: 'rgba(122, 111, 255, 0.35)',
    msgColor: 'var(--color-purple-light)',
    msgGlow: '0 0 8px rgba(175,169,236,0.55)',
  },
  rare: {
    header: '>>> RARE UNLOCK <<<',
    border: 'var(--color-gold)',
    glow: 'rgba(0, 210, 106, 0.45)',
    msgColor: 'var(--color-gold)',
    msgGlow: '0 0 8px var(--color-gold-glow), 0 0 16px var(--color-gold-glow)',
  },
};

export default function Toast({
  message,
  subMessage,
  onClose,
  duration = 3500,
  kind = 'system',
}: ToastProps) {
  const [visible, setVisible] = useState(false);
  const onCloseRef = useRef(onClose);
  const style = KIND_STYLE[kind];

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const enterTimer = setTimeout(() => setVisible(true), 10);
    const exitTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onCloseRef.current(), 300);
    }, duration);
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [duration]);

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
      <div
        className="bg-bg-card p-3 space-y-0.5 font-mono"
        style={{
          border: `1px solid ${style.border}`,
          boxShadow: `0 0 0 1px ${style.border} inset, 0 0 22px ${style.glow}`,
        }}>
        <div
          className="text-[9px] tracking-[0.3em] uppercase"
          style={{ color: style.border, textShadow: style.msgGlow }}>
          {style.header}
        </div>
        <div
          className={`text-xs font-bold ${kind === 'rare' ? 't-h1' : ''}`}
          style={{ color: style.msgColor, textShadow: style.msgGlow }}>
          {message}
        </div>
        <div className="text-text-sub text-[11px]">{subMessage}</div>
      </div>
    </div>
  );
}
