import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 70,
  },

  /* Grid */
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.08,
  },

  gridDot: {
    width: 24,
    height: 24,
    borderWidth: 0.5,
    borderColor: '#FFFFFF30',
  },

  /* Badge */
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B7CFF',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
  },

  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 18,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '400',
  },

  /* Button */
  button: {
    marginTop: 34,
    alignSelf: 'flex-start',
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 26,
    paddingRight: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#00FF00',
  },

  buttonText: {
    color: '#00FF00',
    fontSize: 16,
    fontWeight: '400',
    marginRight: 16,
  },

  arrowWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Cards */
  cardsWrapper: {
    marginTop: 60,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 22,
    paddingBottom: 60,
  },

  card: {
    width: '47%',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 18,
    alignItems: 'center',
    minHeight: 150,
  },

  cardTitle: {
    fontSize: 14,
    color: '#222222',
    textAlign: 'center',
    marginBottom: 7,
    fontWeight: '500',
  },

  cardImage: {
    width: 55,
    height: 55,
    marginBottom: 7,
  },

  cardSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});
