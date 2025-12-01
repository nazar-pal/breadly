import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial
} from '@expo/vector-icons'
import { TextProps } from 'react-native'

export const IconComponents = {
  antdesign: AntDesign,
  'material-icons': MaterialIcons,
  'material-community-icons': MaterialCommunityIcons,
  ionicons: Ionicons,
  feather: Feather,
  evilicons: EvilIcons,
  entypo: Entypo,
  fontawesome6: FontAwesome6,
  fontawesome5: FontAwesome5,
  fontawesome: FontAwesome,
  fontisto: Fontisto,
  foundation: Foundation,
  octicons: Octicons,
  'simple-line-icons': SimpleLineIcons,
  zocial: Zocial
} as const

export type IconType = keyof typeof IconComponents

export type IconNameType<T extends IconType> = T extends 'antdesign'
  ? keyof typeof AntDesign.glyphMap
  : T extends 'material-icons'
    ? keyof typeof MaterialIcons.glyphMap
    : T extends 'ionicons'
      ? keyof typeof Ionicons.glyphMap
      : T extends 'feather'
        ? keyof typeof Feather.glyphMap
        : T extends 'evilicons'
          ? keyof typeof EvilIcons.glyphMap
          : T extends 'entypo'
            ? keyof typeof Entypo.glyphMap
            : T extends 'fontawesome6'
              ? keyof typeof FontAwesome6.glyphMap
              : T extends 'fontawesome5'
                ? keyof typeof FontAwesome5.glyphMap
                : T extends 'fontawesome'
                  ? keyof typeof FontAwesome.glyphMap
                  : T extends 'fontisto'
                    ? keyof typeof Fontisto.glyphMap
                    : T extends 'foundation'
                      ? keyof typeof Foundation.glyphMap
                      : T extends 'octicons'
                        ? keyof typeof Octicons.glyphMap
                        : T extends 'simple-line-icons'
                          ? keyof typeof SimpleLineIcons.glyphMap
                          : T extends 'zocial'
                            ? keyof typeof Zocial.glyphMap
                            : never

export type IconProps<T extends IconType = IconType> = {
  select: {
    from: T
    name: IconNameType<T>
  }
  size?: number
  color?: string
  className?: string
} & Omit<TextProps, 'children'>
