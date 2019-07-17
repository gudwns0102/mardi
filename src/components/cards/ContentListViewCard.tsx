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
  onQuestionPress?: (question: IContent["question"]) => void;
  onAvatarPress?: () => any;
  onHeartPress?: () => any;
  onPlayPress?: () => any;
  showFooterIcons?: boolean;
  playing?: boolean;
  disabled?: boolean;
}

const Container = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  flex-direction: row;
  width: 100%;
  height: 118px;
  border-radius: 14px;
  background-color: white;
  padding: 6px 6px 6px 12px;

  ${shadow({ opacity: 0.09 })}
`;

const ContentContainer = styled.View`
  flex: 1;
  margin-right: 15px;
`;

const QuestionText = styled(Text).attrs({ type: "regular", numberOfLines: 1 })`
  font-size: 11px;
  line-height: 25px;
  color: rgb(155, 155, 155);
`;

const QuestionTextPlaceholder = styled.View`
  height: 25px;
`;

const Content = styled(Text).attrs({ type: "regular", numberOfLines: 3 })`
  flex: 1;
  font-size: 13px;
  color: rgb(69, 69, 69);
`;

const ContentBottomRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const StyledButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const Icon = styled.Image`
  width: 14px;
  height: 14px;
  margin-right: 4px;
`;

const Count = styled(Bold)`
  font-size: 11px;
  color: rgb(155, 155, 155);
  margin-right: 4.5px;
`;

const ImageContainer = styled.View`
  width: 162px;
  height: 100%;
  justify-content: flex-end;
`;

const Image = styled.Image`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;

const ContentDurationWrapper = styled.View`
  position: absolute;
  right: 4px;
  top: 2px;
  width: 38px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ContentDuration = styled(Text)`
  font-size: 12px;
  color: white;
`;

const PlayButton = styled.TouchableOpacity`
  flex-direction: row;
  height: 36px;
  padding: 4px;
  margin: 0 6px;
  margin-bottom: 6px;
  background-color: rgba(25, 86, 212, 0.8);
  border-radius: 8px;
`;

const PlayButtonIcon = styled.Image.attrs({
  source: images.btnContentsCardPlay
})`
  width: 28px;
  height: 28px;
`;

const PlayButtonCount = styled(Bold)`
  flex: 1;
  text-align: center;
  font-size: 16px;
  color: white;
`;

export function ContentListViewCard({
  content,
  onQuestionPress,
  onHeartPress,
  onPlayPress,
  playing,
  ...props
}: IProps) {
  const question = content.question;

  const backgroundSource = content.image
    ? { uri: content.image }
    : getPatternByIndex(content.default_image_pattern_idx);

  return (
    <Container {...props}>
      <ContentContainer>
        {question ? (
          <QuestionText
            onPress={() => (onQuestionPress ? onQuestionPress(question) : null)}
          >
            {question.text}
          </QuestionText>
        ) : (
          <QuestionTextPlaceholder />
        )}
        <Content>{content.title}</Content>
        <ContentBottomRow>
          <Icon
            source={content.heart_by_me ? images.listLike : images.listLike}
          />
          <Count>{shrinkValue(content.num_hearts)}</Count>
          <Icon source={images.listComment} />
          <Count>{shrinkValue(content.num_replies)}</Count>
        </ContentBottomRow>
      </ContentContainer>
      <ImageContainer>
        <Image
          source={backgroundSource}
          style={{
            backgroundColor: getBackgroundByIndex(
              content.default_image_color_idx
            )
          }}
        />
        <PlayButton onPress={onPlayPress}>
          <PlayButtonIcon
            source={playing ? images.icEqualize : images.btnContentsCardPlay}
          />
          <PlayButtonCount>{shrinkValue(content.num_played)}</PlayButtonCount>
        </PlayButton>
        <ContentDurationWrapper>
          <ContentDuration>{toMSS(content.audio_duration)}</ContentDuration>
        </ContentDurationWrapper>
      </ImageContainer>
    </Container>
  );
}
