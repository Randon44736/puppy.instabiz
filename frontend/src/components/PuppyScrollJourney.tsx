// Authentic TeddyPups Scroll Journey Engine (Module 91360)
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { PupBuddySvg } from '../pup-journey/PupBuddySvg';
import { Puppet, PUP_TRICKS, pickTrick, spawnHearts, PAW_PRINT_PATH } from '../pup-journey/pupPuppet';
import { POSES, PUPPET_W } from '../pup-journey/pupConstants';

const PUP_ANCHOR = { x: 150, y: 228 };
const DEFAULT_BOX = [48, 30, 288, 236];

const clamp01 = (e: number) => Math.min(1, Math.max(0, e));
const smoothstep = (e: number) => e * e * (3 - 2 * e);
const smoothRange = (min: number, max: number, val: number) =>
  max === min ? +(val >= max) : smoothstep(clamp01((val - min) / (max - min)));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface StopTrack {
  kind: 'page' | 'screen' | 'pin';
  top: number;
  from?: number;
  to?: number;
}

interface PupStop {
  x: number;
  track: StopTrack;
  s: number;
  behind: boolean;
  sink: number;
  box: number[];
}

interface PupMeta {
  scene: HTMLElement | null;
  pose: string;
  facing: number;
  act: string;
  looks: HTMLElement[];
  track: HTMLElement | null;
}

interface JourneyData {
  lane: boolean;
  stops: PupStop[];
  meta: PupMeta[];
  holds: [number, number][];
  blend: number;
  mainTop: number;
}

function getAnchor(stop: PupStop, scrollY: number) {
  const track = stop.track;
  let topVal: number;
  if (track.kind === 'page') {
    topVal = track.top - scrollY;
  } else if (track.kind === 'screen') {
    topVal = track.top;
  } else {
    const from = track.from ?? 0;
    const to = track.to ?? 0;
    if (scrollY < from) {
      topVal = track.top - (scrollY - from);
    } else if (scrollY > to) {
      topVal = track.top - (scrollY - to);
    } else {
      topVal = track.top;
    }
  }
  return {
    x: stop.x + PUP_ANCHOR.x * stop.s,
    y: topVal + PUP_ANCHOR.y * stop.s,
  };
}

function findSegment(holds: [number, number][], scrollY: number) {
  if (!holds.length || scrollY <= holds[0][1]) return { k: 0, t: 0 };
  for (let i = 0; i < holds.length - 1; i++) {
    const start = holds[i][1];
    const end = holds[i + 1][0];
    if (scrollY < end) {
      return { k: i, t: clamp01((scrollY - start) / Math.max(1, end - start)) };
    }
    if (scrollY <= holds[i + 1][1]) {
      return { k: i + 1, t: 0 };
    }
  }
  return { k: holds.length - 1, t: 0 };
}

const softMax = (e: number, t: number, a = 8) => {
  const s = (e - t) / a;
  return s > 20 ? e : t + a * Math.log1p(Math.exp(s));
};
const softMin = (e: number, t: number, a = 8) => -softMax(-e, -t, a);

function clampBox(
  x: number,
  y: number,
  scale: number,
  box: number[],
  bounds: { left: number; top: number; right: number; bottom: number },
  margin = 8
) {
  const r = (PUP_ANCHOR.x - box[0]) * scale;
  const i = (box[2] - PUP_ANCHOR.x) * scale;
  const o = (PUP_ANCHOR.y - box[1]) * scale;
  const c = (box[3] - PUP_ANCHOR.y) * scale;
  return {
    x:
      bounds.right - bounds.left > r + i
        ? softMin(softMax(x, bounds.left + r, margin), bounds.right - i, margin)
        : (bounds.left + bounds.right) / 2 - (i - r) / 2,
    y:
      bounds.bottom - bounds.top > o + c
        ? softMin(softMax(y, bounds.top + o, margin), bounds.bottom - c, margin)
        : bounds.bottom - c,
  };
}

const lerpBox = (a: number[], b: number[], t: number) => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
  lerp(a[3], b[3], t),
];

interface Point {
  x: number;
  y: number;
}

const bezierPoint = (p0: Point, c1: Point, c2: Point, p1: Point, t: number) => {
  const l = 1 - t;
  const r = l * l * l;
  const i = 3 * l * l * t;
  const o = 3 * l * t * t;
  const d = t * t * t;
  return {
    x: r * p0.x + i * c1.x + o * c2.x + d * p1.x,
    y: r * p0.y + i * c1.y + o * c2.y + d * p1.y,
  };
};

const POSE_BOXES: Record<string, number[]> = {
  sit: [50, 26, 284, 234],
  peek: [148, 34, 280, 163],
  snug: [148, 40, 280, 163],
  bow: [58, 56, 292, 236],
};
const getBox = (pose: string) => POSE_BOXES[pose] ?? DEFAULT_BOX;
const SINK_OFFSET = PUP_ANCHOR.y - 159;

const setDataset = (el: HTMLElement, key: string, val: string) => {
  if (el.dataset[key] !== val) el.dataset[key] = val;
};

