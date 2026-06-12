import AsyncStorage from '@react-native-async-storage/async-storage';

// Thin wrapper around AsyncStorage so every persistence call funnels through
// one place. Prefer these helpers over importing AsyncStorage directly.

export const setItem = (key: string, value: string): Promise<void> =>
  AsyncStorage.setItem(key, value);

export const getItem = (key: string): Promise<string | null> =>
  AsyncStorage.getItem(key);

export const removeItem = (key: string): Promise<void> =>
  AsyncStorage.removeItem(key);

export const clear = (): Promise<void> => AsyncStorage.clear();

export const getAllKeys = (): Promise<readonly string[]> =>
  AsyncStorage.getAllKeys();

// JSON convenience helpers — serialize on the way in, parse on the way out so
// callers can store/retrieve objects without repeating JSON.stringify/parse.

export const setObject = <T>(key: string, value: T): Promise<void> =>
  AsyncStorage.setItem(key, JSON.stringify(value));

export const getObject = async <T>(key: string): Promise<T | null> => {
  const raw = await AsyncStorage.getItem(key);
  return raw != null ? (JSON.parse(raw) as T) : null;
};

export default {
  setItem,
  getItem,
  removeItem,
  clear,
  getAllKeys,
  setObject,
  getObject,
};
