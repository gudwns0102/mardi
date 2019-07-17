import _ from "lodash";
import { inject, observer } from "mobx-react";
import React from "react";
import ImagePicker from "react-native-image-picker";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { images } from "assets/images";
import { IconButton } from "src/components/buttons/IconButton";
import { ContentEditCard } from "src/components/cards/ContentEditCard";
import { KeyboardSpacer } from "src/components/KeyboardSpacer";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { TextInput } from "src/components/textinputs/TextInput";
import { Bold } from "src/components/texts/Bold";
import { HedaerText } from "src/components/texts/HeaderText";
import { injectLoading } from "src/decorators/injectLoading";
import { navigateActionSheetModalScreen } from "src/screens/ActionSheetModalScreen";
import { navigateCameraScreen } from "src/screens/CameraScreen";
import { navigateListenScreen } from "src/screens/ListenScreen";
import { IContentStore } from "src/stores/ContentStore";
import { IQuestionStore } from "src/stores/QuestionStore";
import { IRootStore } from "src/stores/RootStore";
import { IToastStore } from "src/stores/ToastStore";
import { IUploadStore } from "src/stores/UploadStore";
import { IUserStore } from "src/stores/UserStore";
import { colors } from "src/styles/colors";
import { audioPath } from "src/utils/Audio";
import { isIos } from "src/utils/Platform";
import { checkUploadCountForRating } from "src/utils/Rating";

type ContentEditType = "FROM_RECORD" | "FROM_CONTENT_DETAIL";

interface IInjectProps {
  contentStore: IContentStore;
  questionStore: IQuestionStore;
  userStore: IUserStore;
  toastStore: IToastStore;
  uploadStore: IUploadStore;
}

interface IParams {
  type: ContentEditType;
  questionId?: IQuestion["id"];
  questionText: string;
  defaultContent?: string;
  defaultPhoto?: string | null;
  contentId?: IContent["id"];
  patternIndex: number;
  backgroundIndex: number;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, IParams>;
}

interface IState {
  title: string;
  image?: string;
  isLoading: boolean;
}

const BackIcon = styled(IconButton)`
  width: 24px;
  height: 24px;
`;

const Cancel = styled(Text)`
  font-size: 16px;
  height: 27px;
  line-height: 27px;
  color: rgb(177, 177, 177);
`;

const ShareText = styled(Bold)<{ active?: boolean }>`
  font-size: 16px;
  color: ${props => (props.active ? colors.blue300 : "rgb(200, 200, 200)")};
`;

const Container = styled.View`
  width: 100%;
  flex: 1;
  background-color: ${colors.gray250};
  align-items: center;
  justify-content: center;
`;

const CardContainer = styled.View`
  width: 100%;
  padding: 16px;
`;

const CaptionInput = styled(TextInput).attrs({
  placeholder: "설명 입력...",
  placeholderTextColor: "rgb(155, 155, 155)",
  keyboardType: "twitter"
})`
  color: black;
  line-height: 20px;
  flex: 1;
`;

const TagTextWrapper = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  width: 100%;
  flex: 1;
  padding: 20px;
  background-color: ${colors.white};
  flex-direction: row;
  flex-wrap: wrap;
