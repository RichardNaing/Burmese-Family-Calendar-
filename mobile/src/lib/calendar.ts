import { ceDateTime, ceMmDateTime, ceMmTranslate } from '../engine/mmcal';
import { OFFICIAL_HOLIDAYS } from './holidays';

const D = ceDateTime;
const M = ceMmDateTime;
const TR = new ceMmTranslate();

export const MIN_YEAR = 2020;
export const MAX_YEAR = 2035;

const BD = '၀၁၂၃၄၅၆၇၈၉';
/** Western digits → Burmese digits. */
export const bn = (n: number | string) => String(n).replace(/\d/g, (c) => BD[Number(c)]);

export const MM_MONTHS = [
  'ပထမဝါဆို', 'တန်ခူး', 'ကဆုန်', 'နယုန်', 'ဝါဆို', 'ဝါခေါင်', 'တော်သလင်း',
  'သီတင်းကျွတ်', 'တန်ဆောင်မုန်း', 'နတ်တော်', 'ပြာသို', 'တပို့တွဲ', 'တပေါင်း',
  'နှောင်းတန်ခူး', 'နှောင်းကဆုန်',
];
export const MM_MONTHS_EN = [
  'First Waso', 'Tagu', 'Kason', 'Nayon', 'Waso', 'Wagaung', 'Tawthalin',
  'Thadingyut', 'Tazaungmon', 'Nadaw', 'Pyatho', 'Tabodwe', 'Tabaung',
  'Late Tagu', 'Late Kason',
];
export const GREG_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const GREG_MONTHS_MY = ['ဇန်နဝါရီ', 'ဖေဖော်ဝါရီ', 'မတ်', 'ဧပြီ', 'မေ', 'ဇွန်', 'ဇူလိုင်', 'ဩဂုတ်', 'စက်တင်ဘာ', 'အောက်တိုဘာ', 'နိုဝင်ဘာ', 'ဒီဇင်ဘာ'];
/** Index 0 = Sunday (JS getDay order). */
export const WEEKDAYS_MY = ['တနင်္ဂနွေ', 'တနင်္လာ', 'အင်္ဂါ', 'ဗုဒ္ဓဟူး', 'ကြာသပတေး', 'သောကြာ', 'စနေ'];
export const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const WEEKDAYS_SHORT_MY = ['တနင်္ဂ', 'တနင်္လာ', 'အင်္ဂါ', 'ဗုဒ္ဓ', 'ကြာ', 'သော', 'စနေ'];
export const WEEKDAYS_SHORT_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const PHASES_MY = ['လဆန်း', 'လပြည့်', 'လဆုတ်', 'လကွယ်'];
export const PHASES_EN = ['Waxing', 'Full moon', 'Waning', 'New moon'];
const NAGAHLE_MY = ['အနောက်', 'မြောက်', 'အရှေ့', 'တောင်'];
const NAGAHLE_EN = ['West', 'North', 'East', 'South'];
const MAHABOTE_MY = ['ဘင်္ဂ', 'အထွန်း', 'ရာဇ', 'အဓိပတိ', 'မရဏ', 'သိုက်', 'ပုတိ'];
const MAHABOTE_EN = ['Binga', 'Atun', 'Yaza', 'Adipati', 'Marana', 'Thike', 'Puti'];

export type Phase = 0 | 1 | 2 | 3;

export interface Holiday {
  my: string;
  en: string;
  /** true when from the government's published list, false when calculated */
  official: boolean;
}

export interface DayInfo {
  y: number;
  m: number; // 1-12
  d: number;
  key: string; // YYYY-MM-DD
  weekday: number; // 0 = Sunday
  my: number; // Myanmar year
  mm: number;
  myt: number;
  monthMy: string;
  monthEn: string;
  phase: Phase;
  fortnightDay: number; // 1-15
  sabbath: boolean;
  sabbathEve: boolean;
  holidays: Holiday[];
  yatyaza: boolean;
  pyathada: 0 | 1 | 2; // 1 full day, 2 afternoon
  nagahleMy: string;
  nagahleEn: string;
  mahaboteMy: string;
  mahaboteEn: string;
  astroMy: string[];
  astroEn: string[];
}

const pad = (n: number) => String(n).padStart(2, '0');
export const dateKey = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
export const parseKey = (k: string) => {
  const [y, m, d] = k.split('-').map(Number);
  return { y, m, d };
};
export const todayKey = () => {
  const t = new Date();
  return dateKey(t.getFullYear(), t.getMonth() + 1, t.getDate());
};
export const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();

const tr = (s: string) => {
  const out = TR.T(s, 1);
  return out || s;
};

const cache = new Map<string, DayInfo>();

