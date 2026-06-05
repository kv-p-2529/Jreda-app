import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { MAIN_LINKS, SOCIAL_LINKS, USEFUL_LINKS } from './layoutConstants';
import ministryLogo from '@assets/ministry.png';
import IonIcons from '@react-native-vector-icons/ionicons';
import Feather from '@react-native-vector-icons/feather';
import FontAwesome from '@react-native-vector-icons/fontawesome';

// Rendered once per screen via AppNavigator's screenLayout. Memoized because
// the content is static — props never change, so this never needs to re-render
// after first mount.
const Footer = React.memo(() => (
  <View className="bg-[#222222] px-5 pt-8 pb-6 ">
    <Text className="text-white font-bold text-3xl mb-3">PM-KUSUM</Text>

    <Text className="text-gray-400 text-sm leading-relaxed mb-5">
      Ministry of New and Renewable Energy (MNRE) has launched the Pradhan
      Mantri Kisan Urja Suraksha evam Utthan Mahabhiyan (PM-KUSUM) Scheme for
      farmers.
    </Text>

    <View className=" mb-7">
      <Image
        source={ministryLogo}
        resizeMode="contain"
        className="rounded-lg"
      />
    </View>

    <View className="flex-row gap-6 mb-7">
      <View className="flex-1">
        <Text className="text-white font-bold text-base mb-3">Main Links</Text>
        {MAIN_LINKS.map((link, index) => (
          <TouchableOpacity
            key={link.label}
            className="mb-2"
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm ${
                index === 0 ? 'text-green-500 font-semibold' : 'text-gray-300'
              }`}
            >
              {link.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-1">
        <Text className="text-white font-bold text-base mb-3">
          Useful Links
        </Text>
        {USEFUL_LINKS.map(link => (
          <TouchableOpacity
            key={link.label}
            className="mb-2"
            activeOpacity={0.7}
          >
            <Text className="text-gray-300 text-sm">{link.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>

    <Text className="text-white font-bold text-base mb-3">Contact</Text>

    <View className="flex-row items-center gap-2 mb-2">
      <IonIcons name="mail-outline" size={16} color={'#9CA3AF'} />
      <Text className="text-gray-300 text-sm">info@jreda.com</Text>
    </View>

    <View className="flex-row items-start gap-2 mb-6">
      <Feather name="map-pin" size={16} color={'#9CA3AF'} />
      <Text className="text-gray-300 text-sm leading-relaxed flex-1">
        3rd Floor, SLDC Building, Kusai, Doranda,{'\n'}
        Ranchi-834002. Jharkhand INDIA.
      </Text>
    </View>

    <View className="flex-row gap-3 mb-7">
      {SOCIAL_LINKS.map(social => (
        <TouchableOpacity
          key={social.icon}
          className={`w-10 h-10 rounded-full border-2 border-[#9CA3AF] items-center justify-center`}
          activeOpacity={0.7}
        >
          <FontAwesome name={social.icon} size={16} color={'#9CA3AF'} />
        </TouchableOpacity>
      ))}
    </View>

    <View className="h-px bg-gray-800 mb-4" />

    <Text className="text-gray-500 text-xs text-center leading-relaxed mb-2">
      झारखंड में सौर संबंध सभी कार्य के लिए झारखंड अक्षय विकास एजेंसी (जरेदा)
      राज्य सरकार द्वारा अधिकारी नोडल एजेंसी है जरेदा राज्य भर में अक्षय के
      विकास या नए अवसरो के खोज के लिए लगातर प्रयासरत है |
    </Text>

    <Text className="text-gray-600 text-xs text-center">Powered by SLS</Text>
  </View>
));

export default Footer;
