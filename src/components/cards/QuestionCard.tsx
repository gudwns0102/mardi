import _ from "lodash";
import React from "react";
import { TouchableOpacityProps } from "react-native";
import styled from "styled-components/native";

import { images } from "assets/images";
import { IconButton } from "src/components/buttons/IconButton";
import { Text } from "src/components/Text";
import { IQuestionWithStyle } from "src/stores/QuestionStore";
import { colors, getBackgroundByIndex } from "src/styles/colors";
import { getPatternByIndex } from "src/utils/ContentPattern";
import { shadow } from "src/utils/Shadow";

interface IProps {
  style?: TouchableOpacityProps["style"];
  question?: IQuestionWithStyle;
  onPress?: () => any;
  onPlayPress?: () => any;
  questionText?: string;
  patternIndex?: number;
  backgroundIndex?: number;
}

const Container = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  width: 100%;
  height: 141px;
  border-radius: 14px;
  background-color: ${colors.white};
  padding: 8px;

  ${shadow({ opacity: 0.09 })}
`;

const InnerContainer = styled.View`
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
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
  height: 236px;
`;

const Content = styled(Text).attrs({ type: "bold" })`
  width: 100%;
  font-size: 20px;
  color: ${colors.white};
  text-align: center;
  padding-horizontal: 40px;
`;

const BadgesContainer = styled.View`
  position: absolute;
  top: 4px;
  left: 4px;
  flex-direction: row;
  align-items: center;
`;

const Badge = styled.Image`
  width: 56px;
  height: 25px;
  margin-right: 5px;
`;

const HotBadge = styled(Badge).attrs({ source: images.icSpeakHot })``;

const NewBadge = styled.Image.attrs({ source: images.icSpeakNew })``;

const Play = styled(IconButton).attrs({
  source: images.btnSpeakPlaySmallWhite,
  hitSlop: { top: 10, bottom: 15, left: 15, right: 10 }
})`
  position: absolute;
  width: 24px;
  height: 24px;
  top: 6px;
  right: 6px;
`;

export function QuestionCard({ question, style, ...props }: IProps) {
  const { patternIndex, backgroundIndex } = props;
  return (
    <Container onPress={props.onPress} style={style}>
      <InnerContainer
        style={{
          backgroundColor: getBackgroundByIndex(
            question ? question.default_image_color_idx : backgroundIndex!
          )
        }}
      >
        <BackgroundImage
          source={getPatternByIndex(
            question ? question.default_image_pattern_idx : patternIndex!
          )}
          resizeMode="repeat"
        />
        <BadgesContainer>
          {question ? question.hot && <HotBadge /> : null}
          {question ? question.new && <NewBadge /> : null}
        </BadgesContainer>
        {question && question.audio && <Play onPress={props.onPlayPress} />}
        <Content numberOfLines={3}>
          {question ? question.text : props.questionText}
        </Content>
      </InnerContainer>
    </Container>
  );
}
