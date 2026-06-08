import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import Video from 'react-native-video';
import Swiper from 'react-native-swiper';

import FullscreenMediaModal from './FullscreenMediaModal';
import {
  SOCIAL_SLIDE_HEIGHT,
  VIDEO_SLIDE_HEIGHT,
  socialMediaData,
  videoGalleryData,
} from './socialAndVideoData';

// Two stacked carousels: Social Media posts and Video Gallery thumbnails.
// Tapping a video thumbnail opens a fullscreen video modal; tapping a social
// image opens it full-size. Both use the shared FullscreenMediaModal. The
// video itself only mounts when activeVideo is set, so we're not holding a
// video decoder open in the background the whole session. Carousel data lives
// in socialAndVideoData.ts.

function SocialAndVideoSection() {
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<ImageSourcePropType | null>(
    null,
  );

  const openVideo = (video: any) => setActiveVideo(video);
  const closeVideo = () => setActiveVideo(null);

  const openImage = (image: ImageSourcePropType) => setActiveImage(image);
  const closeImage = () => setActiveImage(null);

  return (
    <View className="px-4 my-8">
      {/* SOCIAL MEDIA */}
      <View className="shadow-lg  rounded-[32px] overflow-hidden mb-8">
        {/* HEADER */}
        <LinearGradient
          colors={['#1382F5', '#0047B8']}
          className="px-6 py-7 flex-row items-center justify-between"
        >
          <Text className="text-white text-[24px] font-black">
            Social Media
          </Text>

          <Ionicons name="share-social-outline" size={28} color="#fff" />
        </LinearGradient>

        {/* SWIPER */}
        <View
          className="p-5"
          style={{
            height: SOCIAL_SLIDE_HEIGHT + 60,
            backgroundColor: '#ffffff',
          }}
        >
          <Swiper
            loop={false}
            showsPagination
            dotStyle={{
              backgroundColor: '#D7D7D7',
              width: 8,
              height: 8,
            }}
            activeDotStyle={{
              backgroundColor: '#1382F5',
              width: 10,
              height: 10,
            }}
            paginationStyle={{ bottom: 6 }}
          >
            {socialMediaData.map(item => (
              <View
                key={item.id}
                className="bg-white rounded-[24px] overflow-hidden border border-[#E5E5E5] mx-1"
              >
                {/* CONTENT TEXT (only if content type) */}
                {item.type === 'content' && (
                  <View className="px-4 pb-3">
                    <Text className="text-[#004C97] text-[16px] font-black leading-7">
                      {item.title}
                    </Text>

                    <Text className="text-[#555] text-[13px] leading-6 mt-2">
                      {item.description}
                    </Text>
                  </View>
                )}

                {/* IMAGE — tap to view full size */}
                {item.type === 'image' && (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => openImage(item.image)}
                  >
                    <Image
                      source={item.image}
                      style={{
                        width: '100%',
                        height: SOCIAL_SLIDE_HEIGHT - 10,
                        backgroundColor: '#000000',
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}

                {/* CONTENT WITH OPTIONAL IMAGE — tap to view full size */}
                {item.type === 'content' && item.image && (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => openImage(item.image!)}
                  >
                    <Image
                      source={item.image}
                      style={{
                        width: '100%',
                        height: SOCIAL_SLIDE_HEIGHT - 80,
                        backgroundColor: '#000000',
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </Swiper>
        </View>
      </View>

      {/* VIDEO GALLERY */}
      <View className="shadow-lg rounded-[32px] overflow-hidden">
        {/* HEADER */}
        <LinearGradient
          colors={['#1382F5', '#0047B8']}
          className="px-6 py-7 flex-row items-center justify-between"
        >
          <Text className="text-white text-[24px] font-black">
            Video Gallery
          </Text>

          <Ionicons name="play-circle-outline" size={34} color="#fff" />
        </LinearGradient>

        {/* SWIPER */}
        <View
          className="p-5"
          style={{
            height: VIDEO_SLIDE_HEIGHT + 40,
            backgroundColor: '#ffffff',
          }}
        >
          <Swiper
            loop={false}
            showsPagination
            dotStyle={{
              backgroundColor: '#ffffff',
              width: 10,
              height: 10,
              borderWidth: 1,
              borderColor: '#D7D7D7',
            }}
            activeDotStyle={{
              backgroundColor: '#66FF33',
              width: 12,
              height: 12,
            }}
            paginationStyle={{ bottom: 18 }}
          >
            {videoGalleryData.map(item => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                onPress={() => openVideo(item.video)}
                className="rounded-[32px] overflow-hidden relative mx-1"
                style={{ height: VIDEO_SLIDE_HEIGHT }}
              >
                {/* THUMBNAIL */}
                <Image
                  source={item.thumbnail}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />

                {/* PLAY BUTTON */}
                <View className="absolute inset-0 items-center justify-center">
                  <View className="w-28 h-28 rounded-full bg-white items-center justify-center">
                    <Ionicons
                      name="play"
                      size={54}
                      color="#00C300"
                      style={{ marginLeft: 6 }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </Swiper>
        </View>
      </View>

      {/* VIDEO MODAL */}
      <FullscreenMediaModal visible={!!activeVideo} onClose={closeVideo}>
        <Pressable
          onPress={e => e.stopPropagation()}
          className="w-full aspect-video bg-black"
        >
          {activeVideo && (
            <Video
              source={activeVideo}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
              controls
              paused={false}
            />
          )}
        </Pressable>
      </FullscreenMediaModal>

      {/* IMAGE MODAL — full-size view of a tapped social image */}
      <FullscreenMediaModal visible={!!activeImage} onClose={closeImage}>
        {activeImage && (
          <Image
            source={activeImage}
            style={{ width: '100%', height: '80%' }}
            resizeMode="contain"
          />
        )}
      </FullscreenMediaModal>
    </View>
  );
}

export default SocialAndVideoSection;
