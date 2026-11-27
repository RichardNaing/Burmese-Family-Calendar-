export type Lang = 'my' | 'en';

const S = {
  calendar: { my: 'ပြက္ခဒိန်', en: 'Calendar' },
  today: { my: 'ယနေ့', en: 'Today' },
  holidays: { my: 'ရုံးပိတ်ရက်', en: 'Holidays' },
  settings: { my: 'ဆက်တင်', en: 'Settings' },
  sabbath: { my: 'ဥပုသ်နေ့', en: 'Sabbath day' },
  sabbathEve: { my: 'အဖိတ်နေ့', en: 'Sabbath eve' },
  holiday: { my: 'ရုံးပိတ်ရက်', en: 'Public holiday' },
  yatyaza: { my: 'ရက်ရာဇာ', en: 'Yatyaza (auspicious)' },
  pyathada: { my: 'ပြဿဒါး', en: 'Pyathada (inauspicious)' },
  afternoonPyathada: { my: 'မွန်းလွဲ ပြဿဒါး', en: 'Afternoon Pyathada' },
  nagahle: { my: 'နဂါးခေါင်းလှည့်', en: 'Naga head faces' },
  mahabote: { my: 'မဟာဘုတ်', en: 'Mahabote' },
  astro: { my: 'နေ့ထူးများ', en: 'Special days' },
  official: { my: 'အစိုးရ ကြေညာချက်', en: 'Official (State Gazette)' },
  calculated: { my: 'တွက်ချက်ထားသော ရက်များ — တရားဝင်စာရင်းနှင့် တိုက်စစ်ပါ', en: 'Calculated — check the official list when published' },
  language: { my: 'ဘာသာစကား', en: 'Language' },
  reminders: { my: 'ဥပုသ်နေ့ သတိပေးချက်', en: 'Sabbath reminders' },
  remindersHint: { my: 'ဥပုသ်နေ့ မတိုင်မီ ညနေ ၇ နာရီတွင် အသိပေးပါမည်', en: 'A reminder at 7 pm the evening before each Sabbath day' },
  remindersDenied: { my: 'အသိပေးချက် ခွင့်ပြုချက် မရပါ။ ဖုန်း Settings တွင် ဖွင့်ပေးပါ။', en: 'Notifications are turned off. Allow them in your phone Settings.' },
  goToday: { my: 'ယနေ့', en: 'Today' },
  key: { my: 'သင်္ကေတ', en: 'Key' },
  fullMoon: { my: 'လပြည့်', en: 'Full moon' },
  newMoon: { my: 'လကွယ်', en: 'New moon' },
  about: { my: 'အကြောင်း', en: 'About' },
  aboutText: {
    my: 'မြန်မာ လ၊ ရက်များကို ဒေါက်တာ ရန်နိုင်အေး၏ mmcal တွက်နည်းဖြင့် တွက်ချက်ထားပါသည်။ ၂၀၂၇ ရုံးပိတ်ရက်များမှာ ပြည်ထောင်စုအစိုးရ၏ နိုင်ငံတော်ပြန်တမ်း ကြေညာချက်အတိုင်း ဖြစ်ပါသည်။',
    en: 'Myanmar dates are calculated with the mmcal algorithm by Dr. Yan Naing Aye. 2027 public holidays follow the Union Government announcement in the State Gazette.',
  },
  privacy: { my: 'ကိုယ်ရေးအချက်အလက်', en: 'Privacy' },
  privacyText: {
    my: 'ဤအက်ပ်သည် အချက်အလက် မစုဆောင်းပါ။ ဆက်တင်များကို သင့်ဖုန်းထဲတွင်သာ သိမ်းပါသည်။',
    en: 'This app collects no data. Your settings stay on your phone.',
  },
  design: { my: 'ဒီဇိုင်း', en: 'Design by' },
  close: { my: 'ပိတ်မည်', en: 'Close' },
  noHolidays: { my: 'ရုံးပိတ်ရက် မရှိပါ', en: 'No holidays' },
} as const;

export type StrKey = keyof typeof S;
export const t = (lang: Lang, k: StrKey) => S[k][lang];
