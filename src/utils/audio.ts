/**
 * Hệ thống âm thanh thông báo nhẹ nhàng (Web Audio API)
 * - Hoàn toàn không dùng file âm thanh ngoài
 * - Không tự động phát khi mở trang
 * - Âm lượng nhẹ (~0.04), tần số ấm áp
 * - Có thể bật/tắt tùy ý từ thanh tiêu đề
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSoftChime(soundEnabled = true): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Hai nốt nhạc ấm áp (Mi -> Sol)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5

    // Envelope âm lượng nhẹ
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch (err) {
    // Không làm gián đoạn trải nghiệm nếu trình duyệt chặn audio
    console.debug('Audio play prevented:', err);
  }
}
