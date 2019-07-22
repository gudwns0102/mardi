import _ from "lodash";
import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import React from "react";
import { Animated, AsyncStorage, View } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { images } from "assets/images";
import { CurationCard } from "src/components/cards/CurationCard";
import { ClosableToast } from "src/components/ClosableToast";
import { ContentEmptyList } from "src/components/lists/ContentEmptyList";
import { ContentList } from "src/components/lists/ContentList";
import { PlainHeader } from "src/components/PlainHeader";
import { withAudioPlayer } from "src/hocs/withAudioPlayer";
import { withOnesignal } from "src/hocs/withOnesignal";
import { navigateFollowAndContentRecommendScreen } from "src/screens/FollowAndContentRecommendScreen";
import { navigateFollowRecommendScreen } from "src/screens/FollowRecommendScreen";
import { navigateListenDetailScreen } from "src/screens/ListenDetailScreen";
import { IAudioStore } from "src/stores/AudioStore";
import { IContentBundle } from "src/stores/ContentBundle";
import { IContentStore } from "src/stores/ContentStore";
import { IRootStore } from "src/stores/RootStore";
import { IToastStore } from "src/stores/ToastStore";
import { IUserStore } from "src/stores/UserStore";
import { AsyncStorageKeys } from "src/utils/AsyncStorage";
import { isAndroid } from "src/utils/Platform";

interface IInjectProps {
  audioStore: IAudioStore;
  contentStore: IContentStore;
  userStore: IUserStore;
  toastStore: IToastStore;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, any>;
}

export const LISTEN_SCREEN_STORE_ID = "LISTEN_SCREEN_STORE_ID";

const HEADER_MAX_HEIGHT = 110;
const HEADER_MIN_HEIGHT = 45;
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const Container = styled.View`
  width: 100%;
  flex: 1;
  background-color: #ebebeb;
`;

const Header = styled(PlainHeader)`
  position: absolute;
  width: 100%;
  background-color: #ebebeb;
  z-index: 10;
`;

const Logo = styled(Animated.Image)`
  width: 133px;
  height: 30px;
  align-self: center;
  z-index: 100;
`;

const AnimatedContentList = Animated.createAnimatedComponent(ContentList);

const AnimatedContentEmptyList = Animated.createAnimatedComponent(
  ContentEmptyList
);

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    audioStore: store.audioStore,
    contentStore: store.contentStore,
    userStore: store.userStore,
    toastStore: store.toastStore
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
    this.contentBundle.initializeContents({}, "HOME");
    this.showFollowRecommendationToast();
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
    const { headerAnimation } = this;

    const contentBundle = this.contentBundle;

    const scale = headerAnimation.interpolate({
      inputRange: [0, SCROLL_DISTANCE],
      outputRange: [1, 0.6],
      extrapolate: "clamp"
    });

    const translateY = headerAnimation.interpolate({
      inputRange: [0, SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT / 2, 11],
      extrapolate: "clamp"
    });

    return (
      <Container>
        <Header>
          <React.Fragment />
          <React.Fragment />
          <React.Fragment />
        </Header>
        <Logo
          source={images.icLogoBigBlue}
          resizeMode="contain"
          style={{ transform: [{ scale }, { translateY }] }}
        />
        {contentBundle ? (
          contentBundle.hasNoResult ? (
            this.BeginnerView
          ) : (
            <AnimatedContentList
              ref={this.contentListRef}
              type="CARD"
              contentBundle={contentBundle}
              onCardPress={this.onCardPress}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: headerAnimation } } }],
                { useNativeDriver: isAndroid() ? false : true }
              )}
              scrollEventThrottle={8}
              ListHeaderComponent={
                <View style={{ marginTop: HEADER_MAX_HEIGHT }} />
              }
            />
          )
        ) : null}
        {this.showBanner ? this.NoFollowerBanner : null}
      </Container>
    );
  }

  private get BeginnerView() {
    return (
      <AnimatedContentEmptyList
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: this.headerAnimation } } }],
          { useNativeDriver: isAndroid() ? false : true }
        )}
        scrollEventThrottle={8}
        data={Array.from({ length: 3 }).map((__, index) => index)}
        ListHeaderComponent={<View style={{ marginTop: HEADER_MAX_HEIGHT }} />}
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
