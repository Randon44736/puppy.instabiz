// Authentic TeddyPups Anatomy & Kinematics Engine (Module 1063)
export const COLOR_BLUSH = '#f9b9a6';
export const COLOR_COLLAR = '#a24a1a';
export const COLOR_BODY = '#f2be6b';
export const COLOR_LIGHT = '#fbe3b4';
export const COLOR_DARK = '#e4a352';
export const COLOR_STROKE = '#2a170e';

export const EYE_Y = 98;
export const GROUND_Y = 228;
export const PUPPET_W = 300;
export const PUPPET_R = 240;

function t(e: number, a: number, r: number, s: number, i: number, n: number, o = -Math.PI / 2, l = 0) {
  const d = (l * Math.PI) / 180;
  const c = (t: number, i: number) => {
    const n = Math.cos(t) * (r + i);
    const o = Math.sin(t) * (s + (s / r) * i);
    return `${(e + n * Math.cos(d) - o * Math.sin(d)).toFixed(1)} ${(a + n * Math.sin(d) + o * Math.cos(d)).toFixed(1)}`;
  };
  let h = '';
  for (let e = 0; e < i; e++) {
    const t = o + (e / i) * Math.PI * 2;
    const a = o + ((e + 1) / i) * Math.PI * 2;
    const r = (t + a) / 2;
    h += `${0 === e ? `M${c(t, 0)}` : ''}Q${c(r, 2.1 * n)} ${c(a, 0)}`;
  }
  return `${h}Z`;
}

export const anchorBody = [196, 206] as const;
export const anchorHead = [212, 100] as const;
export const anchorShoulderN = [186, 194] as const;
export const anchorShoulderF = [168, 192] as const;
export const anchorHipN = [110, 194] as const;
export const anchorHipF = [94, 192] as const;
export const anchorTail = [84, 150] as const;
export const anchorEarL = [174, 82] as const;
export const anchorEarR = [250, 82] as const;

export const JOINTS = {
  shoulderN: anchorShoulderN,
  shoulderF: anchorShoulderF,
  hipN: anchorHipN,
  hipF: anchorHipF,
  tailBase: anchorTail,
};

export const PATHS = {
  body: t(140, 170, 64, 36, 15, 3.4, 0.95 * Math.PI),
  chest: t(192, 166, 30, 32, 9, 3.2, 0.6 * Math.PI),
  tail: t(70, 126, 17, 16, 9, 3.2),
  tailStem: 'M86 152 C80 146 76 140 74 136',
  haunch: t(110, 204, 30, 24, 10, 3.2, Math.PI),
  haunchPaw: 'M112 214 C126 212 142 214 146 221 C148 226 144 229 136 229 L116 229 C108 229 104 224 106 219 Z',
  head: t(212, 100, 51, 46, 16, 3.6),
  topknot: t(212, 52, 17, 12, 8, 2.9, Math.PI),
  earL: t(170, 112, 19, 34, 10, 3.2, -Math.PI / 2, 12),
  earR: t(254, 112, 19, 34, 10, 3.2, -Math.PI / 2, -12),
  muzzle: 'M188 120 C188 106 200 100 212 100 C224 100 236 106 236 120 C236 133 225 140 212 140 C199 140 188 133 188 120 Z',
  nose: 'M204.5 111.5 Q212 107.2 219.5 111.5 Q218.2 118.4 212 120 Q205.8 118.4 204.5 111.5 Z',
  mouth: 'M212 120 V124.5 M212 124.5 Q207.2 129.6 202.8 125.2 M212 124.5 Q216.8 129.6 221.2 125.2',
  mouthOpen: 'M203 126 Q212 122 221 126 Q219 138 212 139 Q205 138 203 126 Z',
  tongue: 'M207.6 127.4 Q212 136.6 216.4 127.4 Z',
  collar: 'M178 146 Q212 162 246 146 L246 154 Q212 170 178 154 Z',
  tag: 'M212 160 C212 156 206 155 206 159.4 C206 163 212 166.6 212 168.4 C212 166.6 218 163 218 159.4 C218 155 212 156 212 160 Z',
  ledgePaws: 'M175 159 C175 148 181 142 190 142 C199 142 205 148 205 159 Z M219 159 C219 148 225 142 234 142 C243 142 249 148 249 159 Z',
  ledgeToes: 'M186 153 v-4.5 M194 153 v-4.5 M230 153 v-4.5 M238 153 v-4.5',
  shadow: { cx: 150, cy: 230, rx: 92, ry: 7 },
};

