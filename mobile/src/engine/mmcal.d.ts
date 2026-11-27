// Types for the generated mmcal engine (only what the app uses).
export interface MmDate {
  myt: number; // year type: 0 common, 1 little watat, 2 big watat
  my: number; // Myanmar year (ME)
  mm: number; // month: 0 First Waso, 1 Tagu ... 12 Tabaung, 13 Late Tagu, 14 Late Kason
  md: number; // day of month 1-30
}
export class ceDateTime {
  static w2j(y: number, m: number, d: number, h?: number, n?: number, s?: number, ct?: number, SG?: number): number;
}
export class ceMmDateTime extends ceDateTime {
  static j2m(jdn: number): MmDate;
  static cal_mp(md: number, mm: number, myt: number): number; // 0 waxing, 1 full, 2 waning, 3 new
  static cal_mf(md: number): number; // fortnight day 1-15
  static cal_sabbath(md: number, mm: number, myt: number): number; // 1 sabbath, 2 sabbath eve
  static cal_yatyaza(mm: number, wd: number): number;
  static cal_pyathada(mm: number, wd: number): number; // 1 pyathada, 2 afternoon pyathada
  static cal_nagahle(mm: number): number; // 0 W, 1 N, 2 E, 3 S
  static cal_mahabote(my: number, wd: number): number;
  static cal_astro(jdn: number): string[];
  static cal_holiday(jdn: number): string[];
  static cal_holiday2(jdn: number): string[];
}
export class ceMmTranslate {
  T(str: string, toLn?: number, fromLn?: number): string;
}
