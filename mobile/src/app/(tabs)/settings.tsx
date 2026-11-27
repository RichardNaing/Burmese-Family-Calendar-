import Constants from 'expo-constants';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Txt } from '../../components/Txt';
import { type Lang, t } from '../../lib/i18n';
import { remindersSupported } from '../../lib/reminders';
import { useSettings } from '../../lib/settings';
import { C } from '../../lib/theme';

export default function SettingsScreen() {
  const { lang, setLang, reminders, setReminders } = useSettings();
  const [denied, setDenied] = useState(false);
  const version = Constants.expoConfig?.version ?? '';

  const toggle = async (on: boolean) => {
    const ok = await setReminders(on);
    setDenied(!ok);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.paper }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 32 }}>
        <Txt size={26} bold>{t(lang, 'settings')}</Txt>

        <View style={st.card}>
          <Txt size={13} bold color={C.soft}>{t(lang, 'language')}</Txt>
          <View style={st.seg}>
            {(['my', 'en'] as Lang[]).map((l) => (
              <Pressable
                key={l}
                onPress={() => setLang(l)}
                style={[st.segBtn, lang === l && st.segOn]}
                accessibilityRole="button"
                accessibilityState={{ selected: lang === l }}
              >
                <Txt size={15} bold color={lang === l ? C.paper : C.ink}>{l === 'my' ? 'မြန်မာ' : 'English'}</Txt>
              </Pressable>
            ))}
          </View>
        </View>

        {remindersSupported ? (
          <View style={st.card}>
            <View style={st.row}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Txt size={16} bold>{t(lang, 'reminders')}</Txt>
                <Txt size={12} color={C.soft}>{t(lang, 'remindersHint')}</Txt>
              </View>
              <Switch value={reminders} onValueChange={toggle} trackColor={{ true: C.red, false: C.line }} />
            </View>
            {denied ? <Txt size={12} color={C.red} style={{ marginTop: 8 }}>{t(lang, 'remindersDenied')}</Txt> : null}
          </View>
        ) : null}

        <View style={st.card}>
          <Txt size={13} bold color={C.soft}>{t(lang, 'about')}</Txt>
          <Txt size={14} style={{ marginTop: 4 }}>{t(lang, 'aboutText')}</Txt>
        </View>
        <View style={st.card}>
          <Txt size={13} bold color={C.soft}>{t(lang, 'privacy')}</Txt>
          <Txt size={14} style={{ marginTop: 4 }}>{t(lang, 'privacyText')}</Txt>
        </View>

        <Txt size={12} color={C.soft} style={{ textAlign: 'center', marginTop: 6 }}>
          {`Design by IT Garden Malaysia (RN) · v${version}`}
        </Txt>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  seg: { flexDirection: 'row', gap: 8, marginTop: 8 },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper },
  segOn: { backgroundColor: C.ink, borderColor: C.ink },
  row: { flexDirection: 'row', alignItems: 'center' },
});
