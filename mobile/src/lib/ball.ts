// Ball physics for the tactile board — a port of the simulation in src/tactile.html.
// The board component owns one BallSim and keeps it updated with the current layout.
import { Animated, PanResponder, type PanResponderInstance } from 'react-native';

export interface Cell { key: string; x: number; y: number }

const WELL = 340; // dimple spring
const WELL_DRAG = 15; // dimple damping (slightly under-damped → a little wobble)
const RESIST = 520; // rolling resistance on flat paper
const DRAIN = 180; // slow drift towards the nearest dimple
const AUTO_K = 120; // spring used when a day is tapped
const G = 2600; // gravity for the drop
export const LIFT = 26; // height while held
const V_MAX = 2400;
const WALL = 0.45;
const H = 1 / 120;

export class BallSim {
  readonly pos = new Animated.ValueXY();
  readonly lift = new Animated.Value(0);
  readonly spin = new Animated.Value(0);
  readonly pan: PanResponderInstance;

  cells: Cell[] = [];
  R = 16;
  W = 300;
  Hgt = 300;
  reduceMotion = false;
  onSelect: (key: string) => void = () => {};
  onLand: () => void = () => {};
  onHold: (held: boolean) => void = () => {};

  private x = 0; private y = 0; private vx = 0; private vy = 0; private z = 0; private vz = 0;
  private hx = 0; private hy = 0; private x0 = 0; private y0 = 0;
  private held = false; private rest = true; private auto = -1; private at = -1; private angle = 0; private settle = 0;
  private raf: number | null = null;
  private last = 0; private acc = 0;
  private month = '';

