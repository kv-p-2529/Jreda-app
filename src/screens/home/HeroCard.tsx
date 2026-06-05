import Button from '@/components/ui/Button';
import { SCREEN_WIDTH } from '@/utils/helpers';
import { Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function HeroCard({
  image,
  title,
  buttonTitle = 'Apply Now',
}: {
  image: any;
  title: string;
  buttonTitle?: string;
}) {
  return (
    <View
      style={{
        width: SCREEN_WIDTH * 0.9,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.35)',
        backgroundColor: 'rgba(255,255,255,0.12)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <LinearGradient
        colors={[
          'rgba(255,255,255,0.25)',
          'rgba(255,255,255,0.08)',
          'rgba(255,255,255,0.18)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View
        style={{
          height: 1,
          backgroundColor: 'rgba(255,255,255,0.45)',
        }}
      />

      <View
        style={{
          padding: 15,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <Image
          source={image}
          resizeMode="cover"
          style={{
            width: 140,
            height: 140,
            borderRadius: 15,
          }}
        />

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            gap: 20,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              color: '#ffffff',
              fontWeight: '700',
              flexShrink: 1,
            }}
          >
            {title}
          </Text>

          <Button
            title={buttonTitle}
            variant="secondary"
            textClassName="text-black"
            style={{
              paddingVertical: 10,
              backgroundColor: '#ffffff',
              width: 160,
            }}
          />
        </View>
      </View>
    </View>
  );
}
