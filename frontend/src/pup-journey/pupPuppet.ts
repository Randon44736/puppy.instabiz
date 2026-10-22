// Authentic TeddyPups Puppet Controller & Gestures (Modules 89681, 8478, 49054)
import {
  PUPPET_W,
  PUPPET_R,
  POSES,
  PupPose,
  PupMotion,
  defaultMotion,
  lerpPose,
  solveKinematics,
  JOINTS,
} from './pupConstants';

const ATTR_MAP: [string, string, string][] = [
  ['root', 'transform', 'root'],
  ['shadow', 'transform', 'shadow'],
  ['shadow', 'opacity', 'shadowOpacity'],
  ['body', 'transform', 'body'],
  ['body', 'opacity', 'side'],
  ['bf', 'transform', 'bf'],
  ['bf', 'opacity', 'backLegs'],
  ['bn', 'transform', 'bn'],
  ['bn', 'opacity', 'backLegs'],
  ['ff', 'transform', 'ff'],
  ['fn', 'transform', 'fn'],
  ['tail', 'transform', 'tail'],
  ['haunch', 'transform', 'haunch'],
  ['haunch', 'opacity', 'haunchOpacity'],
  ['head', 'transform', 'head'],
  ['earL', 'transform', 'earL'],
  ['earR', 'transform', 'earR'],
  ['eyes', 'transform', 'eyes'],
  ['open', 'opacity', 'openEyes'],
  ['blink', 'transform', 'blink'],
  ['happy', 'opacity', 'happyEyes'],
  ['shut', 'opacity', 'shutEyes'],
  ['tongue', 'opacity', 'tongue'],
  ['mouth', 'opacity', 'mouth'],
  ['ledge', 'opacity', 'ledge'],
];

const expSmoothing = (dt: number, speed: number) => 1 - Math.exp(-dt / speed);
const clamp = (val: number, min = -1, max = 1) => Math.max(min, Math.min(max, val));

export class Puppet {
  svg: SVGSVGElement;
  els: Map<string, SVGElement>;
  written: Map<string, string>;
  m: PupMotion;
  pose: PupPose;
  target: PupPose;
  facing: number;
  facingTarget: number;
  strideTarget: number;
  wagTarget: number;
  gazeTarget: { x: number; y: number };
  tilt: number;
  tiltTarget: number;
  earV: number;
  nextBlink: number;
  blinkAt: number;
  woofUntil: number;
  bounce: number;
  bounceV: number;
  offset: number;
  offsetTarget: number;
  pet: number;
  petTarget: number;
  turn: number;
  lean: number;

  constructor(svg: SVGSVGElement, initialPose = 'sit', facing = 1) {
    this.svg = svg;
    this.els = new Map();
    this.written = new Map();
    this.m = { ...defaultMotion };
    this.strideTarget = 0;
    this.wagTarget = 0.35;
    this.gazeTarget = { x: 0, y: 0 };
    this.tilt = 0;
    this.tiltTarget = 0;
    this.earV = 0;
    this.nextBlink = 1.2;
    this.blinkAt = -1;
    this.woofUntil = 0;
    this.bounce = 0;
    this.bounceV = 0;
    this.offset = 0;
    this.offsetTarget = 0;
    this.pet = 0;
    this.petTarget = 0;
    this.turn = 0.07;
    this.lean = 0;

    svg.querySelectorAll<SVGElement>('[data-p]').forEach((el) => {
      if (el.dataset.p) this.els.set(el.dataset.p, el);
    });

    this.pose = { ...(POSES[initialPose] || POSES.sit) };
    this.target = this.pose;
    this.facing = facing;
    this.facingTarget = facing;
  }

  setPose(pose: string | PupPose) {
    this.target = typeof pose === 'string' ? (POSES[pose] || POSES.sit) : pose;
  }

  jump(pose: string, facing?: number) {
    this.pose = { ...(POSES[pose] || POSES.sit) };
    this.target = POSES[pose] || POSES.sit;
    if (facing !== undefined) {
      this.facing = this.facingTarget = facing;
    }
  }

  face(dir: number, turn = 0.07) {
    this.facingTarget = dir;
    this.turn = turn;
  }

