// Public holidays published by the Union Government in the State Gazette.
// Years listed here override the engine's calculated holidays.
// 2027: announced Oct 2026 (34 days incl. Eid al-Adha and Deepavali, dated later).

export interface OfficialHoliday {
  from: string; // MM-DD
  to?: string; // MM-DD, inclusive
  my: string;
  en: string;
}

export const OFFICIAL_HOLIDAYS: Record<number, OfficialHoliday[]> = {
  2027: [
    { from: '01-01', my: 'နိုင်ငံတကာနှစ်သစ်ကူးနေ့', en: "New Year's Day" },
    { from: '01-04', my: 'လွတ်လပ်ရေးနေ့', en: 'Independence Day' },
    { from: '01-08', my: 'ကရင်နှစ်သစ်ကူး', en: 'Karen New Year' },
    { from: '02-07', my: 'တရုတ်နှစ်သစ်ကူး', en: 'Chinese New Year' },
    { from: '02-12', my: 'ပြည်ထောင်စုနေ့', en: 'Union Day' },
    { from: '03-01', to: '03-02', my: 'တောင်သူလယ်သမားနေ့', en: "Peasants' Day" },
    { from: '03-22', my: 'တပေါင်းလပြည့်', en: 'Full Moon of Tabaung' },
    { from: '03-27', my: 'တပ်မတော်နေ့', en: 'Armed Forces Day' },
    { from: '04-10', to: '04-18', my: 'သင်္ကြန်နှင့် နှစ်ဆန်းတစ်ရက်', en: 'Thingyan & New Year' },
    { from: '05-01', my: 'အလုပ်သမားနေ့', en: 'Labour Day' },
    { from: '05-20', to: '05-21', my: 'ကဆုန်လပြည့် ဗုဒ္ဓနေ့', en: 'Full Moon of Kason' },
    { from: '07-18', my: 'ဝါဆိုလပြည့် ဓမ္မစကြာနေ့', en: 'Full Moon of Waso' },
    { from: '07-19', my: 'အာဇာနည်နေ့', en: "Martyrs' Day" },
    { from: '10-14', to: '10-16', my: 'သီတင်းကျွတ်ပွဲတော်', en: 'Thadingyut Festival' },
    { from: '11-13', my: 'တန်ဆောင်မုန်းလပြည့်', en: 'Full Moon of Tazaungmon' },
    { from: '11-22', to: '11-23', my: 'အမျိုးသားအောင်ပွဲနေ့', en: 'National Victory Day' },
    { from: '12-25', my: 'ခရစ္စမတ်နေ့', en: 'Christmas Day' },
    { from: '12-27', to: '12-28', my: 'ကရင်နှစ်သစ်ကူး', en: 'Karen New Year' },
  ],
};

export const OFFICIAL_NOTES: Record<number, { my: string; en: string }> = {
  2027: {
    my: 'အီဒ်နေ့နှင့် ဒီပါဝလီနေ့ ရက်စွဲများကို နောက်မှ ကြေညာပါမည်။',
    en: 'Eid al-Adha and Deepavali are also holidays; their dates are announced separately.',
  },
};
