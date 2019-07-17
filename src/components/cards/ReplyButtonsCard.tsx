import React from "react";
import styled from "styled-components/native";

import { images } from "assets/images";
import { IconButton } from "src/components/buttons/IconButton";
import { colors } from "src/styles/colors";
import { deviceWidth } from "src/utils/Dimensions";

export interface IReplyButtonsProps {
  isMyReply: boolean;
  onTextPress?: () => any;
  onAudioPress?: () => any;
  onDeletePress?: () => any;
  onReportPress?: () => any;
}

const ButtonContainer = styled.View`
  width: ${deviceWidth * 0.6};
  flex-direction: row;
  border-bottom-color: transparent;
  border-bottom-width: 0px;
`;

const ReplyButton = styled(IconButton).attrs({
  iconStyle: {
    width: 26,
    height: 26
  }
})<{ color: string }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.color};
`;

const TextButton = styled(ReplyButton).attrs({
  source: images.commentChar,
  color: colors.green100
})``;
const AudioButton = styled(ReplyButton).attrs({
  source: images.mike,
  color: colors.blue300
})``;
const DeleteButton = styled(ReplyButton).attrs({
  source: images.commentDelete,
  color: colors.red100
})``;
const ReportButton = styled(ReplyButton).attrs({
  source: images.icReport,
  color: colors.red100
})``;

export function ReplyButtonsCard({
  isMyReply,
  onTextPress,
  onAudioPress,
  onDeletePress,
  onReportPress
}: IReplyButtonsProps) {
  return (
    <ButtonContainer>
      <TextButton onPress={onTextPress} />
      <AudioButton onPress={onAudioPress} />
      {isMyReply ? (
        <DeleteButton onPress={onDeletePress} />
      ) : (
        <ReportButton onPress={onReportPress} />
      )}
    </ButtonContainer>
  );
}
