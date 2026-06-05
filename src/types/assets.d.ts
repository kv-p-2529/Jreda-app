// Type declarations for image/media imports so TypeScript stops complaining
// about `import logo from '@assets/logo.png'`. Metro handles the actual file
// resolution at bundle time; this file just shapes the types for the IDE.

declare module '*.mp4' {
  const content: any;
  export default content;
}

declare module '*.png' {
  import { ImageSourcePropType } from 'react-native';
  const value: ImageSourcePropType;
  export default value;
}

declare module '*.jpg' {
  import { ImageSourcePropType } from 'react-native';
  const value: ImageSourcePropType;
  export default value;
}

declare module '*.jpeg' {
  import { ImageSourcePropType } from 'react-native';
  const value: ImageSourcePropType;
  export default value;
}

declare module '*.gif' {
  import { ImageSourcePropType } from 'react-native';
  const value: ImageSourcePropType;
  export default value;
}

// SVGs go through react-native-svg-transformer and come back as components,
// not bitmaps — that's why this declaration is different from the others.
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.webp' {
  import { ImageSourcePropType } from 'react-native';
  const value: ImageSourcePropType;
  export default value;
}
