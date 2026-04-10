// Instrument synthesizer using Web Audio API
// Produces distinct sounds for Piano, Bass, Guitar, Strings, Drums

export type InstrumentType = "piano" | "bass" | "guitar" | "strings" | "drums";

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function playInstrumentNote(
  ctx: AudioContext,
  instrument: InstrumentType,
  midi: number,
  velocity: number,
  duration: number,
  masterVolume: number = 0.5
): void {
  const freq = midiToFreq(midi);
  const vol = velocity * masterVolume;
  const t = ctx.currentTime;

  switch (instrument) {
    case "piano": {
      // Rich piano: triangle fundamental + sine harmonics + subtle detune
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, t);
      master.gain.linearRampToValueAtTime(vol * 0.4, t + 0.005);
      master.gain.setValueAtTime(vol * 0.35, t + 0.05);
      master.gain.exponentialRampToValueAtTime(vol * 0.2, t + duration * 0.4);
      master.gain.exponentialRampToValueAtTime(0.001, t + duration);
      master.connect(ctx.destination);

      [1, 2, 3, 4, 5].forEach((h, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = i === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq * h + (i > 0 ? Math.random() * 0.5 : 0), t);
        g.gain.setValueAtTime([1, 0.5, 0.25, 0.12, 0.06][i] * 0.3, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + duration * (1 - i * 0.1));
        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + duration + 0.1);
      });
      break;
    }

    case "bass": {
      // Deep bass: sine fundamental + sub-octave + slight saturation
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, t);
      master.gain.linearRampToValueAtTime(vol * 0.5, t + 0.01);
      master.gain.exponentialRampToValueAtTime(vol * 0.35, t + 0.1);
      master.gain.exponentialRampToValueAtTime(0.001, t + duration);
      master.connect(ctx.destination);

      // Fundamental
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, t);
      osc1.connect(master);
      osc1.start(t);
      osc1.stop(t + duration + 0.1);

      // Sub-octave
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq / 2, t);
      g2.gain.setValueAtTime(0.3, t);
      osc2.connect(g2);
      g2.connect(master);
      osc2.start(t);
      osc2.stop(t + duration + 0.1);

      // Harmonic bite
      const osc3 = ctx.createOscillator();
      const g3 = ctx.createGain();
      osc3.type = "triangle";
      osc3.frequency.setValueAtTime(freq * 2, t);
      g3.gain.setValueAtTime(0.15, t);
      g3.gain.exponentialRampToValueAtTime(0.001, t + duration * 0.3);
      osc3.connect(g3);
      g3.connect(master);
      osc3.start(t);
      osc3.stop(t + duration + 0.1);
      break;
    }

    case "guitar": {
      // Guitar: multiple harmonics with pluck envelope
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, t);
      master.gain.linearRampToValueAtTime(vol * 0.35, t + 0.003);
      master.gain.exponentialRampToValueAtTime(vol * 0.15, t + 0.15);
      master.gain.exponentialRampToValueAtTime(0.001, t + duration * 0.8);
      master.connect(ctx.destination);

      [1, 2, 3, 4, 5, 6].forEach((h, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = i < 2 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq * h, t);
        const amp = [1, 0.6, 0.4, 0.2, 0.1, 0.05][i];
        g.gain.setValueAtTime(amp * 0.2, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + duration * (0.8 - i * 0.05));
        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + duration + 0.1);
      });
      break;
    }

    case "strings": {
      // Strings: slow attack, sustained, sine + slight vibrato
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, t);
      master.gain.linearRampToValueAtTime(vol * 0.3, t + 0.15);
      master.gain.setValueAtTime(vol * 0.3, t + duration * 0.7);
      master.gain.exponentialRampToValueAtTime(0.001, t + duration);
      master.connect(ctx.destination);

      [1, 2, 3].forEach((h, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq * h, t);

        // Vibrato
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(5 + Math.random(), t);
        lfoGain.gain.setValueAtTime(freq * h * 0.003, t);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(t);
        lfo.stop(t + duration + 0.1);

        g.gain.setValueAtTime([1, 0.5, 0.25][i] * 0.3, t);
        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + duration + 0.1);
      });
      break;
    }

    case "drums": {
      // Drums: note determines instrument type
      const master = ctx.createGain();
      master.gain.setValueAtTime(vol * 0.6, t);
      master.connect(ctx.destination);

      if (midi === 36 || midi === 35) {
        // Kick drum
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
        g.gain.setValueAtTime(1, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + 0.35);
      } else if (midi === 38 || midi === 40) {
        // Snare
        const noise = ctx.createBufferSource();
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        noise.buffer = buf;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.7, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.setValueAtTime(2000, t);
        noise.connect(hp);
        hp.connect(g);
        g.connect(master);
        noise.start(t);
        // Body
        const osc = ctx.createOscillator();
        const og = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
        og.gain.setValueAtTime(0.5, t);
        og.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.connect(og);
        og.connect(master);
        osc.start(t);
        osc.stop(t + 0.15);
      } else if (midi === 42 || midi === 44) {
        // Closed hi-hat
        const noise = ctx.createBufferSource();
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        noise.buffer = buf;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.setValueAtTime(8000, t);
        noise.connect(bp);
        bp.connect(g);
        g.connect(master);
        noise.start(t);
      } else {
        // Generic percussion
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.4, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + 0.2);
      }
      break;
    }
  }
}

// Instrument display info
export const INSTRUMENT_INFO: Record<InstrumentType, { name: string; nameFr: string; icon: string; color: string; clef: "treble" | "bass" | "both" | "percussion" }> = {
  piano: { name: "Piano", nameFr: "Piano", icon: "🎹", color: "#8B5CF6", clef: "both" },
  bass: { name: "Bass", nameFr: "Basse", icon: "🎸", color: "#10B981", clef: "bass" },
  guitar: { name: "Guitar", nameFr: "Guitare", icon: "🎸", color: "#F59E0B", clef: "treble" },
  strings: { name: "Strings", nameFr: "Cordes", icon: "🎻", color: "#EC4899", clef: "treble" },
  drums: { name: "Drums", nameFr: "Batterie", icon: "🥁", color: "#EF4444", clef: "percussion" },
};
