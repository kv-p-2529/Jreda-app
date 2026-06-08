import { ImageSourcePropType } from 'react-native';

import socialBanner from '@assets/social/social1.png';
import videoThumbnail from '@assets/video/video1.png';
import videoSource from '@assets/video/video1.mp4';

export type SocialItem =
  | {
      id: number;
      type: 'image';
      image: ImageSourcePropType;
    }
  | {
      id: number;
      type: 'content';
      title: string;
      description: string;
      image?: ImageSourcePropType;
    };

export const socialMediaData: SocialItem[] = [
  {
    id: 1,
    type: 'image',
    image: socialBanner,
  },
  {
    id: 2,
    type: 'content',
    title: 'MNRE launched new PM-KUSUM initiative for farmers.',
    description:
      'Government announced additional subsidy support for solar pumps across rural regions.',
    image: socialBanner,
  },
  {
    id: 3,
    type: 'content',
    title: 'New scheme rolled out for solar feeder solarisation.',
    description:
      'Eligible farmers can register through the official portal and avail benefits this quarter.',
  },
];

export const videoGalleryData = [
  {
    id: 1,
    thumbnail: videoThumbnail,
    video: videoSource,
  },
  {
    id: 2,
    thumbnail: videoThumbnail,
    video: videoSource,
  },
  {
    id: 3,
    thumbnail: videoThumbnail,
    video: videoSource,
  },
];

export const SOCIAL_SLIDE_HEIGHT = 320;
export const VIDEO_SLIDE_HEIGHT = 320;
