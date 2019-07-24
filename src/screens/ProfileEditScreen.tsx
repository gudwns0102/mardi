import _ from "lodash";
import { inject, observer } from "mobx-react";
import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import ImagePicker from "react-native-image-picker";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { images } from "assets/images";
import { IconButton } from "src/components/buttons/IconButton";
import { IntroRecordButton } from "src/components/buttons/IntroRecordButton";
import { KeyboardSpacer } from "src/components/KeyboardSpacer";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { LabelTextInput } from "src/components/textinputs/LabelTextInput";
import { injectLoading } from "src/decorators/injectLoading";
import { navigateButtonModalScreen } from "src/screens/ButtonModalScreen";
import { navigateIntroRecordScreen } from "src/screens/IntroRecordScreen";
import { navigateKeywordScreen } from "src/screens/KeywordScreen";
import { IContentStore } from "src/stores/ContentStore";
import { IRootStore } from "src/stores/RootStore";
import { IToastStore } from "src/stores/ToastStore";
import { IUserStore } from "src/stores/UserStore";
import { colors } from "src/styles/colors";

interface IInjectProps {
  contentStore: IContentStore;
  userStore: IUserStore;
  toastStore: IToastStore;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any>;
}

interface IState {
  name: IUser["name"];
  username: IUser["username"];
  role: IUser["role"];
  introduction_text: IUser["introduction_text"];
  tags: IUser["tags"];
  photo: IUser["photo"];
  photoChanged: boolean;
}

const Cancel = styled(Text)`
  font-size: 16px;
  color: ${colors.gray400};
`;

const HeaderText = styled(Text).attrs({ type: "bold" })`
  font-size: 16;
`;

const Save = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  color: ${colors.blue300};
`;

const Container = styled.ScrollView.attrs({
  contentContainerStyle: { alignItems: "center" }
})`
  padding: 13px 20px 0;
`;

const AvatarCameraWrapper = styled.View`
  margin-bottom: 27px;
`;

const LabelInput = styled(LabelTextInput).attrs({
  inputStyle: { borderBottomWidth: 0 },
  focusStyle: { borderBottomColor: colors.blue300, borderBottomWidth: 1 }
})`
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray250};
`;

const Avatar = styled(IconButton).attrs({ iconStyle: { resizeMode: "cover" } })`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  overflow: hidden;
  background-color: ${colors.blue300};
`;

const CameraButton = styled(IconButton).attrs({
  source: images.btnMypageProfileUploadphoto
})`
  position: absolute;
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background-color: ${colors.white};
  overflow: hidden;
  right: -8px;
  bottom: -8px;
`;

const GuideText = styled(Text)`
  font-size: 15px;
  color: ${colors.gray400};
  text-align: center;
  margin-bottom: 9px;
`;

const UnderlineWrapper = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-bottom-color: ${colors.blue300};
  margin-bottom: 30px;
`;

const UnderlineText = styled(Text).attrs({ type: "bold" })`
  font-size: 12px;
  border-bottom-width: 1px;
  color: ${colors.blue300};
`;

const KeywordListWrapper = styled.TouchableOpacity`
  width: 100%;
  height: 52px;
  flex-direction: row;
  align-items: center;
  padding: 16px 0;
  background-color: ${colors.white};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray250};
`;

const Label = styled(Text)`
  width: 66px;
  font-size: 14px;
  color: ${colors.gray400};
`;

