import React from 'react';
import { ImageBackground, Text, View } from 'react-native';

// Big banner header with a single title. Used on landing-page-style screens
// where the photo carries the brand and the title sits at the bottom.
//
// The dark overlay (rgba black at 15% alpha) is just enough to keep white
// text readable over light parts of the banner without muddying the image.

function Header({ title }: { title: string }) {
  return (
    <ImageBackground
      source={require('@assets/banner2.jpg')}
      resizeMode="cover"
      style={{
        width: '100%',
        height: 300,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.15)',
          paddingHorizontal: 20,
          paddingTop: 50,
        }}
      >
        {/* marginTop: 'auto' pins the title to the bottom of the banner */}
        <View style={{ marginTop: 'auto', marginBottom: 35 }}>
          <Text className="font-spaceMedium text-white text-4xl leading-[44px]">
            {title}
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

export default Header;
