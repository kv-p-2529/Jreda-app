import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';

import compA from '@assets/compA.png';
import compB from '@assets/compB.png';
import compC from '@assets/compC.png';
import compD from '@assets/compD.png';

// Dark-themed "About PM-KUSUM" section. Two visual tricks here:
//   - The 180-cell grid overlay (lines 65-70) creates a faint subway-map
//     pattern that gives the dark background texture without an image.
//   - Each component card uses a per-component LinearGradient so the cards
//     feel visually distinct while sharing layout.
// `components` carries the data + the gradient stops + the brand color for
// the subtitle text, all in one place.

const components = [
  {
    id: 1,
    title: 'Grid Connected Solar Power Plants',
    subtitle: 'Component A',
    image: compA,
    colors: ['#D7FFD5', '#E8FFE7', '#ffffff'],
    textColor: '#00C400',
  },
  {
    id: 2,
    title: 'Off Grid Solar Pumps',
    subtitle: 'Component B',
    image: compB,
    colors: ['#E7D2FF', '#F5E9FF', '#ffffff'],
    textColor: '#5A2DBD',
  },
  {
    id: 3,
    title: 'Grid Connected Solar Pumps',
    subtitle: 'Component C (IPS)',
    image: compC,
    colors: ['#D5E8FF', '#EAF3FF', '#ffffff'],
    textColor: '#1677FF',
  },
  {
    id: 4,
    title: 'Solarization Of Feeders',
    subtitle: 'Component C (FLS)',
    image: compD,
    colors: ['#FFE1BF', '#FFF1E2', '#ffffff'],
    textColor: '#FF6B00',
  },
];

export default function PMKusumSection() {
  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={['#17391D', '#032A09', '#001F05']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Grid Overlay */}
      <View style={styles.gridContainer}>
        {Array.from({ length: 180 }).map((_, index) => (
          <View key={index} style={styles.gridDot} />
        ))}
      </View>

      {/* Badge */}
      <View style={styles.badge}>
        <View style={styles.badgeDot} />

        <Text style={styles.badgeText}>About</Text>
      </View>

      {/* Heading */}
      <Text style={styles.heading}>PM-KUSUM</Text>

      {/* Description */}
      <Text style={styles.description}>
        Pradhan Mantri Kisan Urja Suraksha evam Utthan Mahabhiyan (PM-KUSUM)
        Scheme for de-dieselisation of farm sector and enhancing the income of
        farmers. Under the Scheme, central government subsidy upto 30% or 50% of
        the total cost is given for the installation of standalone solar pumps
        and also for the solarization of existing grid-connected agricultural
        pumps.
      </Text>

      {/* Button */}
      <TouchableOpacity activeOpacity={0.8}>
        <LinearGradient
          colors={['#003B00', '#002000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Read More</Text>

          <LinearGradient
            colors={['#00FF00', '#00C400']}
            style={styles.arrowWrapper}
          >
            <Ionicons
              name="arrow-forward"
              size={18}
              color="#FFFFFF"
              style={{ transform: 'rotateZ(-45deg)' }}
            />
          </LinearGradient>
        </LinearGradient>
      </TouchableOpacity>

      {/* Cards */}
      <View style={styles.cardsWrapper}>
        {components.map(item => (
          <LinearGradient
            key={item.id}
            colors={item.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>

            <Image
              source={item.image}
              resizeMode="contain"
              style={styles.cardImage}
            />

            <Text
              style={[
                styles.cardSubtitle,
                {
                  color: item.textColor,
                },
              ]}
              className="font-spaceSemiBold"
            >
              {item.subtitle}
            </Text>
          </LinearGradient>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