  constructor() {
    this.pan = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        this.held = true; this.auto = -1; this.settle = 0;
        this.x0 = this.x; this.y0 = this.y; this.hx = this.x; this.hy = this.y;
        this.onHold(true);
        this.kick();
      },
      onPanResponderMove: (_e, g) => {
        this.hx = Math.min(this.W - this.R, Math.max(this.R, this.x0 + g.dx));
        this.hy = Math.min(this.Hgt - this.R, Math.max(this.R, this.y0 + g.dy));
      },
      onPanResponderRelease: (_e, g) => {
        this.held = false;
        const vx = g.vx * 1000, vy = g.vy * 1000, sp = Math.hypot(vx, vy);
        if (sp > 40) { const k = sp > V_MAX ? V_MAX / sp : 1; this.vx = vx * k; this.vy = vy * k; }
        this.vz = 0;
        this.onHold(false);
        this.kick();
      },
      onPanResponderTerminate: () => { this.held = false; this.onHold(false); this.kick(); },
    });
  }

  /** Update layout and callbacks from the board component. */
  sync(o: { cells: Cell[]; R: number; W: number; H: number; onSelect: (k: string) => void; onHold: (h: boolean) => void; onLand: () => void }) {
    this.cells = o.cells; this.R = o.R; this.W = o.W; this.Hgt = o.H;
    this.onSelect = o.onSelect; this.onHold = o.onHold; this.onLand = o.onLand;
  }
  setReduceMotion(v: boolean) { this.reduceMotion = v; }

  /** Put the ball on `key`. A new month drops it in from above; the same month rolls it over. */
  place(monthKey: string, key: string) {
    const i = this.cells.findIndex((c) => c.key === key);
    if (i < 0) return;
    const c = this.cells[i];
    if (this.month !== monthKey || this.reduceMotion) {
      const first = this.month === '';
      this.month = monthKey;
      this.x = c.x; this.y = c.y; this.vx = this.vy = 0; this.at = i; this.auto = -1; this.held = false;
      if (first || this.reduceMotion) { this.z = 0; this.vz = 0; this.rest = true; this.render(); }
      else { this.z = LIFT * 1.4; this.vz = 0; this.kick(); }
      return;
    }
    if (this.at !== i && !this.held) { this.at = i; this.auto = i; this.kick(); }
  }

  /** A day was tapped: roll there. */
  send(key: string) {
    const i = this.cells.findIndex((c) => c.key === key);
    if (i < 0 || this.held) return;
    if (this.reduceMotion) { const c = this.cells[i]; this.x = c.x; this.y = c.y; this.render(); this.landed(i); return; }
    if (this.rest && this.at === i) { this.onSelect(key); return; }
    this.auto = i; this.settle = 0; this.kick();
  }

  stop() { if (this.raf != null) cancelAnimationFrame(this.raf); this.raf = null; }

  private kick() {
    this.rest = false;
    if (this.raf != null) return;
    this.last = Date.now(); this.acc = 0;
    this.raf = requestAnimationFrame(this.tick);
  }

  private tick = () => {
    const now = Date.now();
    this.acc += Math.min(Math.max((now - this.last) / 1000, 0), 1 / 30);
    this.last = now;
    while (this.acc >= H) { this.step(H); this.acc -= H; }
    this.render();
    this.raf = this.rest && !this.held ? null : requestAnimationFrame(this.tick);
  };

  private render() {
    this.pos.setValue({ x: this.x, y: this.y });
    this.lift.setValue(this.z);
    this.spin.setValue(this.angle);
  }

  private nearest(x: number, y: number) {
    const cs = this.cells;
    let index = 0, best = Infinity;
    for (let i = 0; i < cs.length; i++) {
      const d = (cs[i].x - x) ** 2 + (cs[i].y - y) ** 2;
      if (d < best) { best = d; index = i; }
    }
    return { index, dx: cs[index].x - x, dy: cs[index].y - y, d: Math.sqrt(best) };
  }

  private landed(i: number) {
    if (i === this.at) return;
    this.at = i;
    this.onSelect(this.cells[i].key);
    this.onLand();
  }

  /** One fixed physics step of h seconds. */
  step(h: number) {
    if (!this.cells.length) { this.rest = true; return; }
    const r = this.R, RD = r * 1.25;
    if (this.held) {
      const k = Math.min(1, h * 32);
      const nx = this.x + (this.hx - this.x) * k, ny = this.y + (this.hy - this.y) * k;
      this.vx = (nx - this.x) / h; this.vy = (ny - this.y) / h; this.x = nx; this.y = ny;
      this.z += (LIFT - this.z) * Math.min(1, h * 18);
    } else {
      if (this.z > 0 || this.vz !== 0) {
        this.vz -= G * h; this.z += this.vz * h;
        if (this.z <= 0) { this.z = 0; this.vz = -this.vz > 90 ? -this.vz * 0.32 : 0; }
      }
      const n = this.nearest(this.x, this.y);
      let ax = 0, ay = 0;
      const tgt = this.auto >= 0 ? this.cells[this.auto] : null;
      const td = tgt ? Math.hypot(tgt.x - this.x, tgt.y - this.y) : 0;
      const sp = Math.hypot(this.vx, this.vy);
      if (tgt && td > RD * 0.5) {
        const damp = 2 * Math.sqrt(AUTO_K);
        ax = AUTO_K * (tgt.x - this.x) - damp * this.vx; ay = AUTO_K * (tgt.y - this.y) - damp * this.vy;
      } else if (n.d < RD) {
        ax = WELL * n.dx - WELL_DRAG * this.vx; ay = WELL * n.dy - WELL_DRAG * this.vy;
      } else {
        if (sp > 1) { ax = (-RESIST * this.vx) / sp; ay = (-RESIST * this.vy) / sp; }
        if (sp < 140) { ax += (DRAIN * n.dx) / n.d; ay += (DRAIN * n.dy) / n.d; }
      }
      this.vx += ax * h; this.vy += ay * h;
      this.x += this.vx * h; this.y += this.vy * h;
      const sp2 = Math.hypot(this.vx, this.vy);
      if (n.d < 1.2 && sp2 < 14 && this.z === 0 && (!tgt || n.index === this.auto)) {
        this.settle += h;
        if (this.settle > 0.05) {
          const c = this.cells[n.index];
          this.x = c.x; this.y = c.y; this.vx = this.vy = 0; this.rest = true; this.auto = -1; this.settle = 0;
          this.landed(n.index);
        }
      } else this.settle = 0;
    }
    if (this.x < r) { this.x = r; this.vx = Math.abs(this.vx) * WALL; } else if (this.x > this.W - r) { this.x = this.W - r; this.vx = -Math.abs(this.vx) * WALL; }
    if (this.y < r) { this.y = r; this.vy = Math.abs(this.vy) * WALL; } else if (this.y > this.Hgt - r) { this.y = this.Hgt - r; this.vy = -Math.abs(this.vy) * WALL; }
    const v = Math.hypot(this.vx, this.vy);
    if (v > V_MAX) { this.vx *= V_MAX / v; this.vy *= V_MAX / v; }
    this.angle += (this.vx * h) / r;
    if (![this.x, this.y, this.vx, this.vy, this.z].every(Number.isFinite)) { this.vx = this.vy = this.z = this.vz = 0; this.rest = true; }
  }

  // test helpers
  /** Run the simulation without animation frames until the ball rests (or maxSeconds). */
  runUntilRest(maxSeconds = 5) {
    for (let t = 0; t < maxSeconds && !(this.rest && !this.held); t += H) this.step(H);
    return { x: this.x, y: this.y, at: this.at, rest: this.rest };
  }
  /** Simulate a flick from the current position with velocity (pt/s). */
  flick(vx: number, vy: number) { this.vx = vx; this.vy = vy; this.rest = false; this.auto = -1; }
  /** Teleport without selecting (tests). */
  teleport(x: number, y: number) { this.x = x; this.y = y; this.vx = this.vy = 0; this.rest = false; }
  get state() { return { x: this.x, y: this.y, at: this.at, rest: this.rest }; }
  /** For tests: set month/at without animation. */
  primeAt(monthKey: string, key: string) {
    this.month = monthKey; const i = this.cells.findIndex((c) => c.key === key); const c = this.cells[i];
    this.x = c.x; this.y = c.y; this.at = i; this.rest = true;
  }
  /** For tests: send without frames. */
  sendNow(key: string) { const i = this.cells.findIndex((c) => c.key === key); this.auto = i; this.rest = false; this.settle = 0; }
}
