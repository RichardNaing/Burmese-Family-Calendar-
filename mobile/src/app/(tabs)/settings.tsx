import Constants from 'expo-constants';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paper, Pill } from '../../components/Tactile';
import { Txt } from '../../components/Txt';
import { t } from '../../lib/i18n';
import { remindersSupported } from '../../lib/reminders';
import { useSettings } from '../../lib/settings';
import { C } from '../../lib/theme';

export default function SettingsScreen() {
  const { lang, setLang, reminders, setReminders } = useSettings();
  const { width } = useWindowDimensions();
  const [denied, setDenied] = useState(false);
  const version = Constants.expoConfig?.version ?? '';

  const toggle = async (on: boolean) => {
    const ok = await setReminders(on);
    setDenied(!ok);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.backdrop }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingVertical: 12, paddingBottom: 28 }}>
        <Paper style={{ width: Math.min(width - 20, 540), alignSelf: 'center' }}>
          <View style={{ padding: 18 }}>
            <Txt size={13}>ဆက်တင်</Txt>
            <Txt size={9.5} caps weight="medium" color={C.soft}>Settings</Txt>

            <Section my="ဘာသာစကား" en="Language">
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <Pill label="မြန်မာ" active={lang === 'my'} onPress={() => setLang('my')} minWidth={96} />
                <Pill label="English" active={lang === 'en'} onPress={() => setLang('en')} minWidth={96} />
              </View>
            </Section>

            {remindersSupported ? (
              <Section my="ဥပုသ်နေ့ သတိပေးချက်" en="Sabbath reminders">
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <Txt size={11} color={C.soft} style={{ flex: 1, paddingRight: 12 }}>{t(lang, 'remindersHint')}</Txt>
                  <Switch value={reminders} onValueChange={toggle} trackColor={{ true: C.ink, false: '#CFCCC5' }} thumbColor={reminders ? C.mark : '#F6F5F2'} ios_backgroundColor="#CFCCC5" />
                </View>
                {denied ? <Txt size={11} color={C.red} style={{ marginTop: 8 }}>{t(lang, 'remindersDenied')}</Txt> : null}
              </Section>
            ) : null}

            <Section my="အကြောင်း" en="About">
              <Txt size={12} style={{ marginTop: 6 }}>{t(lang, 'aboutText')}</Txt>
            </Section>
            <Section my="ကိုယ်ရေးအချက်အလက်" en="Privacy">
              <Txt size={12} style={{ marginTop: 6 }}>{t(lang, 'privacyText')}</Txt>
            </Section>

            <Txt size={9.5} caps color={C.soft} style={{ marginTop: 22, textAlign: 'right' }}>
              {`Design by IT Garden Malaysia (RN) · v${version}`}
            </Txt>
          </View>
        </Paper>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ my, en, children }: { my: string; en: string; children: React.ReactNode }) {
  return (
    <View style={st.section}>
      <Txt size={14}>{my}</Txt>
      <Txt size={9} caps weight="medium" color={C.soft}>{en}</Txt>
      {children}
    </View>
  );
}

const st = StyleSheet.create({
  section: { marginTop: 18, paddingTop: 12, borderTopWidth: 2 * StyleSheet.hairlineWidth, borderTopColor: C.line },
});