function f(e: number, t: number) {
  const a = e / 2;
  return `M${-a} -14 C${-a} 4 -12 ${t - 18} -12 ${t - 9} C-12 ${t - 2} -7 ${t} 0 ${t} C9 ${t} 13 ${t - 3} 13 ${t - 9} C13 ${t - 18} ${a} 4 ${a} -14`;
}

export const LEGS = {
  front: f(24, 228 - anchorShoulderN[1]),
  frontFar: f(22, 228 - anchorShoulderF[1]),
  back: f(30, 228 - anchorHipN[1]),
  backFar: f(28, 228 - anchorHipF[1]),
};

export interface PupPose {
  bodyRot: number;
  bodyX: number;
  bodyY: number;
  stretch: number;
  headX: number;
  headY: number;
  headRot: number;
  earL: number;
  earR: number;
  tail: number;
  fn: number;
  ff: number;
  bn: number;
  bf: number;
  sit: number;
  eyes: number;
  happy: number;
  tongue: number;
  mouth: number;
  front: number;
}

const basePose: PupPose = {
  bodyRot: 0,
  bodyX: 0,
  bodyY: 0,
  stretch: 1,
  headX: 0,
  headY: 0,
  headRot: 0,
  earL: 0,
  earR: 0,
  tail: 0,
  fn: 0,
  ff: 0,
  bn: 0,
  bf: 0,
  sit: 0,
  eyes: 1,
  happy: 0,
  tongue: 0,
  mouth: 0,
  front: 0,
};

export const POSES: Record<string, PupPose> = {
  stand: basePose,
  walk: { ...basePose, tail: -6, tongue: 1 },
  sit: { ...basePose, bodyRot: -24, bodyY: -2, headX: -10, headY: -6, tail: 34, sit: 1, tongue: 1 },
  peek: { ...basePose, headY: 4, earL: -6, earR: 6, tail: -20, front: 1, tongue: 1 },
  snug: { ...basePose, headY: 9, headRot: 4, earL: 3, earR: -3, tail: -20, front: 1, tongue: 0 },
  lie: { ...basePose, bodyRot: -5, bodyY: 22, headX: 12, headY: 40, headRot: 3, fn: -84, ff: -80, sit: 1, tail: 58, tongue: 0 },
  sleep: { ...basePose, bodyRot: -5, bodyY: 22, headX: 14, headY: 44, headRot: -8, fn: -84, ff: -80, sit: 1, tail: 64, eyes: 0, earL: 4, earR: -4 },
  settle: { ...basePose, bodyRot: -5, bodyY: 22, headX: 10, headY: 16, fn: -84, ff: -80, sit: 1, tail: 40, tongue: 1 },
  hop: { ...basePose, bodyRot: -9, stretch: 1.06, headY: -6, fn: -42, ff: -32, bn: 40, bf: 30, earL: -26, earR: 26, tail: -24, tongue: 1 },
  sniff: { ...basePose, bodyRot: 7, headX: 16, headY: 32, headRot: 9, tail: -14, fn: 6, ff: 4 },
  bow: { ...basePose, bodyRot: 15, bodyY: 2, headX: 14, headY: 30, fn: -58, ff: -52, tail: -32, happy: 1, tongue: 1 },
  beg: { ...basePose, bodyRot: -36, bodyY: -6, headX: -18, headY: -18, sit: 1, fn: -70, ff: -64, tail: 30, happy: 1, tongue: 1 },
};

export const POSE_KEYS = Object.keys(basePose) as (keyof PupPose)[];

export interface PupMotion {
  phase: number;
  stride: number;
  time: number;
  wag: number;
  gazeX: number;
  gazeY: number;
  blink: number;
  ear: number;
}

