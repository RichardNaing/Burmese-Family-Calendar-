// Golden test: the engine's waxing/waning day for every day of four months
// must match the printed 2027 Myanmar & Thailand Calendar.
// F = full moon (လပြည့်), N = new moon (လကွယ်).
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadEngine } from '../scripts/engine.mjs';

const { ceDateTime, ceMmDateTime } = loadEngine();
const PRINT_2027 = {
  1:  [8,9,10,11,12,13,'N',1,2,3,4,5,6,7,8,9,10,11,12,13,14,'F',1,2,3,4,5,6,7,8,9],
  2:  [10,11,12,13,14,'N',1,2,3,4,5,6,7,8,9,10,11,12,13,14,'F',1,2,3,4,5,6,7],
  5:  [10,11,12,13,'N',1,2,3,4,5,6,7,8,9,10,11,12,13,14,'F',1,2,3,4,5,6,7,8,9,10,11],
  12: [3,4,5,6,7,8,9,10,11,12,13,14,'F',1,2,3,4,5,6,7,8,9,10,11,12,13,'N',1,2,3,4],
};

function fortnight(y, m, d) {
  const M = ceMmDateTime.j2m(ceDateTime.w2j(y, m, d));
  const mp = ceMmDateTime.cal_mp(M.md, M.mm, M.myt);
  return mp === 1 ? 'F' : mp === 3 ? 'N' : ceMmDateTime.cal_mf(M.md);
}

for (const [m, days] of Object.entries(PRINT_2027)) {
  test(`2027-${m} lunar days match print`, () => {
    days.forEach((expected, i) => assert.equal(fortnight(2027, +m, i + 1), expected, `2027-${m}-${i + 1}`));
  });
}

test('Myanmar New Year 1389 falls on 2027-04-17', () => {
  const j = ceDateTime.w2j(2027, 4, 17);
  assert.ok(ceMmDateTime.cal_holiday(j).includes("Myanmar New Year's Day"));
  assert.equal(ceMmDateTime.j2m(j).my, 1389);
});