`;

const PaddingResolver = styled.View`
  width: 100%;
  flex: 1;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    contentStore: store.contentStore,
    questionStore: store.questionStore,
    userStore: store.userStore,
    toastStore: store.toastStore,
    uploadStore: store.uploadStore
  })
)
@observer
export class ContentEditScreen extends React.Component<IProps, IState> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: colors.white
    }
  };
  public textInputRef = React.createRef<any>();

  constructor(props: IProps) {
    super(props);

    this.state = {
      title: props.navigation.getParam("defaultContent") || "",
      isLoading: false,
      image: props.navigation.getParam("defaultPhoto") || undefined
    };
  }

  public get Header() {
    const { navigation } = this.props;
    const { title } = this.state;
    const isShareActive = title.length !== 0;
    const contentEditType = navigation.getParam("type");

    return (
      <PlainHeader>
        {contentEditType === "FROM_RECORD" ? (
          <BackIcon source={images.btnCommonBack} onPress={this.goBack} />
        ) : (
          <Cancel onPress={this.goBack}>닫기</Cancel>
        )}
        <HedaerText>새로운 한마디</HedaerText>
        <ShareText
          active={isShareActive}
          onPress={
            title.length !== 0
              ? contentEditType === "FROM_RECORD"
                ? this.onSharePress
                : this.onSavePress
              : undefined
          }
        >
          {contentEditType === "FROM_RECORD" ? "공유" : "저장"}
        </ShareText>
      </PlainHeader>
    );
  }

  public render() {
    const { navigation, userStore } = this.props;
    const { title, image } = this.state;
    const client = userStore.client!;
    const questionText = navigation.getParam("questionText");
    const patternIndex = navigation.getParam("patternIndex");
    const backgroundIndex = navigation.getParam("backgroundIndex");
    const imageSource = image ? { uri: image } : undefined;

    return (
      <React.Fragment>
        {this.Header}
        <Container>
          <CardContainer>
            <ContentEditCard
              title={title}
              avatar={client.photo}
              questionText={questionText}
              image={imageSource}
              name={""}
              onPress={this.onCardPress}
              patternIndex={patternIndex}
              backgroundIndex={backgroundIndex}
            />
          </CardContainer>
          <TagTextWrapper onPress={this.focusTextInput}>
            <PaddingResolver>
              <CaptionInput
                ref={this.textInputRef}
                multiline={true}
                value={title}
                onChangeText={$title => this.setState({ title: $title })}
                autoFocus={true}
              />
            </PaddingResolver>
          </TagTextWrapper>
        </Container>
        <KeyboardSpacer />
      </React.Fragment>
    );
  }

  private onCardPress = () => {
    const { navigation } = this.props;
    const options = {
      title: "사진 선택",
      takePhotoButtonTitle: "",
      cancelButtonTitle: "취소"
    };

    navigateActionSheetModalScreen(navigation, {
      buttons: [
        {
          buttonType: "INFO",
          content: "갤러리에서 사진 선택",
          onPress: () => {
            navigation.goBack(null);
            ImagePicker.launchImageLibrary(options, response => {
              if (
                _.some([
                  response.didCancel,
                  response.error,
                  response.customButton
                ])
              ) {
                return;
              }

              this.setState({ image: response.uri });
              this.focusTextInput();
            });
          }
        },
        {
          buttonType: "INFO",
          content: "카메라에서 사진 찍기",
          onPress: () => {
            navigation.goBack(null);
            if (false) {
              navigateCameraScreen(navigation, {
                callback: uri => {
                  this.setState({ image: uri });
                  this.focusTextInput();
                }
              });
            } else {
              ImagePicker.launchCamera(options, response => {
                if (
                  _.some([
                    response.didCancel,
                    response.error,
                    response.customButton
                  ])
                ) {
                  return;
                }

                this.setState({ image: response.uri });
                this.focusTextInput();
              });
            }
          }
        }
      ]
    });
  };

  @injectLoading
  private onSharePress = async () => {
    const { navigation, contentStore, toastStore, uploadStore } = this.props;
    const { title, image } = this.state;
    const questionId = navigation.getParam("questionId");
    const patternIndex = navigation.getParam("patternIndex");
    const backgroundIndex = navigation.getParam("backgroundIndex");

    const success = await contentStore.postContent({
      title,
      audio: audioPath,
      questionId,
      image: image || undefined,
      default_image_pattern_idx: patternIndex,
      default_image_color_idx: backgroundIndex
    });

    if (!success) {
      toastStore.openToast({
        type: "ERROR",
        content: "오디오 길이 및 사진 용량을 확인해주세요."
      });
      return;
    }

    toastStore.openToast({
      type: "INFO",
      content: "한마디를 남겼습니다."
    });

    uploadStore.clearContent();
    checkUploadCountForRating();

    navigateListenScreen(navigation);
    return;
  };

  @injectLoading
  private onSavePress = async () => {
    const { navigation, contentStore, toastStore } = this.props;
    const { title, image } = this.state;
    const contentId = navigation.getParam("contentId");

    if (!contentId) {
      return;
    }

    const success = await contentStore.patchContent(contentId, {
      title,
      image
    });

    if (!success) {
      toastStore.openToast({
        type: "ERROR",
        content: "컨텐츠 수정에 실패하였습니다."
      });
      return;
    }

    toastStore.openToast({
      type: "INFO",
      content: "컨텐츠를 수정하였습니다."
    });

    navigation.goBack(null);
  };

  private focusTextInput = () => {
    _.invoke(this.textInputRef.current, ["root", "root", "focus"]);
  };

  private goBack = () => {
    const { navigation, uploadStore } = this.props;
    const { title, image } = this.state;
    uploadStore.saveContent(title, image || null);
    navigation.goBack(null);
  };
}

export function navigateContentEditScreen(
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) {
  navigation.push("ContentEditScreen", params);
}
