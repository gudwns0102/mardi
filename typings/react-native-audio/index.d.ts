declare module "react-native-audio" {
  const AudioRecorder: {
    prepareRecordingAtPath: (...args: any[]) => any;
    startRecording: () => any;
    pauseRecording: () => any;
    resumeRecording: () => any;
    stopRecording: () => any;
    checkAuthorizationStatus: () => any;
    requestAuthorization: () => any;
    removeListeners: () => any;
    progressSubscription: () => any;
    setProgressUpdateInterval: (ms: number) => any;
    onProgress: any;
  };

  const AudioUtils: {
    MainBundlePath: string;
    CachesDirectoryPath: string;
    DocumentDirectoryPath: string;
    LibraryDirectoryPath: string;
  };
}
