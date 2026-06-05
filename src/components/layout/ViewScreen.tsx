import { ScrollView, View } from 'react-native';
import { SCREEN_HEIGHT } from '@/utils/helpers';

// Generic scrollable screen container. Most screens go through AppNavigator's
// screenLayout (which already wraps in ScrollView + Footer), so this is only
// used by screens rendered OUTSIDE the navigator — like full-screen modals
// or success/error overlays.
//
// The -100 accounts for the navbar so the first child isn't hidden behind it.
// `paddingBottom: 120` ensures the last child clears any tab bar / footer.

function ViewScreen({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ minHeight: SCREEN_HEIGHT - 100 }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {children}
      </ScrollView>
    </View>
  );
}

export default ViewScreen;