  get facingDir() {
    return this.facingTarget;
  }

  stride(val: number) {
    this.strideTarget = clamp(val, 0, 1);
  }

  advance(val: number) {
    this.m.phase += (val / 46) * Math.PI;
  }

  walkedTo(val: number) {
    this.m.phase = (val / 46) * Math.PI;
  }

  wag(val: number) {
    this.wagTarget = clamp(val, 0, 1);
  }

  cock(val: number) {
    this.tiltTarget = val;
  }

  lookAt(target: { x: number; y: number } | null) {
    if (!target) {
      this.gazeTarget = { x: 0, y: 0 };
      return;
    }
    const rect = this.svg.getBoundingClientRect();
    const anchorX = this.facingTarget > 0 ? 212 : PUPPET_W - 212;
    const eyeScreenX = rect.left + (anchorX / PUPPET_W) * rect.width;
    const eyeScreenY = rect.top + (98 / PUPPET_R) * rect.height;
    const dx = target.x - eyeScreenX;
    const dy = target.y - eyeScreenY;
    const dist = Math.hypot(dx, dy) || 1;
    const strength = Math.min(1, dist / 160);
    this.gazeTarget = {
      x: (dx / dist) * strength * this.facingTarget,
      y: (dy / dist) * strength,
    };
  }

  woof(time: number) {
    this.woofUntil = time + 0.34;
    this.bounceV = -150;
    this.earV += 260;
  }

  jolt(mult = 1) {
    this.earV += 220 * mult;
  }

  hop(mult = 1) {
    this.bounceV = -230 * mult;
    this.earV += 200 * mult;
  }

  yawn(time: number, dur = 0.9) {
    this.woofUntil = time + dur;
  }

  dash(offset: number) {
    this.offsetTarget = offset;
  }

  petting(isPet: boolean) {
    this.petTarget = +isPet;
  }

  reset() {
    this.offsetTarget = 0;
    this.tiltTarget = 0;
    this.petTarget = 0;
  }

  tick(dt: number, time: number) {
    dt = Math.min(dt, 0.05);
    const m = this.m;
    m.time = time;

    this.pose = lerpPose(this.pose, this.target, expSmoothing(dt, 0.16));
    this.facing += (this.facingTarget - this.facing) * expSmoothing(dt, this.turn);
    m.stride += (this.strideTarget - m.stride) * expSmoothing(dt, 0.12);
    if (m.stride < 0.012 && this.strideTarget === 0) m.stride = 0;

    m.wag += (this.wagTarget - m.wag) * expSmoothing(dt, 0.4);
    m.gazeX += (this.gazeTarget.x - m.gazeX) * expSmoothing(dt, 0.07);
    m.gazeY += (this.gazeTarget.y - m.gazeY) * expSmoothing(dt, 0.07);

    this.tilt += (this.tiltTarget + 3 * m.gazeX - this.tilt) * expSmoothing(dt, 0.18);
    this.earV += (-150 * m.ear - 10 * this.earV) * dt;
    m.ear = clamp(m.ear + this.earV * dt, -28, 28);

    this.bounceV += (-260 * this.bounce - 16 * this.bounceV) * dt;
    this.bounce += this.bounceV * dt;

    const prevOffset = this.offset;
    this.offset += (this.offsetTarget - this.offset) * expSmoothing(dt, 0.2);
    if (Math.abs(this.offsetTarget - this.offset) < 0.05) {
      this.offset = this.offsetTarget;
    }

    const deltaOffset = Math.abs(this.offset - prevOffset);
    if (deltaOffset) this.advance(deltaOffset);
    const dashStride = dt > 0 ? Math.min(1, deltaOffset / dt / 180) : 0;

    this.pet += (this.petTarget - this.pet) * expSmoothing(dt, 0.15);

    if (time > this.nextBlink && this.pose.eyes > 0.6) {
      this.blinkAt = time;
      this.nextBlink = time + 2.2 + 3.8 * Math.random();
      if (Math.random() < 0.18) this.nextBlink = time + 0.32;
    }
    const blinkProgress = (time - this.blinkAt) / 0.15;
    m.blink = blinkProgress >= 0 && blinkProgress <= 1 ? Math.sin(blinkProgress * Math.PI) : 0;

    const fullPose: PupPose = {
      ...this.pose,
      headRot: this.pose.headRot + this.tilt,
      bodyRot: this.pose.bodyRot + this.lean,
      bodyY: this.pose.bodyY + this.bounce,
      headY: this.pose.headY + 1.15 * this.bounce,
      mouth: time < this.woofUntil ? 1 : this.pose.mouth,
      happy: Math.max(this.pose.happy, this.pet),
    };

    const f = solveKinematics(fullPose, dashStride > m.stride ? { ...m, stride: dashStride } : m);
    const safeFacing = Number.isFinite(this.facing) ? this.facing : (this.facingTarget || 1);
    const facingScale = Math.abs(safeFacing) < 0.05 ? 0.05 * Math.sign(safeFacing || 1) : safeFacing;
    const rootTransform = `translate(${this.offset.toFixed(1)} 0) translate(${PUPPET_W / 2} 0) scale(${facingScale.toFixed(3)} 1) translate(${-PUPPET_W / 2} 0)`;

    for (const [part, attr, key] of ATTR_MAP) {
      const el = this.els.get(part);
      if (!el) continue;
      const val = key === 'root' ? rootTransform : String((f as any)[key]);
      const cacheKey = `${part}:${attr}`;
      if (this.written.get(cacheKey) !== val) {
        el.setAttribute(attr, val);
        this.written.set(cacheKey, val);
      }
    }
  }
}

