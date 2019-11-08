import _ from "lodash";
import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import React from "react";
import { Animated, AsyncStorage, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { BlurView } from "@react-native-community/blur";
import { images } from "assets/images";
import { Button } from "src/components/buttons/Button";
import { IconButton } from "src/components/buttons/IconButton";
import { ClosableToast } from "src/components/ClosableToast";
import { ContentEmptyList } from "src/components/lists/ContentEmptyList";
import { ContentList } from "src/components/lists/ContentList";
import { CurationList } from "src/components/lists/CurationList";
import { PlainHeader } from "src/components/PlainHeader";
import { withAudioPlayer } from "src/hocs/withAudioPlayer";
import { withOnesignal } from "src/hocs/withOnesignal";
import { navigateFollowAndContentRecommendScreen } from "src/screens/FollowAndContentRecommendScreen";
import { navigateFollowRecommendScreen } from "src/screens/FollowRecommendScreen";
import { navigateListenDetailScreen } from "src/screens/ListenDetailScreen";
import { IAudioStore } from "src/stores/AudioStore";
import { IContentBundle } from "src/stores/ContentBundle";
import { IContentStore } from "src/stores/ContentStore";
import { IQuestionStore } from "src/stores/QuestionStore";
import { IRootStore } from "src/stores/RootStore";
import { IToastStore } from "src/stores/ToastStore";
import { IUserStore } from "src/stores/UserStore";
import { AsyncStorageKeys } from "src/utils/AsyncStorage";
import { isAndroid } from "src/utils/Platform";
import { navigateSearchQuestionScreen } from "./SearchQuestionScreen";
import { navigateSearchScreen } from "./SearchScreen";

interface IInjectProps {
  audioStore: IAudioStore;
  contentStore: IContentStore;
  userStore: IUserStore;
  toastStore: IToastStore;
  questionStore: IQuestionStore;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, any>;
}

export const LISTEN_SCREEN_STORE_ID = "LISTEN_SCREEN_STORE_ID";

const Container = styled.View`
  width: 100%;
  flex: 1;
  background-color: #ebebeb;
`;

const Header = styled(PlainHeader)`
  width: 100%;
  height: 44px;
  background-color: #ebebeb;
`;

const Logo = styled.Image`
  width: 91px;
  height: 20px;
  align-self: center;
  z-index: 100;
`;

const SearchButton = styled(IconButton).attrs({
  source: images.btnCommonSearch
})`
  width: 24px;
  height: 24px;
`;

const CurationListContainer = styled(LinearGradient)`
  height: 95px;
`;

const AnimatedContentList = styled(
  Animated.createAnimatedComponent(ContentList)
)`
  margin-top: 7px;
`;

const AnimatedContentEmptyList = Animated.createAnimatedComponent(
  ContentEmptyList
);

const RandomButtonContainer = styled.View`
  position: absolute;
  bottom: 10px;
  left: 10px;
  align-items: center;
  justify-content: center;
  width: 109px;
  height: 34px;
  border-radius: 14px;
  background-color: transparent;
  overflow: hidden;
`;

const RandomButton = styled(Button).attrs({
  textProps: {
    style: {
      fontSize: 14,
      color: "#ffffff"
    },
    type: "bold"
  }
})`
  width: 103px;
  height: 28px;
  border-radius: 14px;
  background-color: rgb(55, 104, 204);
`;

const RandomIcon = styled.Image.attrs({ source: images.icListenRandom })`
  margin-right: 5px;
`;

const RandomButtonBlurView = styled(BlurView)`
  position: absolute;
  width: 109px;
  height: 34px;
  background-color: rgba(255, 255, 255, 0.5);
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    audioStore: store.audioStore,
    contentStore: store.contentStore,
    userStore: store.userStore,
    toastStore: store.toastStore,
    questionStore: store.questionStore
  })
)
@withAudioPlayer
@withOnesignal
@observer
export class ListenScreen extends React.Component<IProps> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "#ebebeb",
      translucent: false
    }
  };
  public headerHeight: any;
  public logoWidth: any;
  public contentBundle: IContentBundle;
  public headerAnimation = new Animated.Value(0);
  public contentListRef = React.createRef<typeof AnimatedContentList>();
  @observable public showBanner = false;
  public curationListRef = React.createRef<any>();

  constructor(props: IProps) {
    super(props);

    this.contentBundle = props.contentStore.createContentBundle(
      LISTEN_SCREEN_STORE_ID
    );
  }

  public async componentDidMount() {
    (this.props.navigation.dangerouslyGetParent() as NavigationScreenProp<
      any,
      any
    >).setParams({
      scrollToTop: this.scrollToTop
    });
    this.contentBundle.initializeContents({});
    this.showFollowRecommendationToast();
    this.props.questionStore.fetchCurations();
  }

  public showFollowRecommendationToast = async () => {
    const { userStore } = this.props;
    const isClosedBefore = !!(await AsyncStorage.getItem(
      AsyncStorageKeys.FOLLOW_RECOMMEND_TOAST
    ));

    if (userStore.client!.num_followings === 0 && !isClosedBefore) {
      this.showBanner = true;
    }
  };

  public render() {
    const { navigation } = this.props;
    const { headerAnimation } = this;

    const contentBundle = this.contentBundle;

    return (
      <Container>
        <Header>
          <React.Fragment />
          <Logo source={images.icLogoBigBlue} />
          <SearchButton onPress={() => navigateSearchScreen(navigation, {})} />
        </Header>
        {this.CurationSection}
        {contentBundle ? (
          contentBundle.hasNoResult ? (
            this.BeginnerView
          ) : (
            <AnimatedContentList
              ref={this.contentListRef}
              type="CARD"
              contentBundle={contentBundle}
              onCardPress={this.onCardPress}
            />
          )
        ) : null}
        {this.showBanner ? this.NoFollowerBanner : null}
        <RandomButtonContainer>
          <RandomButtonBlurView blurType="light" blurAmount={17} />
          <RandomButton>
            <RandomIcon />
            랜덤 듣기
          </RandomButton>
        </RandomButtonContainer>
      </Container>
    );
  }

  private get CurationSection() {
    const { questionStore } = this.props;
    const curations = Array.from(questionStore.curations.values());

    return (
      <CurationListContainer
        colors={["rgb(235, 235, 235)", "rgb(255, 255, 255)"]}
      >
        <CurationList
          ref={this.curationListRef}
          data={[...curations]}
          onCurationPress={this.onCurationPress}
        />
      </CurationListContainer>
    );
  }

  private onCurationPress = (curation: ICuration, index: number | null) => {
    const { navigation } = this.props;
    navigateSearchQuestionScreen(navigation, {
      questionId: curation.question.id,
      questionText: curation.question.text
    });
  };

  private get BeginnerView() {
    return (
      <AnimatedContentEmptyList
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: this.headerAnimation } } }],
          { useNativeDriver: isAndroid() ? false : true }
        )}
        scrollEventThrottle={8}
        data={Array.from({ length: 3 }).map((__, index) => index)}
        onFirstItemPress={this.onContentEmptyCardPress}
      />
    );
  }

  get NoFollowerBanner() {
    return (
      <ClosableToast
        onFollowPress={() => {
          this.showBanner = false;
          navigateFollowRecommendScreen(this.props.navigation);
        }}
        onClose={() => {
          this.showBanner = false;
          AsyncStorage.setItem(AsyncStorageKeys.FOLLOW_RECOMMEND_TOAST, "true");
        }}
      />
    );
  }

  private onCardPress = (content: IContent) => {
    const { navigation } = this.props;
    navigateListenDetailScreen(navigation, {
      contentId: content.id
    });
  };

  private onContentEmptyCardPress = () => {
    const { navigation } = this.props;
    navigateFollowAndContentRecommendScreen(navigation);
  };

  private scrollToTop = () => {
    const contentList = _.invoke(this.contentListRef.current, ["getNode"]);
    _.invoke(contentList, ["root", "scrollToOffset"], { y: 0, animated: true });
  };
}

export function navigateListenScreen(
  navigation: NavigationScreenProp<any, any>
) {
  navigation.navigate("ListenScreen");
}
