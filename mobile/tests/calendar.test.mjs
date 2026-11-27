import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dayInfo, yearHolidays, upcomingSabbaths, burmeseDateLine, monthData } from '../src/lib/calendar.ts';

const rows = readFileSync(new URL('./golden-2027.tsv', import.meta.url), 'utf8').trim().split('\n').slice(1).map((l) => l.split('\t'));
const PH = ['waxing', 'full', 'waning', 'new'];

test('every 2027 day matches the verified poster data', () => {
  assert.equal(rows.length, 365);
  for (const [date, month, phase, fd, hol, sab] of rows) {
    const [y, m, d] = date.split('-').map(Number);
    const i = dayInfo(y, m, d);
    assert.equal(i.monthMy, month, date);
    assert.equal(PH[i.phase], phase, date);
    assert.equal(String(i.fortnightDay), fd, date);
    assert.equal(i.holidays.length > 0, hol === 'H', date);
    assert.equal(i.sabbath, sab === 'S', date);
  }
});

test('2027 holidays are the official list (18 entries, 32 days)', () => {
  const h = yearHolidays(2027);
  assert.equal(h.length, 18);
  assert.ok(h.every((r) => r.official));
  assert.equal(rows.filter((r) => r[4] === 'H').length, 32);
});

test('Myanmar New Year 1389 starts 17 April 2027', () => {
  assert.equal(dayInfo(2027, 4, 16).my, 1388);
  assert.equal(dayInfo(2027, 4, 17).my, 1389);
  assert.equal(burmeseDateLine(dayInfo(2027, 4, 17)), '၁၃၈၉ ခု တန်ခူး လဆန်း ၁၁ ရက်');
});

test('other years fall back to calculated holidays', () => {
  const h = yearHolidays(2028);
  assert.ok(h.length > 10);
  assert.ok(h.every((r) => !r.official));
});

test('month grid and sabbath helpers', () => {
  const md = monthData(2027, 1);
  assert.equal(md.lead, 5); // 1 Jan 2027 is a Friday
  assert.equal(md.days.length, 31);
  const s = upcomingSabbaths('2027-01-01', 4);
  assert.equal(s.length, 4);
  assert.ok(s.every((x) => x.sabbath));
});
