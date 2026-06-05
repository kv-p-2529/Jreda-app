import { Alert, Dimensions, Platform, ToastAndroid } from 'react-native';

// Captured once at module load. RN reports the wrong dimensions if you read
// these during render on some Android versions when the keyboard is open,
// so we snapshot at import time. If you need responsive-to-rotation values,
// use the `useWindowDimensions` hook from RN directly instead.
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

// Lightweight toast: native Toast on Android, Alert fallback elsewhere.
function showToast(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(message);
  }
}

export { SCREEN_HEIGHT, SCREEN_WIDTH, showToast };
