const development = {
  baseURL: "https://api-dev.mardi.life",
  privacyPolicy: "https://dev.mardi.life/privacy-policy",
  termsOfUse: "https://dev.mardi.life/terms-of-use",
  share: (id: number) => `https://dev.mardi.life/share?id=${id}`,
  onesignal: "017d3db2-885a-4ea0-830a-fe77837e758f",
  aboutMardi:
    "https://mardi-dev.s3.ap-northeast-2.amazonaws.com/uploads/mardi.aac"
};

const production = {
  baseURL: "https://api.mardi.life/v2",
  privacyPolicy: "https://mardi.life/privacy-policy",
  termsOfUse: "https://mardi.life/terms-of-use",
  share: (id: number) => `https://mardi.life/share?id=${id}`,
  onesignal: "2db2de67-a189-4fb1-8fc5-b7031dbd268d",
  aboutMardi:
    "https://mardi-v2.s3.ap-northeast-2.amazonaws.com/uploads/mardi.mp3"
};

export const isProduction = () => false; // !__DEV__;
export const isDevelopment = () => true; // __DEV__;

export const environment = isProduction() ? production : development;
