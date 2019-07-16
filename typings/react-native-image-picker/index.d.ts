declare module "react-native-image-picker" {
  export interface IResponse {
    customButton: string;
    didCancel: boolean;
    error: string;
    data: string;
    uri: string;
    origURL?: string;
    isVertical: boolean;
    width: number;
    height: number;
    fileSize: number;
    type?: string;
    fileName?: string;
    path?: string;
    latitude?: number;
    longitude?: number;
    timestamp?: string;
  }

  export interface CustomButtonOptions {
    name?: string;
    title?: string;
  }

  export interface Options {
    title?: string;
    cancelButtonTitle?: string;
    takePhotoButtonTitle?: string;
    chooseFromLibraryButtonTitle?: string;
    customButtons?: CustomButtonOptions[];
    cameraType?: "front" | "back";
    mediaType?: "photo" | "video" | "mixed";
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    videoQuality?: "low" | "medium" | "high";
    durationLimit?: number;
    rotation?: number;
    allowsEditing?: boolean;
    noData?: boolean;
    storageOptions?: StorageOptions;
  }

  export interface StorageOptions {
    skipBackup?: boolean;
    path?: string;
    cameraRoll?: boolean;
    waitUntilSaved?: boolean;
  }

  export function showImagePicker(
    options: Options,
    callback: (response: IResponse) => void
  ): void;
  export function launchCamera(
    options: Options,
    callback: (response: IResponse) => void
  ): void;
  export function launchImageLibrary(
    options: Options,
    callback: (response: IResponse) => void
  ): void;
}
