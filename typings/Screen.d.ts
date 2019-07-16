interface IScreenProps<IParams> {
  navigation: import("react-navigation").NavigationScreenProp<any, IParams>;
}

interface IScreenOptions {
  statusBarProps?: import("react-native").StatusBarProps;
  forceInset?: import("react-navigation").SafeAreaViewProps["forceInset"];
}