function calculateStops(probe: HTMLElement): JourneyData {
  const isMobile = matchMedia('(max-width: 767px), (pointer: coarse) and (max-height: 519px)').matches;
  const clientWidth = document.documentElement.clientWidth;
  const probeHeight = probe.getBoundingClientRect().height || window.innerHeight;
  const headerHeight = document.getElementById('site-header')?.offsetHeight ?? 76;
  const whatsappBar = document.querySelector('[data-whatsapp-bar]');
  const whatsappHeight = whatsappBar?.getClientRects().length ? whatsappBar.getBoundingClientRect().height : 0;
  const safeBounds = {
    left: 10,
    top: headerHeight + 10,
    right: clientWidth - 10,
    bottom: probeHeight - 10 - whatsappHeight,
  };

  const mainEl = document.getElementById('main');
  const stops: PupStop[] = [];
  const meta: PupMeta[] = [];
  const holdRanges: [number, number][] = [];

  const addStop = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const pose = el.dataset.pose || 'sit';
    const act = el.dataset.act ?? '';
    const rawScale = rect.width / 300;
    const scale = act === 'basket' || isMobile ? rawScale : 1.12 * rawScale;
    const anchor = pose === 'peek' ? { x: PUP_ANCHOR.x, y: 159 } : PUP_ANCHOR;

    const computeTrack = (): StopTrack => {
      let stickyParent: HTMLElement | null = null;
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        if (getComputedStyle(p).position === 'sticky') {
          stickyParent = p;
          break;
        }
      }
      // Pinned Meet section fallback if getComputedStyle position hasn't resolved yet
      if (!stickyParent && (act === 'treadmill' || el.closest('.tp-meet[data-pinned]'))) {
        const stage = el.closest<HTMLElement>('.tp-meet__stage');
        if (stage && !isMobile) {
          stickyParent = stage;
        }
      }
      if (!stickyParent) {
        return { kind: 'page', top: rect.top + window.scrollY };
      }
      const stickyTop = parseFloat(getComputedStyle(stickyParent).top) || 0;
      const offsetInSticky = rect.top - stickyParent.getBoundingClientRect().top;
      const origPos = stickyParent.style.position;
      stickyParent.style.position = 'relative';
      const pRect = stickyParent.getBoundingClientRect();
      const parentContainer = stickyParent.parentElement!;
      const parentBottom =
        parentContainer.getBoundingClientRect().bottom - (parseFloat(getComputedStyle(parentContainer).paddingBottom) || 0);
      stickyParent.style.position = origPos;
      const from = pRect.top + window.scrollY - stickyTop;
      const to = parentBottom + window.scrollY - pRect.height - stickyTop;
      return to <= from
        ? { kind: 'page', top: pRect.top + window.scrollY + offsetInSticky }
        : { kind: 'pin', top: stickyTop + offsetInSticky, from, to };
    };

    const track = computeTrack();
    if (track.kind !== 'screen') {
      track.top += anchor.y * (rawScale - scale);
    }

    const stopObj: PupStop = {
      x: rect.left + anchor.x * (rawScale - scale),
      track,
      s: scale,
      behind: el.dataset.behind === 'true',
      sink: 0,
      box: getBox(pose),
    };

    const scene = el.closest<HTMLElement>('[data-pup-scene]');
    stops.push(stopObj);
    meta.push({
      scene,
      pose,
      facing: el.dataset.facing === 'left' ? -1 : 1,
      act,
      looks: scene ? Array.from(scene.querySelectorAll<HTMLElement>('[data-pup-look]')) : [],
      track: act === 'treadmill' ? scene?.querySelector<HTMLElement>('[data-treadmill]') ?? null : null,
    });

    const computeHold = (): [number, number] => {
      if (stopObj.track.kind === 'pin') {
        return [stopObj.track.from!, stopObj.track.to!];
      }
      const topY = stopObj.track.top;
      const boxTop = topY + stopObj.box[1] * stopObj.s;
      const boxBottom = topY + stopObj.box[3] * stopObj.s;
      const boxCenter = (boxTop + boxBottom) / 2;
      const boundsH = safeBounds.bottom - safeBounds.top;
      const ratio = isMobile ? [0.6, 0.86] : [0.42, 0.78];
      let o = boxCenter - (safeBounds.top + ratio[1] * boundsH);
      let d = boxCenter - (safeBounds.top + ratio[0] * boundsH);
      o = Math.max(o, boxBottom - safeBounds.bottom);
      d = Math.min(d, boxTop - safeBounds.top);
      if (o > d) {
        o = d = boxCenter - (safeBounds.top + boundsH / 2);
      }
      return [o, d];
    };

    let hold = computeHold();
    if (!isMobile && scene && stopObj.track.kind === 'page' && act !== 'basket' && act !== 'peekaboo') {
      const boundsH = safeBounds.bottom - safeBounds.top;
      const sceneTop = scene.getBoundingClientRect().top + window.scrollY - safeBounds.top + 0.08 * boundsH;
      const stopLimit = stopObj.track.top + stopObj.box[3] * stopObj.s - safeBounds.bottom;
      if (hold[1] > sceneTop) {
        const s = Math.max(sceneTop, stopLimit + 0.12 * boundsH);
        hold = [Math.max(stopLimit, s - Math.max(hold[1] - hold[0], 0.2 * boundsH)), s];
      }
    }
    holdRanges.push(hold);
  };

  const rawStops = Array.from(document.querySelectorAll<HTMLElement>('[data-pup-stop]')).filter(
    (e) => e.getClientRects().length > 0
  );

  if (isMobile) {
    const laneStops = rawStops.filter((e) => e.dataset.lane === 'true');
    const firstStop = laneStops[0];
    const lastStop = laneStops.length > 1 ? laneStops[laneStops.length - 1] : undefined;
    if (firstStop) addStop(firstStop);

    const firstScene = meta[0]?.scene ?? null;
    const otherScenes = Array.from(document.querySelectorAll<HTMLElement>('#main [data-pup-scene]')).filter(
      (e) => e !== firstScene && e.getClientRects().length > 0
    );
    const laneScale = Math.min(0.62, Math.max(0.5, clientWidth / 650));
    const peekBox = getBox('peek');

    otherScenes.forEach((scene, idx) => {
      const isEven = idx % 2 === 0;
      const posX = isEven ? safeBounds.left + 2 - peekBox[0] * laneScale : safeBounds.right - 2 - peekBox[2] * laneScale;
      stops.push({
        x: posX,
        track: { kind: 'screen', top: 0 },
        s: laneScale,
        behind: false,
        sink: SINK_OFFSET,
        box: peekBox,
      });
      meta.push({
        scene,
        pose: 'peek',
        facing: isEven ? 1 : -1,
        act: 'lane',
        looks: [],
        track: null,
      });
      const sRect = scene.getBoundingClientRect();
      const topHold = sRect.top + window.scrollY - 0.42 * probeHeight;
      const bottomHold = sRect.bottom + window.scrollY - 0.58 * probeHeight;
      holdRanges.push(topHold <= bottomHold ? [topHold, bottomHold] : [(topHold + bottomHold) / 2, (topHold + bottomHold) / 2]);
    });
    if (lastStop) addStop(lastStop);
  } else {
    rawStops.forEach(addStop);
  }

  const scrollLimit = document.documentElement.scrollHeight - window.innerHeight;

  // Process holds
  const distArr = stops.slice(1).map((s, idx) => {
    const prev = stops[idx];
    const screenH = (0.78 - 0.42) * probeHeight;
    const minTravel = (isMobile ? 0.32 : 0.5) * probeHeight;
    return Math.min(
      1.4 * probeHeight,
      Math.max(
        minTravel,
        1.15 * Math.hypot(Math.abs(s.x + PUP_ANCHOR.x * s.s - (prev.x + PUP_ANCHOR.x * prev.s)), screenH)
      )
    );
  });

  const normalizedHolds: [number, number][] = holdRanges.map((h) =>
    h[0] <= h[1] ? [h[0], h[1]] : [(h[0] + h[1]) / 2, (h[0] + h[1]) / 2]
  );
  if (normalizedHolds.length) {
    normalizedHolds[0][0] = -Infinity;
    const last = normalizedHolds[normalizedHolds.length - 1];
    last[1] = Infinity;
    last[0] = Math.min(last[0], scrollLimit - 1);

    for (let i = 0; i < normalizedHolds.length - 1; i++) {
      const cur = normalizedHolds[i];
      const next = normalizedHolds[i + 1];
      const isPinStop = stops[i].track.kind === 'pin';

      if (isPinStop) {
        // Pinned stop (Meet treadmill) must hold continuously until track.to
        const pinTo = stops[i].track.to ?? cur[1];
        cur[1] = Math.max(cur[1], pinTo);
        const desiredGap = distArr[i] ?? (0.5 * probeHeight);
        next[0] = Math.max(next[0], cur[1] + desiredGap);
        if (next[1] < next[0]) next[1] = next[0];
      } else {
        if (next[0] < cur[1]) {
          const mid = (cur[1] + next[0]) / 2;
          cur[1] = Math.max(cur[0], mid);
          next[0] = Math.min(next[1], mid);
          if (next[0] < cur[1]) next[0] = cur[1];
        }
        let gap = distArr[i] - (next[0] - cur[1]);
        if (gap > 0) {
          const dCur = Math.min(gap / 2, cur[1] - cur[0]);
          const dNext = Math.min(gap / 2, next[1] - next[0]);
          cur[1] -= dCur;
          next[0] += dNext;
          gap -= dCur + dNext;
          const extra = Math.min(gap, next[1] - next[0]);
          next[0] += extra;
          gap -= extra;
          if (gap > 0) cur[1] -= Math.min(gap, cur[1] - cur[0]);
        }
      }
    }
    const lastIdx = normalizedHolds.length - 1;
    const maxLastStart = Math.max(0, scrollLimit - Math.max(80, 0.25 * probeHeight));
    if (normalizedHolds[lastIdx][0] > maxLastStart) {
      normalizedHolds[lastIdx][0] = maxLastStart;
      for (let i = lastIdx - 1; i >= 0; i--) {
        const gap = distArr[i] ?? (0.35 * probeHeight);
        if (normalizedHolds[i][1] > normalizedHolds[i + 1][0] - gap) {
          normalizedHolds[i][1] = Math.max(normalizedHolds[i][0], normalizedHolds[i + 1][0] - gap);
        }
      }
    }
    for (const h of normalizedHolds) {
      if (h[1] < h[0]) h[1] = h[0];
    }
  }

  return {
    lane: isMobile,
    stops,
    meta,
    holds: normalizedHolds,
    blend: 0.12 * probeHeight,
    mainTop: mainEl ? mainEl.getBoundingClientRect().top + window.scrollY : 0,
  };
}