export const defaultMotion: PupMotion = {
  phase: 0,
  stride: 0,
  time: 0,
  wag: 0,
  gazeX: 0,
  gazeY: 0,
  blink: 0,
  ear: 0,
};

export const round2 = (e: number) => Math.round(100 * e) / 100;
export const rotStr = (e: number, [t, a]: readonly [number, number]) => `rotate(${round2(e)} ${t} ${a})`;

export const legPawPath = (len: number) => `M-3.5 ${len - 7} v5 M4.5 ${len - 7} v5`;

export function lerpPose(e: PupPose, t: PupPose, a: number): PupPose {
  const r = { ...e };
  for (const s of POSE_KEYS) {
    r[s] = e[s] + (t[s] - e[s]) * a;
  }
  return r;
}

export function solveKinematics(e: PupPose, t: PupMotion = defaultMotion) {
  const h = Math.sin(t.phase);
  const f = Math.sin(t.phase + Math.PI);
  const u = 20 + 10 * t.stride;
  const p = (1 - Math.cos(2 * t.phase)) / 2;
  const g = +(t.stride > 0.01);
  const m = Math.sin(2.4 * t.time) * (1 - g);
  const w = e.bodyY - p * (2.5 + 4 * t.stride) * g + 0.6 * m;
  const v = e.bodyRot + 1.6 * Math.sin(t.phase) * g;
  const j = -e.bodyRot;
  const M = 5 + 17 * t.wag;
  const k = 1.2 + 2.6 * t.wag;
  const tailRot = e.tail + Math.sin(t.time * k * Math.PI * 2) * M;
  const headBob = -((1 - Math.cos(2 * t.phase - 0.7)) / 2) * (2 + 3 * t.stride) * g + 0.9 * m;

  return {
    body: `translate(${round2(e.bodyX)} ${round2(w)}) ${rotStr(v, anchorBody)} translate(${anchorBody[0]} 0) scale(${round2(e.stretch)} 1) translate(${-anchorBody[0]} 0)`,
    fn: `translate(${anchorShoulderN[0]} ${anchorShoulderN[1]}) rotate(${round2(e.fn + j + h * u * g)})`,
    ff: `translate(${anchorShoulderF[0]} ${anchorShoulderF[1]}) rotate(${round2(e.ff + j + f * u * g)})`,
    bn: `translate(${anchorHipN[0]} ${anchorHipN[1]}) rotate(${round2(e.bn + f * u * g)})`,
    bf: `translate(${anchorHipF[0]} ${anchorHipF[1]}) rotate(${round2(e.bf + h * u * g)})`,
    tail: rotStr(tailRot, anchorTail),
    haunch: `translate(0 ${round2(-0.06 * e.bodyRot)})`,
    head: `translate(${round2(e.headX)} ${round2(e.headY + headBob)}) ${rotStr(e.headRot + 1.4 * Math.sin(t.phase) * g, anchorHead)}`,
    earL: rotStr(e.earL + t.ear + 4 * Math.sin(2 * t.phase) * g, anchorEarL),
    earR: rotStr(e.earR - t.ear - 4 * Math.sin(2 * t.phase) * g, anchorEarR),
    eyes: `translate(${round2(3.4 * t.gazeX)} ${round2(2.6 * t.gazeY)})`,
    blink: `translate(0 ${round2(98 * t.blink * 0.92)}) scale(1 ${round2(1 - 0.92 * t.blink)})`,
    openEyes: round2(Math.max(0, e.eyes - e.happy)),
    happyEyes: round2(Math.min(e.happy, e.eyes)),
    shutEyes: round2(1 - e.eyes),
    tongue: round2(e.tongue * (1 - e.mouth)),
    mouth: round2(e.mouth),
    backLegs: round2(1 - e.sit),
    haunchOpacity: round2(e.sit * (1 - e.front)),
    side: round2(1 - e.front),
    ledge: round2(e.front),
    shadow: `translate(${round2(0.6 * e.bodyX)} 0) scale(${round2(1 - 0.05 * p * g)} 1)`,
    shadowOpacity: round2(0.12 * (1 - e.front)),
  };
}
