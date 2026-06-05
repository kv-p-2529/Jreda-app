import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';

// "Members" — Government officials cards. Each card is an ImageBackground
// (decorative frame) with the member's portrait positioned absolutely so it
// hangs slightly below the card edge for a magazine-cover feel.

const members = [
  {
    id: 1,
    name: 'Hemant Soren',
    designation: 'Chief Minister of Jharkhand',
    image: require('@/assets/member1.png'),
  },
  {
    id: 2,
    name: 'Shri Avinash Kumar',
    designation: 'Chief Secretary of Jharkhand',
    image: require('@/assets/member2.png'),
  },
];

export default function MembersSection() {
  return (
    <View style={styles.container}>
      {/* Heading */}
      <Text style={styles.heading} className="font-spaceSemiBold">
        MEMBERS
      </Text>

      {/* Underline */}
      <View style={styles.underline} />

      {/* Members */}
      <View style={styles.membersWrapper}>
        {members.map(member => (
          // key goes on the outermost mapped element (the wrapper View),
          // not the inner ImageBackground — otherwise React's list keying
          // is on the wrong node and reconciliation gets confused.
          <View
            key={member.id}
            style={{ width: '100%', overflow: 'hidden', borderRadius: 20 }}
          >
            <ImageBackground
              source={require('@assets/frame.png')}
              resizeMode="cover"
              style={{
                width: '100%',
                height: 150,
                borderRadius: 14,
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              {/* Member Image */}
              <View
                style={{
                  position: 'relative',
                  width: '40%',
                }}
              >
                <Image
                  source={member.image}
                  resizeMode="contain"
                  style={styles.memberImage}
                />
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.name}>{member.name}</Text>

                <Text style={styles.designation}>{member.designation}</Text>
              </View>
            </ImageBackground>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F8FB',
    borderColor: '#E9E9E9',
    borderRadius: 14,
    padding: 14,
    margin: 10,
  },

  heading: {
    fontSize: 40,
    color: '#111111',
  },

  underline: {
    width: 70,
    height: 5,
    borderRadius: 10,
    backgroundColor: '#0B7CFF',
    marginTop: 18,
    marginBottom: 40,
  },

  membersWrapper: {
    gap: 32,
  },

  card: {
    height: 230,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#0B7CFF',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
  },

  memberImage: {
    width: 130,
    height: 200,
    position: 'absolute',
    bottom: -45,
    resizeMode: 'contain',
  },

  content: {
    justifyContent: 'center',
    zIndex: 2,
    width: 200,
  },

  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 14,
    lineHeight: 28,
  },

  designation: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
    fontWeight: '400',
    width: '90%',
  },
});
