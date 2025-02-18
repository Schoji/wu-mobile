/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#03df37d2';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#030303',
    grayedText: '#8f8f8f',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FEFEFE',
    grayedText: '#8f8f8f',
    grayedText2: 'rgba(3, 3, 3, .5)',
    greenText: '#52BF59',
    redText: '#E04C58',
    background: '#1e1e1e',
    container: '#343434',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
export const accentColor: string = '#DAF9FF';
export const gradientColors: [string, string] = ['#72ec8ab9', '#03df37d2'];
export const scheduleColors = ['#AEE4FF', '#C8A7FF', '#FAD6A5', '#B4F7B4', '#FFDAFB', '#FCFFA7']
