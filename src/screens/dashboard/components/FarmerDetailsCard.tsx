import React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import Svg, { Path } from 'react-native-svg';

export type FarmerDetails = {
  name: string;
  fatherName: string;
  applicationId: string;
  pumpInfo: string;
  mobile: string;
  location: string;
  company?: string;
};

interface FarmerDetailsCardProps {
  farmer: FarmerDetails;
  onEdit?: () => void;
}

function Chip({
  icon,
  label,
  fullWidth,
}: {
  icon: string;
  label: string;
  fullWidth?: boolean;
}) {
  return (
    <View
      className="rounded-lg flex-row items-center px-3 py-2.5"
      style={{
        backgroundColor: '#F6F9FE',
        width: fullWidth ? '100%' : '48.5%',
        marginBottom: 8,
      }}
    >
      {icon === 'custom' ? (
        <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <Path
            d="M9.08333 3.25H7.41667C6.63083 3.25 6.23833 3.25 5.99417 3.49417C5.75 3.73833 5.75 4.13083 5.75 4.91667V6.58333C5.75 7.36917 5.75 7.76167 5.99417 8.00583C6.23833 8.25 6.63083 8.25 7.41667 8.25H9.08333C9.86917 8.25 10.2617 8.25 10.5058 8.00583C10.75 7.76167 10.75 7.36917 10.75 6.58333V4.91667C10.75 4.13083 10.75 3.73833 10.5058 3.49417C10.2617 3.25 9.86917 3.25 9.08333 3.25Z"
            stroke="#0082FD"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <Path
            d="M4.91602 16.5833H11.5827M9.49935 8.25H6.99935V16.5833H9.49935V8.25Z"
            stroke="#0082FD"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M10.75 4.5H14.0833C14.7464 4.5 15.3823 4.76339 15.8511 5.23223C16.3199 5.70107 16.5833 6.33696 16.5833 7V9.08333H14.0833V7H10.75V4.5Z"
            stroke="#0082FD"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <Path
            d="M10.75 0.75H6.25C5.19833 0.75 4.6725 0.75 4.25833 1.01917C3.84417 1.28833 3.63083 1.76917 3.20333 2.72917L0.75 8.25"
            stroke="#0082FD"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M15.334 11.5833L15.799 11.1666C15.7404 11.1014 15.6687 11.0492 15.5886 11.0134C15.5084 10.9777 15.4217 10.9592 15.334 10.9592C15.2463 10.9592 15.1595 10.9777 15.0794 11.0134C14.9993 11.0492 14.9276 11.1014 14.869 11.1666L15.334 11.5833ZM15.959 13.6666C15.959 13.8324 15.8931 13.9913 15.7759 14.1086C15.6587 14.2258 15.4997 14.2916 15.334 14.2916V15.5416C15.8313 15.5416 16.3082 15.3441 16.6598 14.9924C17.0114 14.6408 17.209 14.1639 17.209 13.6666H15.959ZM15.334 14.2916C15.1682 14.2916 15.0093 14.2258 14.892 14.1086C14.7748 13.9913 14.709 13.8324 14.709 13.6666H13.459C13.459 14.1639 13.6565 14.6408 14.0082 14.9924C14.3598 15.3441 14.8367 15.5416 15.334 15.5416V14.2916ZM14.709 13.6666C14.709 13.6691 14.709 13.6408 14.7315 13.5741C14.752 13.5097 14.7865 13.4302 14.8348 13.3358C14.9323 13.1466 15.069 12.9358 15.2165 12.7308C15.3959 12.4827 15.5867 12.243 15.7882 12.0124L15.7965 12.0024L15.799 12.0008L15.334 11.5833L14.869 11.1666H14.8673L14.8632 11.1708L14.8515 11.1849C14.7859 11.26 14.7211 11.3358 14.6573 11.4124C14.534 11.5608 14.369 11.7683 14.2015 12.0008C14.0365 12.2299 13.8598 12.4974 13.724 12.7633C13.5973 13.0083 13.459 13.3374 13.459 13.6666H14.709ZM15.334 11.5833L14.869 11.9999L14.8707 12.0024L14.879 12.0124C14.9367 12.0775 14.9931 12.1436 15.0482 12.2108C15.159 12.3441 15.3065 12.5283 15.4515 12.7308C15.599 12.9358 15.7348 13.1466 15.8332 13.3358C15.8815 13.4302 15.9159 13.5097 15.9365 13.5741C15.9582 13.6408 15.959 13.6691 15.959 13.6666H17.209C17.209 13.3374 17.0707 13.0099 16.9448 12.7641C16.8039 12.4985 16.6441 12.2434 16.4665 12.0008C16.263 11.7188 16.0461 11.4469 15.8165 11.1858L15.804 11.1716L15.8007 11.1666L15.334 11.5833Z"
            fill="#0082FD"
          />
          <Path
            d="M8.25 0.75V3.25"
            stroke="#0082FD"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : (
        <Ionicons name={icon as any} size={16} color="#1382F5" />
      )}
      <Text
        className="text-[#1B1B1B] text-[12.5px] ml-2 flex-1"
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export default function FarmerDetailsCard({ farmer }: FarmerDetailsCardProps) {
  return (
    <View
      className="mx-4 mt-4"
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
      }}
    >
      {/* BLUE HEADER */}
      <LinearGradient
        colors={['#1382F5', '#0047B8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          borderRadius: 16,
          padding: 16,
        }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white text-[18px] font-spaceBold">
            Farmer Details
          </Text>
          <View className="w-9 h-9 rounded-full items-center justify-center">
            <Svg width={20} height={20} viewBox="0 0 31 31" fill="none">
              <Path
                d="M12.6667 18.5H8.29167C6.3578 18.5 4.50313 19.2682 3.13568 20.6357C1.76823 22.0031 1 23.8578 1 25.7917V27.25H12.7396M23.6042 18.5V16.6771M23.6042 18.5C22.4438 18.5 21.331 18.9609 20.5106 19.7814C19.6901 20.6019 19.2292 21.7147 19.2292 22.875C19.2292 24.0353 19.6901 25.1481 20.5106 25.9686C21.331 26.7891 22.4438 27.25 23.6042 27.25M23.6042 18.5C24.7645 18.5 25.8773 18.9609 26.6978 19.7814C27.5182 20.6019 27.9792 21.7147 27.9792 22.875C27.9792 24.0353 27.5182 25.1481 26.6978 25.9686C25.8773 26.7891 24.7645 27.25 23.6042 27.25M23.6042 27.25V29.0729M19.8154 20.6875L18.236 19.776M27.3929 25.0625L28.9723 25.974M27.3929 20.6875L28.9723 19.776M19.8125 25.0625L18.2346 25.974M19.9583 7.5625C19.9583 9.30298 19.2669 10.9722 18.0362 12.2029C16.8055 13.4336 15.1363 14.125 13.3958 14.125C11.6553 14.125 9.98615 13.4336 8.75545 12.2029C7.52474 10.9722 6.83333 9.30298 6.83333 7.5625C6.83333 5.82202 7.52474 4.15282 8.75545 2.92211C9.98615 1.6914 11.6553 1 13.3958 1C15.1363 1 16.8055 1.6914 18.0362 2.92211C19.2669 4.15282 19.9583 5.82202 19.9583 7.5625Z"
                stroke="#B4FFB4"
                strokeWidth={2}
                strokeLinecap="square"
              />
            </Svg>
          </View>
        </View>

        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
            <Ionicons name="person" size={26} color="#fff" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-white text-[22px] font-extrabold">
              {farmer.name}
            </Text>
            <Text className="text-white/85 text-[13px] mt-0.5">
              S/O {farmer.fatherName}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* CHIPS PANEL */}
      <View className="px-3 pt-3 pb-1">
        <View className="flex-row flex-wrap justify-between">
          <Chip icon="menu-outline" label={farmer.applicationId} />
          <Chip icon="custom" label={farmer.pumpInfo} />
          <Chip icon="call-outline" label={farmer.mobile} />
          <Chip icon="location-outline" label={farmer.location} />
          {farmer.company && (
            <Chip icon="business-outline" label={farmer.company} fullWidth />
          )}
        </View>
      </View>
    </View>
  );
}