const KeywordText = styled(Text)`
  flex: 1;
  font-size: 14px;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    contentStore: store.contentStore,
    userStore: store.userStore,
    toastStore: store.toastStore
  })
)
@observer
export class ProfileEditScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      name: "",
      username: "",
      role: "",
      introduction_text: "",
      tags: [""],
      photo: "",
      photoChanged: false
    };
  }

  public componentDidMount() {
    const { userStore } = this.props;
    const user = userStore.client;

    if (!user) {
      return;
    }

    this.setState({
      name: user.name || "",
      username: user.username || "",
      role: user.role || "",
      introduction_text: user.introduction_text || "",
      tags: user.tags || [""],
      photo: user.photo || ""
    });
  }

  public render() {
    const { userStore } = this.props;
    const { name, username, role, introduction_text, tags, photo } = this.state;
    const user = userStore.client;

    if (!user) {
      this.goBack();
      return <React.Fragment />;
    }

    const source = photo ? { uri: photo } : images.user;

    return (
      <React.Fragment>
        <PlainHeader>
          <Cancel onPress={this.goBack}>취소</Cancel>
          <HeaderText>프로필 수정</HeaderText>
          <Save onPress={this.onSavePress}>저장</Save>
        </PlainHeader>
        <Container>
          <AvatarCameraWrapper>
            <Avatar source={source} onPress={this.onPhotoPress} />
            <CameraButton onPress={this.onPhotoPress} />
          </AvatarCameraWrapper>
          <LabelInput
            label="유저네임"
            placeholder="유저네임을 입력해주세요"
            value={username}
            onChangeText={_.partial(this.onChangeText, "username")}
          />
          <LabelInput
            label="이름"
            placeholder="이름을 입력해주세요"
            value={name}
            onChangeText={_.partial(this.onChangeText, "name")}
          />
          <TouchableWithoutFeedback
            onPress={this.onTagInputPress}
            style={{ zIndex: 100 }}
          >
            <KeywordListWrapper onPress={this.onTagInputPress}>
              <Label>키워드</Label>
              <KeywordText>{user.tags.join(", ")}</KeywordText>
            </KeywordListWrapper>
          </TouchableWithoutFeedback>
          <IntroRecordButton
            onPress={this.onRecordPress}
            style={{ marginTop: 16 }}
          />
          <GuideText>
            소개 한마디를 다시 녹음하시면{`\n`}
            기존 녹음내용은 사라집니다
          </GuideText>
          {user.introduction && (
            <UnderlineWrapper onPress={this.onIntroDeletePress}>
              <UnderlineText>기존녹음 삭제하기</UnderlineText>
            </UnderlineWrapper>
          )}
        </Container>
        <KeyboardSpacer />
      </React.Fragment>
    );
  }

  private onChangeText = (field: string, text: string) => {
    this.setState<any>({ [field]: text });
  };

  private goBack = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
  };

  @injectLoading
  private onSavePress = async () => {
    const { navigation, contentStore, userStore, toastStore } = this.props;
    const {
      name,
      username,
      role,
      introduction_text,
      photo,
      photoChanged
    } = this.state;

    const data: Partial<IUser> = {
      name,
      username,
      role,
      introduction_text
    };

    if (photoChanged) {
      data.photo = photo;
    }

    try {
      await userStore.updateClient(data);
      contentStore.refreshAllContentBundles();
      toastStore.openToast({
        type: "INFO",
        content: "프로필이 업데이트 되었습니다."
      });
      navigation.goBack(null);
    } catch (error) {
      toastStore.openToast({
        type: "ERROR",
        content: error.message
      });
    }
  };

  private onPhotoPress = () => {
    const options: ImagePicker.Options = {
      title: "사진 선택",
      takePhotoButtonTitle: "",
      cancelButtonTitle: "취소",
      rotation: 360
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (_.some([response.didCancel, response.error, response.customButton])) {
        return;
      }

      this.setState({ photo: response.uri, photoChanged: true });
    });
  };

  private onRecordPress = () => {
    const { navigation } = this.props;
    navigateIntroRecordScreen(navigation);
  };

  private onIntroDeletePress = () => {
    const { navigation, userStore, toastStore } = this.props;
    navigateButtonModalScreen(navigation, {
      type: "ERROR",
      content: "녹음 내용을 삭제하시겠습니까?",
      leftText: "취소",
      rightText: "삭제하기",
      onRightPress: async () => {
        try {
          await userStore.deleteClientIntroduction();
          toastStore.openToast({
            type: "INFO",
            content: "자기소개 음성이 삭제되었습니다.",
            marginTop: 44
          });
          navigation.goBack(null);
        } catch (error) {
          toastStore.openToast({
            type: "ERROR",
            content: "자기소개 음성 삭제에 실패했습니다.",
            marginTop: 44
          });
          navigation.goBack(null);
        }
      }
    });
  };

  private onTagInputPress = () => {
    const { navigation } = this.props;
    navigateKeywordScreen(navigation);
  };
}

export function navigateProfileEditScreen(
  navigation: NavigationScreenProp<any, any>
) {
  navigation.push("ProfileEditScreen");
}
