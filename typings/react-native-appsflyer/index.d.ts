declare module "react-native-appsflyer" {
  const initSdk: (
    option: any,
    onSuccess: (result: any) => any,
    onError: (error: any) => any
  ) => Promise<any>;
}
