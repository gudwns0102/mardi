import { AudioRecorder, AudioUtils } from "react-native-audio";
import { exists, unlink } from "react-native-fs";

import { isAndroid } from "src/utils/Platform";

export const audioDirectory = AudioUtils.CachesDirectoryPath;
export const audioFileName = "test.aac";
export const audioPath = [audioDirectory, audioFileName].join("/");
export const audioPathToFormUri = (uri: string) =>
  isAndroid() ? `file://${uri}` : uri;

export const REPLY_RECORD_TIME = 60;
export const INTRO_RECORD_TIME = 60;
export const CONTENT_RECORD_TIME = 180;

export const prepareRecordingAtPath = async () => {
  AudioRecorder.prepareRecordingAtPath(audioPath, {
    SampleRate: 22050,
    Channels: 1,
    AudioQuality: "Low",
    AudioEncoding: "aac",
    OutputFormat: "aac_adts"
  });
};

export const clearAudioFile = async () => {
  const isExisted = await exists(audioPath);
  if (!isExisted) {
    return;
  }
  await unlink(audioPath);
  return;
};
