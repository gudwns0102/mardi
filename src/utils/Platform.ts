import { Platform } from "react-native";

const OS = Platform.OS;

export const isAndroid = () => OS === "android";
export const isIos = () => OS === "ios";
export const getPlatform = () => OS;
