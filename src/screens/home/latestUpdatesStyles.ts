import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F8FB',
    borderColor: '#E9E9E9',
    borderRadius: 14,
    padding: 10,
    margin: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },

  heading: {
    fontSize: 24,
    color: '#111111',
  },

  flashIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentWrapper: {
    flexDirection: 'row',
    gap: 18,
    maxHeight: 420,
  },

  leftIconWrapper: {
    width: 55,
    height: 55,
    borderRadius: 36,
    backgroundColor: '#EAF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 4,
  },

  badge: {
    backgroundColor: '#0B7CFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },

  dateText: {
    color: '#7C8592',
    fontSize: 15,
    fontWeight: '500',
  },

  description: {
    color: '#5D6674',
    fontSize: 17,
    lineHeight: 30,
    fontWeight: '500',
  },
});
