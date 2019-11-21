import _ from "lodash";
import { inject, observer } from "mobx-react";
import React from "react";
import { Share, View } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { images } from "assets/images";
import { NavigationScreenOptions } from "react-navigation";
import { Avatar } from "src/components/Avatar";
import { BottomNotch } from "src/components/BottomNotch";
import { IconButton } from "src/components/buttons/IconButton";
import { PlayerSlider } from "src/components/PlayerSlider";
import { Text } from "src/components/Text";
import { environment } from "src/config/environment";
import { navigateReplyScreen } from "src/screens/ReplyScreen";
import { navigateUserPageScreen } from "src/screens/UserPageScreen";
import { IAudioStore } from "src/stores/AudioStore";
import { IContentStore } from "src/stores/ContentStore";
import { IRootStore } from "src/stores/RootStore";
import { colors, getBackgroundByIndex } from "src/styles/colors";
import { getBigPatternByIndex } from "src/utils/ContentPattern";
import { deviceHeight, deviceWidth } from "src/utils/Dimensions";
import { navigateMagazineReplyScreen } from "./MagazineReplyScreen";

interface IInjectProps {
  audioStore: IAudioStore;
  contentStore: IContentStore;
}

interface IParams {}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, IParams>;
}

const Container = styled.View<{ backgroundColor: string }>`
  width: 100%;
  flex: 1;
  background-color: ${props => props.backgroundColor};
`;

const BackgroundImage = styled.Image`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: ${deviceHeight};
`;

const BODY_CONTAINER_PADDING = 48;

const BodyContainer = styled.View`
  flex: 1;
  padding: 12px ${BODY_CONTAINER_PADDING / 2}px 0;
  align-items: center;
`;

const Row = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const PlayerAvatar = styled(Avatar).attrs({ diameter: 30 })`
  margin-right: 9px;
`;

const Content = styled(Text).attrs({ type: "bold" })`
  color: ${colors.white};
`;

const FooterContent = styled(Text).attrs({ type: "bold" })`
  color: ${colors.gray600};
  font-size: 16px;
`;

const Name = styled(Content)`
  flex: 1;
  font-size: 13px;
  height: 20px;
  line-height: 20px;
`;

const Subtitle = styled(Content)`
  font-size: 12px;
`;

const Title = styled(Content)`
  font-size: 19px;
`;

const HeartCount = styled(FooterContent)`
  width: 44px;
  color: ${colors.mardiBlack};
  text-align: center;
`;

const CommentCount = styled(FooterContent)`
  width: 44px;
  color: ${colors.mardiBlack};
  text-align: center;
`;

const TouchableOpacity = styled.TouchableOpacity``;

const Downward = styled.Image.attrs({ source: images.btnPlayPlayerDown })`
  width: 40px;
  height: 40px;
`;

const Padder = styled.View`
  flex: 1;
  align-items: center;
`;

const Toggle = styled(IconButton).attrs({})`
  width: 74px;
  height: 78px;
  margin: 0 24px;
`;

const Prev = styled(IconButton)<{ isActive: boolean }>`
  width: 36px;
  height: 36px;
  margin-right: 24px;
  opacity: ${props => (props.isActive ? 1 : 0.5)};
`;

const Next = styled(IconButton)<{ isActive: boolean }>`
  width: 36px;
  height: 36px;
  margin-left: 24px;
  opacity: ${props => (props.isActive ? 1 : 0.5)};
`;

const Rewind = styled(IconButton).attrs({ source: images.btnPlayerRew5 })`
  width: 36px;
  height: 36px;
`;

const Fastforward = styled(IconButton).attrs({ source: images.btnPlayerFf5 })`
  width: 36px;
  height: 36px;
`;

const FooterContainer = styled.View`
  flex-direction: row;
  height: 42px;
  padding: 0 8px;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
`;

const Heart = styled.Image`
  width: 36px;
  height: 36px;
  margin-right: 4px;
`;

const Comment = styled.Image.attrs({ source: images.btnPlayerComment })`
  width: 36px;
  height: 36px;
  margin-right: 5px;
`;

const Spacer = styled.View`
  width: 1px;
  height: 20px;
  background-color: ${colors.gray400};
  margin-left: 16px;
  margin-right: 8px;
`;

const ShareButton = styled(IconButton).attrs({ source: images.btnPlayerShare })`
  width: 36px;
  height: 36px;
`;

const TouchableWrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    audioStore: store.audioStore,
    contentStore: store.contentStore
  })
)
@observer
export class PlayerScreen extends React.Component<IProps, any> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "white"
    },
    forceInset: {
      top: "never"
    }
  };
  public static navigationOptions = ({
    navigation
  }: {
    navigation: NavigationScreenProp<any, any>;
  }): NavigationScreenOptions => {
    return {
      gesturesEnabled: true,
      gestureResponseDistance: { vertical: deviceHeight }
    };
  };

  public progressBarWidth = deviceWidth - 48;

  public render() {
    const { navigation, audioStore } = this.props;

    const audio = audioStore.currentAudio;

    if (!audio) {
      navigation.goBack(null);
      return <View />;
    }

    const { currentTime } = audioStore;
    const backgroundImageSource = audio.image
      ? {
          uri: audio.image
        }
      : getBigPatternByIndex(audio.default_image_pattern_idx || 0);

    const questionText = _.get(audio.title, ["text"], null);
    const avatarSource = audio.photo;

    return (
      <React.Fragment>
        <Container
          backgroundColor={
            audio.image
              ? colors.black
              : getBackgroundByIndex(audio.default_image_color_idx || 0)
          }
        >
          <BackgroundImage source={backgroundImageSource} resizeMode="cover" />
          <BodyContainer>
            <Row style={{ marginBottom: 96, marginTop: 28 }}>
              <PlayerAvatar
                photo={avatarSource}
                onPress={
                  audio.uuid
                    ? _.partial(this.onAvatarPress, audio.uuid)
                    : undefined
                }
              />
              <Name numberOfLines={1}>{audio.username}</Name>
              <TouchableOpacity onPress={this.goBack}>
                <Downward />
              </TouchableOpacity>
            </Row>
            <Padder>
              {questionText && <Subtitle>"{questionText}"</Subtitle>}
              <Title>{audio.title}</Title>
            </Padder>
            <Row style={{ marginBottom: 32, justifyContent: "center" }}>
              <Prev
                isActive={audioStore.hasPrev}
                disabled={!audioStore.hasPrev}
                source={images.btnPlayerPrev}
                onPress={audioStore.prev}
              />
              <Rewind onPress={audioStore.rewind} />
              <Toggle
                source={
                  audioStore.playing
                    ? images.btnPlayerPauseBig
                    : images.btnPlayerPlayBig
                }
                onPress={audioStore.toggleAudio}
              />
              <Fastforward onPress={audioStore.fastforward} />
              <Next
                isActive={audioStore.hasNext}
                disabled={!audioStore.hasNext}
                source={images.btnPlayerNext}
                onPress={audioStore.next}
              />
            </Row>
            <PlayerSlider
              currentTime={currentTime}
              playableDuration={audio.audio_duration}
              onSlidingEnd={this.onSlidingEnd}
            />
          </BodyContainer>
          <FooterContainer>
            <TouchableWrapper onPress={this.onHeartPress}>
              <Heart
                source={audio.heart_by_me ? images.heart36 : images.heart36Off}
              />
              <HeartCount>{audio.num_hearts}</HeartCount>
            </TouchableWrapper>
            <Spacer />
            <TouchableWrapper onPress={this.onReplyPress}>
              <Comment />
              <CommentCount>{audio.num_replies}</CommentCount>
            </TouchableWrapper>
            <Padder />
            <ShareButton onPress={this.onSharePress} />
          </FooterContainer>
          <BottomNotch backgroundColor={"rgba(255, 255, 255, 0.6)"} />
        </Container>
      </React.Fragment>
    );
  }

  private onSlidingEnd = (percent: number) => {
    const { audioStore } = this.props;
    audioStore.seekByPercent(percent);
  };

  private onAvatarPress = (uuid: string) => {
    const { navigation } = this.props;

    navigation.goBack(null);
    navigateUserPageScreen(navigation, { uuid });
  };

  private onHeartPress = () => {
    const { audioStore, contentStore } = this.props;
    const audio = audioStore.currentAudio;

    if (!audio || audio.type !== "CONTENT") {
      return;
    }

    contentStore.clickHeart(audio.id);
  };

  private onReplyPress = () => {
    const { navigation, audioStore } = this.props;
    const audio = audioStore.currentAudio;
    if (!audio) {
      return;
    }
    navigation.goBack(null);

    if (audio.type === "CONTENT") {
      navigateReplyScreen(navigation, {
        contentId: audio.id,
        mode: "audio",
        showRecorder: true
      });
    } else {
      navigateMagazineReplyScreen(navigation, {
        magazineId: audio.magazineId!,
        magazineContentId: audio.id,
        mode: "audio",
        showRecorder: true
      });
    }
  };

  private onSharePress = () => {
    const { audioStore } = this.props;
    const audio = audioStore.currentAudio;

    if (!audio) {
      return;
    }

    Share.share({
      title: audio.title,
      message: environment.share(audio.id)
    });
  };

  private goBack = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
  };
}

export function navigatePlayerScreen(
  navigation: NavigationScreenProp<any>,
  params: IParams
) {
  navigation.push("PlayerScreen", params);
}
