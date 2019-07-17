import { BlurView } from "@react-native-community/blur";
import _ from "lodash";
import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { images } from "assets/images";
import { Text } from "src/components/Text";
import { Bold } from "src/components/texts/Bold";
import {
  getBackgroundByIndex,
  getPatternByIndex
} from "src/utils/ContentPattern";
import { shrinkValue, toMSS } from "src/utils/Number";
import { shadow } from "src/utils/Shadow";

interface IProps {
  style?: ViewProps["style"];
  content: IContent;
  onPress?: () => any;
  onQuestionPress?: () => any;
  onAvatarPress?: () => any;
  onHeartPress?: () => any;
  onCommentPress?: () => any;
  onPlayPress?: () => any;
  showFooterIcons?: boolean;
  playing?: boolean;
  disabled?: boolean;
}

const Container = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  width: 100%;
  height: 236px;
  border-radius: 14px;
  background-color: white;
  padding: 8px;

  ${shadow({ opacity: 0.09 })}
`;

const InnerContainer = styled.View`
  width: 100%;
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
`;

const BackgroundImage = styled.Image`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
`;

const BodyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const BodyContent = styled(Bold)`
  color: white;
  padding: 0 15px;
`;

const Subtitle = styled(BodyContent)`
  font-size: 12px;
  text-align: center;
`;

const Title = styled(BodyContent)`
  font-size: 19px;
  text-align: center;
`;

const BodyBottomContainer = styled.View`
  position: absolute;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 0 10px 0 6px;
  bottom: 6px;
`;

const ContentDurationWrapper = styled.View`
  width: 44px;
  height: 22px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  margin-left: 6px;
`;

const ContentDuration = styled(Text)`
  font-size: 14px;
  color: white;
`;

const FooterContainer = styled.View`
  height: 42px;
  flex-direction: row;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
  border-top-width: 0.5px;
  border-top-color: white;
`;

const BlurLayer = styled(BlurView)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Avatar = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-right: 9px;
  overflow: hidden;
  border-width: 2px;
  border-color: white;
`;

const FooterContent = styled(Bold)`
  flex: 1;
  font-size: 13px;
  color: white;
`;

const FooterButtonWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0 4px 1px 7px;
`;

const TouchableWrapper = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  flex-direction: row;
  align-items: center;
`;

const HeartIcon = styled.Image`
  width: 28px;
  height: 28px;
`;

const HeartCount = styled(Bold)`
  min-width: 44px;
  font-size: 16px;
  text-align: center;
  color: #454545;
  margin-right: 16px;
`;

const CommentIcon = styled.Image.attrs({ source: images.cardComment })`
  width: 28px;
  height: 28px;
`;

const CommentCount = HeartCount;

const PlayIcon = styled.Image`
  width: 28px;
  height: 28px;
`;

const PlayCount = styled(Bold)`
  min-width: 44px;
  font-size: 16px;
  text-align: center;
  color: white;
`;

const FooterSpacer = styled.View`
  flex: 1;
`;

const NowPlayingBadge = styled.View`
  position: absolute;
  top: 12px;
  height: 28px;
  border-radius: 14px;
  padding-left: 4px;
  padding-right: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.6);
`;

const NowPlayingImage = styled.Image.attrs({ source: images.icEqualizRed })`
  width: 28px;
  height: 28px;
  margin-right: 4px;
`;

const NowPlayingText = styled(Bold)`
  font-size: 12px;
  color: rgb(255, 10, 10);
  line-height: 25px;
`;

export function ContentCard({
  style,
  content,
  onPress,
  onQuestionPress,
  onAvatarPress,
  onHeartPress,
  onCommentPress,
  onPlayPress,
  showFooterIcons,
  playing,
  disabled
}: IProps) {
  const questionText = _.get(content.question, ["text"], null);
  const avatarSource = _.get(content.user, ["photo"], null);
  const backgroundSource = content.image
    ? { uri: content.image }
    : getPatternByIndex(content.default_image_pattern_idx);
  const source = avatarSource ? { uri: avatarSource } : images.user;
  return (
    <Container style={style} onPress={onPress} disabled={disabled}>
      <InnerContainer
        style={{
          backgroundColor: getBackgroundByIndex(content.default_image_color_idx)
        }}
      >
        <BackgroundImage
          source={backgroundSource}
          style={{ resizeMode: content.image ? "cover" : "repeat" }}
        />
        <BodyContainer>
          {questionText && (
            <Subtitle numberOfLines={1} onPress={onQuestionPress}>
              "{questionText}"
            </Subtitle>
          )}
          <Title numberOfLines={3}>{content.title}</Title>
          {playing && (
            <NowPlayingBadge>
              <NowPlayingImage />
              <NowPlayingText>재생 중</NowPlayingText>
            </NowPlayingBadge>
          )}
          <BodyBottomContainer>
            <TouchableWrapper style={{ flex: 1 }} onPress={onAvatarPress}>
              <Avatar source={source} />
              <FooterContent numberOfLines={1}>
                {content.user.username}
              </FooterContent>
            </TouchableWrapper>
            <ContentDurationWrapper>
              <ContentDuration>{toMSS(content.audio_duration)}</ContentDuration>
            </ContentDurationWrapper>
          </BodyBottomContainer>
        </BodyContainer>
        <FooterContainer>
          <BlurLayer blurType="light" blurAmount={4} />
          {showFooterIcons && (
            <FooterButtonWrapper>
              <TouchableWrapper onPress={onHeartPress}>
                <HeartIcon
                  source={content.heart_by_me ? images.heart : images.heartGray}
                />
                <HeartCount>{shrinkValue(content.num_hearts)}</HeartCount>
              </TouchableWrapper>
              <TouchableWrapper onPress={onCommentPress}>
                <CommentIcon />
                <CommentCount>{shrinkValue(content.num_replies)}</CommentCount>
              </TouchableWrapper>
              <FooterSpacer />
              <TouchableWrapper
                onPress={onPlayPress}
                style={{
                  backgroundColor: "rgba(25, 86, 212, 0.8)",
                  width: 93,
                  height: 36,
                  borderRadius: 8,
                  paddingLeft: 4
                }}
              >
                <PlayIcon
                  source={
                    playing ? images.icEqualize : images.btnContentsCardPlay
                  }
                />
                <PlayCount>{shrinkValue(content.num_played)}</PlayCount>
              </TouchableWrapper>
            </FooterButtonWrapper>
          )}
        </FooterContainer>
      </InnerContainer>
    </Container>
  );
}
