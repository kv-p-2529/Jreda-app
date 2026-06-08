import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';

import { components } from './pmKusumData';
import { styles } from './pmKusumStyles';

// Dark-themed "About PM-KUSUM" section. Two visual tricks here:
//   - The 180-cell grid overlay creates a faint subway-map pattern that gives
//     the dark background texture without an image.
//   - Each component card uses a per-component LinearGradient so the cards
//     feel visually distinct while sharing layout.
// Card data + styles live in pmKusumData.ts / pmKusumStyles.ts.

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
