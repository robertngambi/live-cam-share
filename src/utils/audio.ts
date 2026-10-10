// High fidelity Web Audio synthesizer for camera shutter, timer countdown, and record sounds

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Realistic mechanical camera shutter sound:
 * 1. Initial mirror reflex click (sharp metallic pop)
 * 2. Rapid exposure pause (25ms)
 * 3. Curtain close click & resonant body decay
 */
export function playCameraShutterSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Buffer noise burst for mechanical snap
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    // 1st click (Opening)
    const noiseNode1 = ctx.createBufferSource();
    noiseNode1.buffer = buffer;

    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(2200, now);
    filter1.Q.setValueAtTime(3, now);

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0.9, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    noiseNode1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(ctx.destination);

    noiseNode1.start(now);
    noiseNode1.stop(now + 0.04);

    // Subtle low thud (mirror slap)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.03);
    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);

    // 2nd click (Curtain snap, 45ms later)
    const noiseNode2 = ctx.createBufferSource();
    noiseNode2.buffer = buffer;

    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'highpass';
    filter2.frequency.setValueAtTime(3200, now + 0.045);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.setValueAtTime(0.95, now + 0.045);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

    noiseNode2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(ctx.destination);

    noiseNode2.start(now + 0.045);
    noiseNode2.stop(now + 0.11);
  } catch (err) {
    console.warn('Audio playback error', err);
  }
}

/**
 * Countdown timer beep
 */
export function playCountdownBeep(isFinal = false) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const freq = isFinal ? 1200 : 800;
    osc.frequency.setValueAtTime(freq, now);

    const duration = isFinal ? 0.25 : 0.09;
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch (err) {
    console.warn('Countdown audio error', err);
  }
}

/**
 * Record start / stop chime
 */
export function playRecordSound(starting: boolean) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    if (starting) {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    } else {
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);
    }

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  } catch (err) {
    console.warn('Record sound error', err);
  }
}
