import React from 'react';
import { Text, View } from 'react-native';
import banner from '@assets/banner.mp4';
import Video from 'react-native-video';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import service1 from '@assets/service1.jpg';
import service2 from '@assets/service2.jpg';
import service3 from '@assets/service3.jpg';
import HeroCard from './HeroCard';
import Swiper from 'react-native-swiper';

// Hero section is the landing page above-the-fold:
//   - Looping muted video as the background
//   - Hindi title + CTA button + tagline overlaid
//   - Auto-advancing carousel of service cards along the bottom
// The dim overlay (#00000050) is what keeps white text readable against the
// brighter parts of the video.

const data = [
  {
    image: service1,
    title: 'Solar Power Plants',
  },
  {
    image: service2,
    title: 'Solar Water Pump',
  },
  {
    image: service3,
    title: 'Solarisation of Feeders',
  },
];

function HeroSection() {
  return (
    <View
      style={{
        height: SCREEN_HEIGHT,
      }}
    >
      <Video
        source={banner}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
        }}
        resizeMode="cover"
        repeat
        muted
        paused={false}
      />
      <View
        style={{
          paddingTop: 100,
          height: SCREEN_HEIGHT,
          backgroundColor: '#00000050',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingVertical: 60,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: 800,
            textAlign: 'center',
            color: '#ffffff',
            paddingTop: 50,
          }}
        >
          प्रधानमंत्री <Text style={{ color: '#7DFF73' }}>किसान ऊर्जा</Text>{' '}
          सुरक्षा एवं उत्थान महाअभियान
        </Text>

        <Button
          title="पी एम - कुसुम"
          size="lg"
          style={{ paddingVertical: 10, marginVertical: 24 }}
        />
        <Text style={{ color: '#ffffff', fontSize: 20 }}>
          सोलर पंप बनेगा अतिरिक्त आय का माध्यम
        </Text>

        <Swiper
          autoplay
          loop
          showsPagination
          autoplayTimeout={3}
          dotStyle={{
            backgroundColor: '#ffffff50',
            width: 8,
            height: 8,
          }}
          activeDotStyle={{
            backgroundColor: '#ffffff',
            width: 10,
            height: 10,
          }}
          paginationStyle={{
            bottom: 70,
          }}
          containerStyle={{
            marginTop: 150,
          }}
        >
          {data?.map((item: any, index: number) => (
            <View
              key={index}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <HeroCard key={index} image={item?.image} title={item?.title} />
            </View>
          ))}
        </Swiper>
      </View>
    </View>
  );
}

export default HeroSection;