function evaluateJourney(journey: JourneyData, scrollY: number) {
  const isMobile = journey.lane;
  const stops = journey.stops;
  const holds = journey.holds;
  const clientWidth = document.documentElement.clientWidth;
  const headerHeight = (document.getElementById('site-header')?.offsetHeight ?? 76) + 10;
  const whatsappBar = document.querySelector('[data-whatsapp-bar]');
  const whatsappTop = whatsappBar?.getClientRects().length ? whatsappBar.getBoundingClientRect().top : window.innerHeight;

  const safe = isMobile
    ? { left: 10, top: headerHeight, right: clientWidth - 10, bottom: window.innerHeight - 6 + 40 }
    : { left: 10, top: headerHeight, right: clientWidth - 10, bottom: Math.min(window.innerHeight, whatsappTop) - 10 };

  const { k, t } = findSegment(holds, scrollY);

  if (t <= 0 || k >= stops.length - 1) {
    const curStop = stops[k];
    const anc = getAnchor(curStop, scrollY);
    const isBasketStop = journey.meta[k]?.act === 'basket';
    const clamped = isBasketStop ? { x: anc.x, y: anc.y } : clampBox(anc.x, anc.y, curStop.s, curStop.box, safe);
    return {
      x: clamped.x,
      y: clamped.y,
      s: curStop.s,
      front: !curStop.behind,
      airborne: false,
      k,
      t: 0,
      walked: 0,
    };
  }

  const s0 = stops[k];
  const s1 = stops[k + 1];
  const hold0End = holds[k][1];
  const hold1Start = holds[k + 1][0];
  const travelRange = Math.max(1, hold1Start - hold0End);
  const prog = clamp01((scrollY - hold0End) / travelRange);

  const pStart = getAnchor(s0, hold0End);
  const pEnd = getAnchor(s1, hold1Start);

  // Tangents for natural dog movement
  const dx = pEnd.x - pStart.x;
  const boundsW = safe.right - safe.left;
  const arcLen = Math.max(0.45 * Math.abs(dx), 0);
  const dirX = dx >= 0 ? 1 : -1;
  let c1: Point = { x: pStart.x + dirX * arcLen, y: pStart.y };
  let c2: Point = { x: pEnd.x - dirX * arcLen, y: pEnd.y };
  const minDeviation = 0.14 * boundsW;

  if (Math.abs(dx) < minDeviation) {
    const sideDir = (pStart.x + pEnd.x) / 2 < (safe.left + safe.right) / 2 ? 1 : -1;
    const curveOffset = sideDir * (minDeviation - Math.abs(dx)) * 0.9;
    c1 = { x: c1.x + curveOffset, y: lerp(pStart.y, pEnd.y, 0.2) };
    c2 = { x: c2.x + curveOffset, y: lerp(pStart.y, pEnd.y, 0.8) };
  }

  const clampP = (pt: Point) => ({
    x: Math.min(safe.right, Math.max(safe.left, pt.x)),
    y: Math.min(safe.bottom, Math.max(safe.top, pt.y)),
  });

  const curve = {
    p0: { x: pStart.x, y: pStart.y - s0.sink * s0.s },
    c1: clampP(c1),
    c2: clampP(c2),
    p1: { x: pEnd.x, y: pEnd.y - s1.sink * s1.s },
  };

  // Quintic easing for bezier
  const easeT = prog * prog * prog * (prog * (6 * prog - 15) + 10);
  const bezierPt = bezierPoint(curve.p0, curve.c1, curve.c2, curve.p1, easeT);
  const curScale = lerp(s0.s, s1.s, smoothstep(clamp01(prog / 0.65)));

  const blendWindow = Math.min(0.3, Math.max(0.06, journey.blend / travelRange));
  const blendStart = 1 - smoothRange(0, blendWindow, prog);
  const blendEnd = smoothRange(1 - blendWindow, 1, prog);

  let curY = bezierPt.y + blendStart * (getAnchor(s0, scrollY).y - pStart.y) + blendEnd * (getAnchor(s1, scrollY).y - pEnd.y);
  const curX = bezierPt.x;

  curY += s0.sink * s0.s * (1 - smoothRange(0, 0.22, prog)) + s1.sink * s1.s * smoothRange(0.78, 1, prog);

  let isAirborne = false;
  if (s0.behind && prog < 0.36) {
    curY -= Math.sin((prog / 0.36) * Math.PI) * Math.min(64 * s0.s, 72);
    isAirborne = prog < 0.32;
  }
  if (s1.behind && prog > 0.68) {
    curY -= Math.sin(((prog - 0.68) / 0.32) * Math.PI) * Math.min(56 * s1.s, 60);
    isAirborne = true;
  }
  if (s0.sink && prog < 0.2) isAirborne = true;

  const isFront = !(s0.behind && prog < 0.12 || s1.behind && prog > 0.92);

  const boxInterp =
    prog < 0.5
      ? lerpBox(s0.box, DEFAULT_BOX, smoothRange(0, s0.sink ? 0.22 : s0.behind ? 0.36 : 0.06, prog))
      : lerpBox(DEFAULT_BOX, s1.box, smoothRange(s1.sink ? 0.78 : s1.behind ? 0.68 : 0.94, 1, prog));

  const clamped = clampBox(curX, curY, curScale, boxInterp, safe);

  // Integrate walked distance along curve
  let walkedDist = 0;
  let prevWalkPt = curve.p0;
  const numSteps = Math.max(1, Math.ceil(32 * clamp01(easeT)));
  for (let s = 1; s <= numSteps; s++) {
    const pt = bezierPoint(curve.p0, curve.c1, curve.c2, curve.p1, (s / numSteps) * clamp01(easeT));
    walkedDist += Math.hypot(pt.x - prevWalkPt.x, pt.y - prevWalkPt.y);
    prevWalkPt = pt;
  }

  return {
    x: clamped.x,
    y: clamped.y,
    s: curScale,
    front: isFront,
    airborne: isAirborne,
    k,
    t: prog,
    walked: walkedDist,
  };
}