// Trick schedule definition
export type TrickSchedule = [number, (t: number) => void][];

export interface PupCueContext {
  d: Puppet;
  rest: PupPose;
  facing: number;
  say: (text: string, dur?: number) => void;
  hearts: () => void;
}

const flipFacing = (facing: number) => (facing === 1 ? -1 : 1);

export const PUP_TRICKS: Record<string, (ctx: PupCueContext, t: number) => TrickSchedule> = {
  woof: ({ d, say }, t) => [
    [t, (now) => { d.woof(now); say('woof!'); }],
    [t + 0.42, (now) => { d.woof(now); say('woof woof!'); }],
  ],
  spin: ({ d, rest, facing, say }, t) => [
    [t, () => { d.setPose('stand'); d.hop(0.5); }],
    [t + 0.14, () => d.face(flipFacing(facing))],
    [t + 0.38, () => d.face(facing)],
    [t + 0.62, () => d.face(flipFacing(facing))],
    [t + 0.86, () => { d.face(facing); say('wheee!'); }],
    [t + 1.3, () => d.setPose(rest)],
  ],
  beg: ({ d, rest, say }, t) => [
    [t, () => { d.setPose('beg'); d.wag(1); say('treat, please?', 1.7); }],
    [t + 1.9, () => { d.setPose(rest); d.wag(0.7); }],
  ],
  bow: ({ d, rest, say }, t) => [
    [t, () => { d.setPose('bow'); d.wag(1); say('play with me!'); }],
    [t + 0.55, () => d.hop(0.45)],
    [t + 1.7, () => { d.setPose(rest); d.wag(0.7); }],
  ],
  hop: ({ d, rest, say }, t) => [
    [t, () => { d.setPose('hop'); d.hop(1.1); say('boing!'); }],
    [t + 0.36, () => d.setPose(rest)],
    [t + 0.62, () => { d.setPose('hop'); d.hop(0.8); }],
    [t + 0.98, () => d.setPose(rest)],
  ],
  love: ({ d, rest, say, hearts }, t) => [
    [t, () => { d.setPose({ ...rest, happy: 1, tongue: 1 }); d.wag(1); hearts(); say('I like you!', 1.5); }],
    [t + 1.9, () => { d.setPose(rest); d.wag(0.7); }],
  ],
  tilt: ({ d, say }, t) => [
    [t, () => { d.cock(-14); say('hm?'); }],
    [t + 0.8, () => d.cock(12)],
    [t + 1.6, () => d.cock(0)],
  ],
  sneeze: ({ d, say }, t) => [
    [t, () => d.cock(-8)],
    [t + 0.32, (now) => { d.cock(10); d.jolt(1.4); d.hop(0.35); d.yawn(now, 0.22); say('achoo!'); }],
    [t + 0.8, () => d.cock(0)],
  ],
  zoomies: ({ d, rest, facing, say }, t) => [
    [t, () => { d.setPose('walk'); d.wag(1); say('zoomies!', 2); }],
    [t + 0.05, () => { d.face(1); d.dash(70); }],
    [t + 0.5, () => { d.face(-1); d.dash(-70); }],
    [t + 0.98, () => { d.face(1); d.dash(50); }],
    [t + 1.4, () => { d.face(-1); d.dash(-30); }],
    [t + 1.78, () => { d.face(1); d.dash(0); }],
    [t + 2.25, () => { d.face(facing); d.setPose(rest); d.wag(0.7); }],
  ],
  peekaboo: ({ d, say }, t) => [
    [t, () => d.setPose({ ...POSES.peek, headY: 120 })],
    [t + 0.55, () => { d.setPose('peek'); d.jolt(1.2); say('peekaboo!'); }],
  ],
  wake: ({ d, rest, say }, t) => [
    [t, (now) => { d.setPose('settle'); d.yawn(now, 0.9); say('*yaaawn*'); }],
    [t + 1.25, () => { d.setPose({ ...POSES.settle, happy: 1 }); d.wag(0.8); say('five more minutes…', 1.6); }],
    [t + 3.1, () => { d.setPose(rest); d.wag(0); say('zzz', 2); }],
  ],
};

