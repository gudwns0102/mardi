import _ from "lodash";
import React from "react";
// import { RNCamera } from "react-native-camera";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { images } from "assets/images";
import { IconButton } from "../components/buttons/IconButton";

interface IParams {
  callback: (uri: string) => any;
}

interface IProps {
  navigation: NavigationScreenProp<any, IParams>;
}

const Container = styled.View`
  width: 100%;
  flex: 1;
`;

// const Camera = styled(RNCamera)`
//   width: 100%;
//   flex: 1;
// `;

const CameraButton = styled(IconButton).attrs({ source: images.camera })`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: transparent;
  bottom: 50px;
  align-self: center;
`;

export class CameraScreen extends React.Component<IProps> {
  // public cameraRef = React.createRef<RNCamera>();
  public render() {
    return (
      <Container>
        {/* <Camera
          ref={this.cameraRef}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          permissionDialogTitle={"마디에서 카메라 사용을 요청합니다."}
          permissionDialogMessage={
            "마디에서 컨텐츠 및 프로필 사진을 위해서 카메라 사용을 요청합니다."
          }
        /> */}
        <CameraButton onPress={this.takePicture} />
      </Container>
    );
  }

  private takePicture = async () => {
    // const { navigation } = this.props;
    // const callback = navigation.getParam("callback");
    // const options = { quality: 1, base64: true };
    // const data = await _.invoke(
    //   this.cameraRef.current,
    //   ["root", "takePictureAsync"],
    //   options
    // );

    // navigation.goBack(null);

    // callback(data.uri);
  };
}

export function navigateCameraScreen(
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) {
  navigation.push("CameraScreen", params);
}