export const PuppyScrollJourney: React.FC = () => {
  const location = useLocation();
  const layerRef = useRef<HTMLDivElement>(null);
  const actorRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const bubbleAtRef = useRef<HTMLSpanElement>(null);
  const printsRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;
    const layer = layerRef.current;
    const actor = actorRef.current;
    const body = bodyRef.current;
    const bubble = bubbleRef.current;
    const bubbleAt = bubbleAtRef.current;
    const prints = printsRef.current;
    const probe = probeRef.current;

    if (!layer || !actor || !body || !bubble || !bubbleAt || !prints || !probe) return;

    const svg = body.querySelector('svg');
    if (!svg) return;

    const docEl = document.documentElement;
    let journey: JourneyData | null = null;
    let puppet: Puppet | null = null;
    let isActive = false;
    const pawSvgs = Array.from(prints.children) as HTMLElement[];
    let pawIndex = 0;
    let speechUntil = 0;

    const speak = (text: string, now: number, duration = 1.4) => {
      bubble.textContent = text;
      bubble.dataset.show = 'true';
      speechUntil = now + duration;
    };

    let pointerTarget: { x: number; y: number; t: number } | null = null;
    let lookTarget: { el: HTMLElement; until: number } | null = null;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        pointerTarget = { x: e.clientX, y: e.clientY, t: performance.now() / 1000 };
      }
    };

    let lastTime = performance.now() / 1000;
    let lastScrollY = window.scrollY;
    let prevPos: { x: number; y: number } | null = null;
    let lastEval: any = null;
    let smoothOffset = { x: 0, y: 0, s: 0 };
    let stationaryTimer = 0;
    let activeStopIdx = -1;
    let stopEnterTime = 0;
    let lastMovementTime = 0;
    let scheduledActions: [number, (t: number) => void][] = [];
    let nextLookIdx = -1;
    let lastLookTime = 0;
    let treadmillPrevX: number | null = null;
    let treadmillWalkTime = 0;
    let lastStepCount = -1;
    let stepParity = 0;
    let lastScrollEventTime = performance.now() / 1000;
    let scrollDirection = 1;
    let isSettlingToStop = false;
    let mobileSmoothPos: { x: number; y: number } | null = null;
    let basketActionTime = 0;

    const animLoop = () => {
      if (!journey || !puppet || !isActive) return;

      const now = performance.now() / 1000;
      const dt = Math.min(0.05, now - lastTime);
      lastTime = now;

      const curScroll = window.scrollY;
      const scrollDelta = curScroll - lastScrollY;
      lastScrollY = curScroll;

      if (Math.abs(scrollDelta) > 0.5) {
        lastScrollEventTime = now;
        scrollDirection = scrollDelta > 0 ? 1 : -1;
      }

      // Execute scheduled puppet actions
      while (scheduledActions.length && scheduledActions[0][0] <= now) {
        scheduledActions.shift()![1](now);
      }

      // Settle smoothly near stops if stopped scrolling
      const targetScroll =
        now - lastScrollEventTime > 0.25
          ? (() => {
              const { k, t } = findSegment(journey.holds, curScroll);
              if (t <= 0 || k >= journey.stops.length - 1) return curScroll;
              const s0 = journey.stops[k];
              const s1 = journey.stops[k + 1];
              const lowThresh = s0.sink ? 0.22 : 0.36 * +!!s0.behind;
              const highThresh = s1.sink ? 0.78 : s1.behind ? 0.68 : 1;
              let settledT = t;
              if (t < lowThresh) settledT = t < lowThresh / 2 ? 0 : lowThresh;
              else if (t > highThresh) settledT = t > (1 + highThresh) / 2 ? 1 : highThresh;
              return settledT === t
                ? curScroll
                : journey.holds[k][1] + settledT * (journey.holds[k + 1][0] - journey.holds[k][1]);
            })()
          : curScroll;

      const evalResult = evaluateJourney(journey, targetScroll);
      const isMobileScreen =
        journey.lane &&
        journey.stops[evalResult.k]?.track.kind === 'screen' &&
        (evalResult.t <= 0 || journey.stops[evalResult.k + 1]?.track.kind === 'screen');

      // Dampen offsets
      const decay = Math.exp(-dt / 0.28);
      smoothOffset.x *= decay;
      smoothOffset.y *= decay;
      smoothOffset.s *= decay;
      if (Math.abs(smoothOffset.x) < 0.05 && Math.abs(smoothOffset.y) < 0.05) {
        smoothOffset.x = smoothOffset.y = 0;
      }

      const isSettling = targetScroll !== curScroll;
      if (isSettling !== isSettlingToStop && prevPos && !isMobileScreen) {
        smoothOffset.x = prevPos.x - evalResult.x;
        smoothOffset.y = prevPos.y - evalResult.y;
      }
      isSettlingToStop = isSettling;

      const curScale = evalResult.s + smoothOffset.s;
      let posX = evalResult.x + smoothOffset.x;
      let posY = evalResult.y + smoothOffset.y;
      const isResting = evalResult.t === 0;
      const currentK = evalResult.k;

      lastEval = { ...evalResult, x: posX, y: posY, s: curScale };
      setDataset(layer, 'anchor', isMobileScreen ? 'bottom' : 'top');

      // Resting at a stop vs walking
      if (isResting) {
        if (activeStopIdx !== currentK) {
          const stopMeta = journey.meta[currentK];
          scheduledActions = [];
          lookTarget = null;
          activeStopIdx = currentK;
          stopEnterTime = now;
          lastMovementTime = now;
          treadmillPrevX = null;
          puppet.reset();
          puppet.setPose(stopMeta.pose);
          puppet.face(stopMeta.facing, 0.14);
          puppet.stride(0);
          puppet.wag(stopMeta.act === 'basket' ? 0.3 : 0.7);
          puppet.jolt(0.4);
          basketActionTime = now + 2.4;
        }

        const currentMeta = journey.meta[currentK];

        // Treadmill support in Meet section
        if (currentMeta.track && !scheduledActions.length) {
          const treadLeft = currentMeta.track.getBoundingClientRect().left;
          const safeTreadLeft = Number.isFinite(treadLeft) ? treadLeft : 0;
          const treadDelta = treadmillPrevX === null ? 0 : safeTreadLeft - treadmillPrevX;
          treadmillPrevX = safeTreadLeft;
          const safeWalkScale = Math.max(0.35, Math.min(1.8, Number.isFinite(curScale) ? curScale : 1));
          puppet.walkedTo(-safeTreadLeft / safeWalkScale);
          if (Number.isFinite(treadDelta) && Math.abs(treadDelta) > 0.25) {
            treadmillWalkTime = 0;
            puppet.setPose('walk');
            puppet.stride(1);
            puppet.face(treadDelta < 0 ? 1 : -1, 0.16);
          } else if ((treadmillWalkTime += dt) > 0.25) {
            puppet.setPose('stand');
            puppet.stride(0);
          }
        }

        // Paths section head tilt
        if (currentMeta.act === 'tilt' && !scheduledActions.length && now - stopEnterTime > 1.2) {
          puppet.cock(Math.sin(0.9 * now) > 0.35 ? 13 : Math.sin(0.9 * now) < -0.35 ? -10 : 0);
        }

        // Basket sleeping/yawning
        if (currentMeta.act === 'basket' && !scheduledActions.length && now > basketActionTime) {
          basketActionTime = now + 4.5 + 3 * Math.random();
          if (Math.random() < 0.7) puppet.jolt(0.55);
          else puppet.yawn(now, 0.7);
        }

        // Look at elements in scene
        const hasPointer = (lookTarget && lookTarget.until > now) || (pointerTarget && now - pointerTarget.t < 2.5);
        if (currentMeta.looks.length && !hasPointer && now - stopEnterTime > 0.8 && now - lastLookTime > 1.7) {
          lastLookTime = now;
          nextLookIdx = (nextLookIdx + 1) % (currentMeta.looks.length + 1);
          if (nextLookIdx < currentMeta.looks.length) {
            lookTarget = { el: currentMeta.looks[nextLookIdx], until: now + 1.4 };
          }
        }

        if (Math.abs(scrollDelta) > 0.5) lastMovementTime = now;
      } else {
        if (activeStopIdx !== -1) {
          activeStopIdx = -1;
          scheduledActions = [];
          puppet.reset();
        }

        const moveDelta = prevPos ? Math.hypot(posX - prevPos.x, posY - prevPos.y) : 0;
        stationaryTimer = moveDelta > 0.25 ? 0 : stationaryTimer + dt;

        let isHop = evalResult.airborne;
        if (isHop) {
          puppet.setPose('hop');
          puppet.stride(0);
        } else if (stationaryTimer > 0.3) {
          puppet.setPose('stand');
          puppet.stride(0);
        } else {
          puppet.setPose('walk');
          puppet.stride(1);
        }

        puppet.walkedTo(evalResult.walked / Math.max(0.05, curScale));

        if (prevPos) {
          const deltaX = posX - prevPos.x;
          if (Math.abs(deltaX) > 0.6 && Math.abs(deltaX) > 0.35 * Math.abs(posY - prevPos.y)) {
            puppet.face(deltaX > 0 ? 1 : -1, 0.16);
          }
        }

        // Spawn paw prints
        if (!journey.lane) {
          const stepIndex = Math.floor(evalResult.walked / (34 * curScale));
          if (lastStepCount === currentK && stepIndex !== stepParity && !evalResult.airborne && prevPos) {
            const isAlt = stepIndex & 1;
            const legOffset = isAlt ? 186 : 110;
            const pupLeft = posX - PUP_ANCHOR.x * curScale;
            const pupTop = posY - PUP_ANCHOR.y * curScale;
            const printX = pupLeft + (puppet.facingDir > 0 ? legOffset : PUPPET_W - legOffset) * curScale;
            const printY = pupTop + 226 * curScale + curScroll - journey.mainTop + (isAlt ? -4 : 4) * curScale;
            const printAngle = Math.atan2(posY - prevPos.y + scrollDelta, posX - prevPos.x) + Math.PI / 2;
            const printSize = 14 * Math.max(0.75, 1.5 * curScale);

            const pawEl = pawSvgs[pawIndex++ % pawSvgs.length];
            if (pawEl) {
              pawEl.style.transform = `translate(${(printX - printSize / 2).toFixed(1)}px, ${(printY - printSize / 2).toFixed(1)}px) rotate(${printAngle.toFixed(3)}rad)`;
              pawEl.style.width = pawEl.style.height = `${printSize.toFixed(1)}px`;
              pawEl.animate(
                [
                  { opacity: 0 },
                  { opacity: 0.45, offset: 0.08 },
                  { opacity: 0.45, offset: 0.5 },
                  { opacity: 0 },
                ],
                { duration: 2600, easing: 'ease-out' }
              );
            }
          }
          lastStepCount = currentK;
          stepParity = stepIndex;
        }
      }

      prevPos = { x: posX, y: posY };

      // Update scene dataset states (here, visited)
      journey.meta.forEach((m, idx) => {
        if (m.scene) {
          setDataset(m.scene, 'here', String(isResting && idx === currentK));
          setDataset(
            m.scene,
            'visited',
            String(idx <= currentK || (idx === currentK + 1 && evalResult.t > 0.92))
          );
        }
      });

      // Look direction
      if (lookTarget && lookTarget.until > now) {
        const lRect = lookTarget.el.getBoundingClientRect();
        puppet.lookAt({ x: lRect.left + lRect.width / 2, y: lRect.top + lRect.height / 2 });
      } else if (pointerTarget && now - pointerTarget.t < 2.5) {
        puppet.lookAt(pointerTarget);
      } else {
        puppet.lookAt(null);
      }

      // Update Actor DOM position
      const safeScale = Math.max(0.35, Math.min(1.8, Number.isFinite(curScale) ? curScale : 1));
      const safePosX = Number.isFinite(posX) ? posX : 0;
      const safePosY = Number.isFinite(posY) ? posY : 0;
      actor.style.transform = `translate3d(${(safePosX - PUP_ANCHOR.x * safeScale).toFixed(2)}px, ${(safePosY - PUP_ANCHOR.y * safeScale).toFixed(2)}px, 0)`;
      body.style.transform = `scale(${safeScale.toFixed(4)})`;
      setDataset(layer, 'front', String(evalResult.front));
      setDataset(actor, 'holding', String(isResting));

      // Speech bubble position
      if (bubble.dataset.show === 'true') {
        if (now > speechUntil) {
          bubble.dataset.show = 'false';
        }
        const bubbleX = (puppet.facingDir > 0 ? 214 : PUPPET_W - 214) * curScale;
        bubbleAt.style.transform = `translate(${bubbleX.toFixed(1)}px, ${(30 * curScale).toFixed(1)}px)`;
      }

      puppet.tick(dt, now);
      requestAnimationFrame(animLoop);
    };

    let clickCount = 0;
    let lastClickTime = 0;
    let lastTrick = '';

    const onClick = () => {
      if (!puppet || !journey) return;
      const now = performance.now() / 1000;
      clickCount = now - lastClickTime < 0.7 ? clickCount + 1 : 1;
      lastClickTime = now;
      lastMovementTime = now;

      if (activeStopIdx < 0) {
        const trickName = pickTrick(lastTrick, clickCount);
        lastTrick = trickName;
        const curMeta = journey.meta[Math.max(0, lastEval?.k ?? 0)];
        const ctx = {
          d: puppet,
          rest: POSES[curMeta?.pose || 'stand'] || POSES.stand,
          facing: puppet.facingDir,
          say: (msg: string, d?: number) => speak(msg, now, d),
          hearts: () => {
            if (lastEval) {
              spawnHearts(
                layer,
                lastEval.x - PUP_ANCHOR.x * lastEval.s + (puppet!.facingDir > 0 ? 212 : PUPPET_W - 212) * lastEval.s,
                lastEval.y - (PUP_ANCHOR.y - 40) * lastEval.s
              );
            }
          },
        };

        if (PUP_TRICKS[trickName]) {
          puppet.reset();
          scheduledActions = PUP_TRICKS[trickName](ctx, now);
        }
        return;
      }

      const stopMeta = journey.meta[activeStopIdx];
      let chosenTrick = '';
      if (stopMeta.track) chosenTrick = pickTrick(lastTrick, clickCount);
      else if (stopMeta.act === 'basket') chosenTrick = pickTrick(lastTrick, clickCount);
      else if (stopMeta.pose === 'peek') chosenTrick = 'peekaboo';
      else chosenTrick = pickTrick(lastTrick, clickCount);

      lastTrick = chosenTrick;
      puppet.reset();
      const ctx = {
        d: puppet,
        rest: POSES[stopMeta.pose] || POSES.sit,
        facing: stopMeta.facing,
        say: (msg: string, d?: number) => speak(msg, now, d),
        hearts: () => {
          if (lastEval) {
            spawnHearts(
              layer,
              lastEval.x - PUP_ANCHOR.x * lastEval.s + (puppet!.facingDir > 0 ? 212 : PUPPET_W - 212) * lastEval.s,
              lastEval.y - (PUP_ANCHOR.y - 40) * lastEval.s
            );
          }
        },
      };

      if (PUP_TRICKS[chosenTrick]) {
        scheduledActions = PUP_TRICKS[chosenTrick](ctx, now);
      }
    };

    const onPointerEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && puppet && activeStopIdx >= 0) {
        puppet.petting(true);
        puppet.wag(1);
      }
    };

    const onPointerLeave = () => {
      if (puppet) {
        puppet.petting(false);
        if (activeStopIdx >= 0) {
          puppet.wag(journey?.meta[activeStopIdx]?.act === 'basket' ? 0.3 : 0.7);
        }
      }
    };

    const onPupCue = (e: Event) => {
      const custom = e as CustomEvent;
      const detail = custom.detail;
      const currentScene = activeStopIdx >= 0 ? journey?.meta[activeStopIdx]?.scene : null;
      if (!currentScene || (detail.look && !currentScene.contains(detail.look))) return;
      const now = performance.now() / 1000;
      if (detail.look) {
        lookTarget = { el: detail.look, until: now + (detail.secs ?? 1.6) };
      }
      if (detail.say) {
        speak(detail.say, now);
      }
    };

    const initJourney = () => {
      if (isActive || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const data = calculateStops(probe);
      if (data.stops.length < 2) return;

      journey = data;
      isActive = true;
      docEl.dataset.pup = data.lane ? 'lane' : 'live';
      layer.hidden = false;

      const firstMeta = data.meta[0];
      puppet = new Puppet(svg, firstMeta.pose, firstMeta.facing);
      lastScrollY = window.scrollY;
      prevPos = null;
      lastScrollEventTime = lastTime = performance.now() / 1000;
      isSettlingToStop = false;

      const initialEval = evaluateJourney(data, window.scrollY);
      if (initialEval.k === 0 && initialEval.t === 0 && firstMeta.act === 'peekaboo') {
        activeStopIdx = 0;
        stopEnterTime = lastTime;
        const friends = firstMeta.scene ? Array.from(firstMeta.scene.querySelectorAll<HTMLElement>('[data-pup-friend]')) : [];
        const f1 = friends[0];
        const f2 = friends[friends.length - 1];
        scheduledActions = [
          [lastTime + 0.1, () => puppet!.setPose({ ...POSES.peek, headY: 120 })],
          [lastTime + 0.7, (t) => { puppet!.setPose('peek'); puppet!.jolt(1.2); speak('peekaboo!', t, 1.6); }],
          [lastTime + 1.5, (t) => { if (f1) lookTarget = { el: f1, until: t + 0.8 }; }],
          [lastTime + 2.3, (t) => { if (f2) lookTarget = { el: f2, until: t + 0.8 }; }],
          [lastTime + 3.1, () => { lookTarget = null; puppet!.wag(1); }],
        ];
      } else {
        activeStopIdx = -1;
      }

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pup:cue', onPupCue);
      actor.addEventListener('click', onClick);
      actor.addEventListener('pointerenter', onPointerEnter);
      actor.addEventListener('pointerleave', onPointerLeave);

      requestAnimationFrame(animLoop);
    };

    const destroyJourney = () => {
      if (!isActive) return;
      isActive = false;
      delete docEl.dataset.pup;
      layer.hidden = true;
      delete layer.dataset.anchor;
      journey?.meta.forEach((m) => {
        if (m.scene) {
          delete m.scene.dataset.here;
          delete m.scene.dataset.visited;
        }
      });
      journey = null;
      puppet = null;
      activeStopIdx = -1;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pup:cue', onPupCue);
      actor.removeEventListener('click', onClick);
      actor.removeEventListener('pointerenter', onPointerEnter);
      actor.removeEventListener('pointerleave', onPointerLeave);
    };

    const recalculateJourney = () => {
      if (!isActive || !journey) {
        initJourney();
        return;
      }
      const fresh = calculateStops(probe);
      if (fresh.stops.length < 2) return destroyJourney();
      const prevData = lastEval;
      const laneChanged = fresh.lane !== journey.lane;
      journey = fresh;
      docEl.dataset.pup = fresh.lane ? 'lane' : 'live';
      if (laneChanged) activeStopIdx = -1;
      if (prevData) {
        const freshEval = evaluateJourney(fresh, window.scrollY);
        smoothOffset.x = prevData.x - freshEval.x;
        smoothOffset.y = prevData.y - freshEval.y;
        smoothOffset.s = prevData.s - freshEval.s;
      }
    };

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(recalculateJourney, 100);
    };

    const onPupMeasure = () => {
      recalculateJourney();
    };

    const resizeObs = new ResizeObserver(onResize);
    resizeObs.observe(document.body);
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onPupMeasure);
    window.addEventListener('pup:measure', onPupMeasure);

    initJourney();
    document.fonts?.ready.then(onPupMeasure);

    return () => {
      destroyJourney();
      clearTimeout(resizeTimer);
      resizeObs.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onPupMeasure);
      window.removeEventListener('pup:measure', onPupMeasure);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('pup:measure'));
    }, 120);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <React.Fragment>
      <div ref={probeRef} aria-hidden={true} className="pup-probe" />
      <div ref={printsRef} aria-hidden={true} className="pup-prints">
        {Array.from({ length: 24 }, (_, a) => (
          <svg key={a} viewBox="0 0 64 64">
            <path d={PAW_PRINT_PATH} fill="currentColor" />
          </svg>
        ))}
      </div>
      <div ref={layerRef} aria-hidden={true} className="pup-layer" hidden={true} data-front="true">
        <div ref={actorRef} className="pup-actor">
          <div ref={bodyRef} className="pup-actor__body">
            <PupBuddySvg pose="peek" />
          </div>
          <span ref={bubbleAtRef} className="pup-bubble-at">
            <span ref={bubbleRef} className="pup-bubble" data-show="false" />
          </span>
        </div>
      </div>
    </React.Fragment>
  );
};