/** Everything shown for one Gregorian day. */
export function dayInfo(y: number, m: number, d: number): DayInfo {
  const key = dateKey(y, m, d);
  const hit = cache.get(key);
  if (hit) return hit;

  const jdn = D.w2j(y, m, d);
  const x = M.j2m(jdn);
  const mmWd = (jdn + 2) % 7; // engine weekday: 0 = Saturday
  const weekday = new Date(y, m - 1, d).getDay();
  const secondWaso = x.mm === 4 && x.myt > 0;
  const sab = M.cal_sabbath(x.md, x.mm, x.myt);

  const official = OFFICIAL_HOLIDAYS[y];
  let holidays: Holiday[];
  if (official) {
    holidays = official
      .filter((h) => h.from <= key.slice(5) && key.slice(5) <= (h.to ?? h.from))
      .map((h) => ({ my: h.my, en: h.en, official: true }));
  } else {
    holidays = M.cal_holiday(jdn).map((en) => ({ my: tr(en), en, official: false }));
  }

  const astroEn = M.cal_astro(jdn);
  const nag = M.cal_nagahle(x.mm);
  const mb = M.cal_mahabote(x.my, mmWd);

  const info: DayInfo = {
    y, m, d, key, weekday,
    my: x.my, mm: x.mm, myt: x.myt,
    monthMy: secondWaso ? 'ဒုတိယဝါဆို' : MM_MONTHS[x.mm],
    monthEn: secondWaso ? 'Second Waso' : MM_MONTHS_EN[x.mm],
    phase: M.cal_mp(x.md, x.mm, x.myt) as Phase,
    fortnightDay: M.cal_mf(x.md),
    sabbath: sab === 1,
    sabbathEve: sab === 2,
    holidays,
    yatyaza: M.cal_yatyaza(x.mm, mmWd) === 1,
    pyathada: M.cal_pyathada(x.mm, mmWd) as 0 | 1 | 2,
    nagahleMy: NAGAHLE_MY[nag],
    nagahleEn: NAGAHLE_EN[nag],
    mahaboteMy: MAHABOTE_MY[mb],
    mahaboteEn: MAHABOTE_EN[mb],
    astroMy: astroEn.map(tr),
    astroEn,
  };
  cache.set(key, info);
  return info;
}

/** "၁၃၈၈ ခု တန်ခူး လဆန်း ၁၀ ရက်" */
export function burmeseDateLine(i: DayInfo): string {
  const day = i.phase === 1 || i.phase === 3 ? '' : ` ${bn(i.fortnightDay)} ရက်`;
  return `${bn(i.my)} ခု ${i.monthMy} ${PHASES_MY[i.phase]}${day}`;
}
export function englishDateLine(i: DayInfo): string {
  const day = i.phase === 1 || i.phase === 3 ? '' : ` ${i.fortnightDay}`;
  return `ME ${i.my} · ${i.monthEn} · ${PHASES_EN[i.phase]}${day}`;
}

export interface MonthData {
  y: number;
  m: number;
  lead: number; // empty cells before day 1 (Sunday-first)
  days: DayInfo[];
  myYears: string; // "၁၃၈၈ ခု" or "၁၃၈၈–၁၃၈၉ ခု"
  myMonths: string[];
  myMonthsEn: string[];
}

export function monthData(y: number, m: number): MonthData {
  const n = daysInMonth(y, m);
  const days: DayInfo[] = [];
  const myMonths: string[] = [];
  const myMonthsEn: string[] = [];
  for (let d = 1; d <= n; d++) {
    const i = dayInfo(y, m, d);
    days.push(i);
    if (!myMonths.includes(i.monthMy)) {
      myMonths.push(i.monthMy);
      myMonthsEn.push(i.monthEn);
    }
  }
  const a = days[0].my;
  const b = days[n - 1].my;
  return {
    y, m, lead: new Date(y, m - 1, 1).getDay(), days,
    myYears: a === b ? `${bn(a)} ခု` : `${bn(a)}–${bn(b)} ခု`,
    myMonths, myMonthsEn,
  };
}

export interface HolidayRow {
  key: string;
  to?: string;
  my: string;
  en: string;
  official: boolean;
}

/** Holidays of a year, consecutive days of the same holiday merged. */
export function yearHolidays(y: number): HolidayRow[] {
  const official = OFFICIAL_HOLIDAYS[y];
  if (official) {
    return official.map((h) => ({
      key: `${y}-${h.from}`,
      to: h.to ? `${y}-${h.to}` : undefined,
      my: h.my, en: h.en, official: true,
    }));
  }
  const rows: HolidayRow[] = [];
  for (let m = 1; m <= 12; m++) {
    for (let d = 1; d <= daysInMonth(y, m); d++) {
      const i = dayInfo(y, m, d);
      for (const h of i.holidays) {
        const last = rows[rows.length - 1];
        const prev = new Date(y, m - 1, d - 1);
        const prevKey = dateKey(prev.getFullYear(), prev.getMonth() + 1, prev.getDate());
        if (last && last.en === h.en && (last.to ?? last.key) === prevKey) last.to = i.key;
        else rows.push({ key: i.key, my: h.my, en: h.en, official: false });
      }
    }
  }
  return rows;
}

/** Upcoming Sabbath days (ဥပုသ်) from today, for reminders. */
export function upcomingSabbaths(fromKey: string, count: number): DayInfo[] {
  const { y, m, d } = parseKey(fromKey);
  const out: DayInfo[] = [];
  const t = new Date(y, m - 1, d);
  for (let i = 0; i < 400 && out.length < count; i++) {
    const yy = t.getFullYear();
    if (yy > MAX_YEAR) break;
    const info = dayInfo(yy, t.getMonth() + 1, t.getDate());
    if (info.sabbath) out.push(info);
    t.setDate(t.getDate() + 1);
  }
  return out;
}
