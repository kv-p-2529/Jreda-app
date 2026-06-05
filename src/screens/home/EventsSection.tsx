import React, { useRef, useState } from 'react';
import {
  ImageBackground,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons';

import event1 from '@assets/event/event1.png';
import { SCREEN_WIDTH } from '@/utils/helpers';

// "Events & Meetings" — snap-paging horizontal carousel.
// We compute SNAP_INTERVAL = card width + gap so each swipe lands cleanly
// on the next card instead of a random offset. The dot pagination tracks
// the scroll position via onMomentumScrollEnd (not onScroll) to avoid
// updating state on every pixel of movement.

const events = [
  {
    id: 1,
    title: 'Chintan Shivir',
    image: event1,
  },
  {
    id: 2,
    title: 'Regional Workshop Mumbai',
    image: event1,
  },
  {
    id: 3,
    title: 'Regional Workshop Jaipur',
    image: event1,
  },
];

const CARD_WIDTH = SCREEN_WIDTH - 80;
const CARD_GAP = 16;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

function EventsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / SNAP_INTERVAL);
    if (index !== activeIndex) setActiveIndex(index);
  };

  return (
    <ImageBackground
      source={require('@assets/linesBg.png')}
      resizeMode="cover"
      style={{ backgroundColor: '#FAFDFF' }}
    >
      <View className="py-10">
        {/* TITLE */}
        <Text className="text-center font-spaceSemiBold text-[32px] font-black text-[#45435D] mb-8">
          Events & Meetings
        </Text>

        {/* CARDS */}
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={SNAP_INTERVAL}
          snapToAlignment="start"
          onMomentumScrollEnd={onScroll}
          contentContainerStyle={{
            paddingHorizontal: 32,
            paddingVertical: 8,
          }}
        >
          {events.map((event, index) => (
            <View
              key={event.id}
              style={{
                width: CARD_WIDTH,
                marginRight: index === events.length - 1 ? 0 : CARD_GAP,
              }}
              className="bg-white rounded-[32px] overflow-hidden"
            >
              {/* IMAGE */}
              <View className="p-3">
                <View className="rounded-[24px] overflow-hidden relative">
                  <Image
                    source={event.image}
                    style={{ width: '100%', height: 280 }}
                    resizeMode="cover"
                  />

                  {/* ARROW BUTTON */}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    className="absolute bottom-4 right-4 w-12 h-12 rounded-full border-[2px] border-white items-center justify-center"
                  >
                    <Ionicons
                      name="arrow-up-outline"
                      size={22}
                      color="#fff"
                      style={{ transform: [{ rotate: '45deg' }] }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* TITLE */}
              <Text className="text-center text-[#1B1B1B] text-[22px] font-spaceSemiBold font-bold pb-7 pt-2">
                {event.title}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* PAGINATION */}
        <View className="flex-row justify-center mt-6">
          {events.map((_, index) => (
            <View
              key={index}
              className={`w-3 h-3 rounded-full mx-1 ${
                index === activeIndex ? 'bg-[#1382F5]' : 'bg-[#9EC9F8]'
              }`}
            />
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

export default EventsSection;
