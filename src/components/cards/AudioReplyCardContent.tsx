import _ from "lodash";
import React from "react";
import styled from "styled-components/native";

import { images } from "assets/images";
import { IconButton } from "src/components/buttons/IconButton";
import { Text } from "src/components/Text";
import { ReplyText } from "src/components/texts/ReplyText";
import { getStore } from "src/stores/RootStore";
import { colors } from "src/styles/colors";
import { deviceWidth } from "src/utils/Dimensions";
import { toMSS } from "src/utils/Number";
import { formatDiffTime } from "src/utils/Time";

export interface IAudioReplyCallbackProps {
  onPress?: () => any;
  onAvatarPress?: () => any;
  onNamePress?: () => any;
  onUserTagPress?: () => any;
}

export interface IAudioReplyCardProps extends IAudioReplyCallbackProps {
  reply: IAudioReply;
  isPlaying: boolean;
}

const ContentContainer = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  width: ${deviceWidth};
  padding: 12px 20px;
  flex-direction: row;
  align-items: center;
`;

const Avatar = styled(IconButton)`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  margin-right: 8px;
  align-self: flex-start;
  overflow: hidden;
`;

const Column = styled.View`
  flex: 1;
  margin-right: 10px;
`;

const NameRow = styled.View`
  width: 100%;
  flex-direction: row;
  height: 16px;
  overflow: hidden;
`;

const Name = styled(Text).attrs({ type: "bold" })`
  line-height: 16px;
  font-size: 13px;
  color: ${colors.black};
`;

const DateText = styled(Text)`
  font-size: 11px;
  height: 100%;
  line-height: 16px;
  color: rgb(155, 155, 155);
`;

const WaveContainer = styled.View`
  width: 100%;
  height: 20px;
  flex-direction: row;
  align-items: center;
`;

const Wave = styled.Image.attrs({
  resizeMode: "cover"
})`
  width: 21.4px;
  height: 17px;
  margin-right: 5px;
`;

const AudioDurationText = styled(Text).attrs({ type: "bold" })`
  font-size: 14px;
  color: rgb(155, 155, 155);
`;

const PlayButton = styled(IconButton)`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.gray200};
  margin-right: 18px;
`;

const LockIcon = styled.Image.attrs({ source: images.lockBlue })`
  position: absolute;
  top: 23.5px;
  left: 4px;
  width: 12px;
  height: 15px;
`;

export function AudioReplyCardContent({
  reply,
  isPlaying,
  onPress,
  onAvatarPress,
  onNamePress,
  onUserTagPress
}: IAudioReplyCardProps) {
  const photo = reply.user.photo;
  const source = photo ? { uri: photo } : images.user;

  return (
    <ContentContainer onPress={onPress}>
      {reply.hidden ? <LockIcon /> : null}
      <Avatar source={source} onPress={onAvatarPress} />
      <Column>
        <NameRow>
          <Name numberOfLines={1} onPress={onNamePress}>
            {reply.user.username}
          </Name>
        </NameRow>
        <WaveContainer>
          <ReplyText onUserPress={onUserTagPress}>
            {reply.tagged_user
              ? `<user>@${reply.tagged_user.username}</user> `
              : ""}
          </ReplyText>
          <Wave source={images.icEqualizBlue} />
          <AudioDurationText>{toMSS(reply.audio_duration)}</AudioDurationText>
        </WaveContainer>
      </Column>
      <PlayButton
        source={isPlaying ? images.btnCommentsPlaying : images.btnCommentsPlay}
        onPress={() => {
          if (reply.audio) {
            getStore().audioStore.pushInstantAudio(reply.audio);
          }
        }}
      />
      <DateText>
        {formatDiffTime(new Date(reply.created_at).getTime())}
      </DateText>
    </ContentContainer>
  );
}
