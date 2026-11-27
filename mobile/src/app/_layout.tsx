import { MartianMono_300Light, MartianMono_400Regular, MartianMono_500Medium, MartianMono_700Bold } from '@expo-google-fonts/martian-mono';
import { NotoSansMyanmar_400Regular, NotoSansMyanmar_700Bold, useFonts } from '@expo-google-fonts/noto-sans-myanmar';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider, useSettings } from '../lib/settings';
import { C } from '../lib/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    NotoSansMyanmar_400Regular, NotoSansMyanmar_700Bold,
    MartianMono_300Light, MartianMono_400Regular, MartianMono_500Medium, MartianMono_700Bold,
  });
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <StatusBar style="dark" />
        {fontsLoaded ? <Root /> : <Loading />}
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

function Root() {
  const { ready } = useSettings();
  if (!ready) return <Loading />;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.backdrop } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="day/[date]" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

function Loading() {
  return (
    <View style={{ flex: 1, backgroundColor: C.backdrop, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={C.red} />
    </View>
  );
}