let trickPool: string[] = [];
const ALL_TRICKS = ['woof', 'spin', 'beg', 'bow', 'hop', 'love', 'tilt', 'sneeze'];

export function pickTrick(exclude: string | null, clickCount: number): string {
  if (clickCount >= 4) return 'zoomies';
  if (!trickPool.length) {
    trickPool = ALL_TRICKS.filter((t) => t !== exclude).sort(() => Math.random() - 0.5);
  }
  return trickPool.pop() || 'woof';
}

export function spawnHearts(container: HTMLElement, x: number, y: number) {
  for (let r = 0; r < 5; r++) {
    const s = document.createElement('span');
    s.className = 'pup-heart';
    s.textContent = '♥';
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    container.append(s);

    const i = (Math.random() - 0.5) * 90;
    const n = -70 - 60 * Math.random();

    s.animate(
      [
        { transform: 'translate(-50%, 0) scale(0.4)', opacity: 0 },
        { opacity: 1, offset: 0.2 },
        { transform: `translate(calc(-50% + ${i.toFixed(0)}px), ${n.toFixed(0)}px) scale(1.1)`, opacity: 0 },
      ],
      {
        duration: 1150 + 110 * r,
        delay: 80 * r,
        easing: 'cubic-bezier(.2,.7,.3,1)',
        fill: 'backwards',
      }
    ).finished.then(
      () => s.remove(),
      () => s.remove()
    );
  }
}

function pawEllipse(e: number, t: number, a: number, r: number, s: number) {
  const i = (s * Math.PI) / 180;
  const n = Math.cos(i);
  const o = Math.sin(i);
  const l = (a: number, r: number) => `${(e + a * n - r * o).toFixed(2)} ${(t + a * o + r * n).toFixed(2)}`;
  return `M${l(a, 0)}C${l(a, 0.5523 * r)} ${l(0.5523 * a, r)} ${l(0, r)}C${l(-(0.5523 * a), r)} ${l(-a, 0.5523 * r)} ${l(-a, 0)}C${l(-a, -(0.5523 * r))} ${l(-(0.5523 * a), -r)} ${l(0, -r)}C${l(0.5523 * a, -r)} ${l(a, -(0.5523 * r))} ${l(a, 0)}Z`;
}

export const PAW_PRINT_PATH =
  'M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5z' +
  pawEllipse(14.6, 29.2, 5.3, 6.9, -28) +
  pawEllipse(24.2, 16.6, 5.5, 7.3, -10) +
  pawEllipse(39.8, 16.6, 5.5, 7.3, 10) +
  pawEllipse(49.4, 29.2, 5.3, 6.9, 28);
