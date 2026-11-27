import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { bn, burmeseDateLine, todayKey, upcomingSabbaths } from './calendar';
import type { Lang } from './i18n';

const CHANNEL = 'sabbath';
const AHEAD = 40; // iOS keeps at most 64 pending local notifications

export const remindersSupported = Platform.OS === 'ios' || Platform.OS === 'android';

if (remindersSupported) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function requestPermission(): Promise<boolean> {
  if (!remindersSupported) return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Sabbath reminders',
      // eslint-disable-next-line import/namespace -- re-exported enum the rule can't follow
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const cur = await Notifications.getPermissionsAsync();
  if (cur.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

export async function cancelReminders() {
  if (!remindersSupported) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/** Re-schedules a 7 pm reminder on the eve of each upcoming Sabbath day. */
export async function scheduleReminders(lang: Lang): Promise<number> {
  if (!remindersSupported) return 0;
  await cancelReminders();
  const now = Date.now();
  let n = 0;
  for (const day of upcomingSabbaths(todayKey(), AHEAD + 1)) {
    const at = new Date(day.y, day.m - 1, day.d - 1, 19, 0, 0);
    if (at.getTime() <= now) continue;
    const title = lang === 'my' ? 'မနက်ဖြန် ဥပုသ်နေ့' : 'Tomorrow is Sabbath (ဥပုသ်)';
    const body =
      lang === 'my'
        ? `${bn(day.d)}.${bn(day.m)}.${bn(day.y)} · ${burmeseDateLine(day)}`
        : `${day.d}/${day.m}/${day.y} · ${burmeseDateLine(day)}`;
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data: { date: day.key } },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: at,
        ...(Platform.OS === 'android' ? { channelId: CHANNEL } : {}),
      },
    });
    n++;
    if (n >= AHEAD) break;
  }
  return n;
}
