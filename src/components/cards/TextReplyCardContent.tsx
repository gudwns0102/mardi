import React from "react";
import styled from "styled-components/native";

import { images } from "assets/images";
import { IconButton } from "src/components/buttons/IconButton";
import { Text } from "src/components/Text";
import { ReplyText } from "src/components/texts/ReplyText";
import { colors } from "src/styles/colors";
import { deviceWidth } from "src/utils/Dimensions";
import { formatDiffTime } from "src/utils/Time";

export interface ITextReplyCallbackProps {
  onPress?: () => any;
  onAvatarPress?: () => any;
  onNamePress?: () => any;
  onUserTagPress?: () => any;
  onLinkPress?: (link: string) => any;
  onTagPress?: (tag: string) => any;
}

export interface ITextReplyCardProps extends ITextReplyCallbackProps {
  reply: ITextReply;
}

const ContentContainer = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  width: ${deviceWidth};
  padding-vertical: 12px;
  padding-horizontal: 20px;
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
  height: 100%;
`;

const NameRow = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  height: 16px;
`;

const Name = styled(Text).attrs({ type: "bold" })`
  height: 16px;
  line-height: 16px;
  font-size: 13px;
  color: ${colors.black};
  margin-right: 5px;
`;

const DateText = styled(Text)`
  font-size: 11px;
  height: 16px;
  line-height: 16px;
  color: rgb(155, 155, 155);
`;

const LockIcon = styled.Image.attrs({ source: images.lockBlue })`
  position: absolute;
  top: 23.5px;
  left: 4px;
  width: 12px;
  height: 15px;
`;

export function TextReplyCardContent({
  reply,
  onPress,
  onAvatarPress,
  onNamePress,
  onUserTagPress,
  onLinkPress,
  onTagPress
}: ITextReplyCardProps) {
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
          <DateText>
            {formatDiffTime(new Date(reply.created_at).getTime())}
          </DateText>
        </NameRow>
        <ReplyText
          onLinkPress={onLinkPress}
          onTagPress={onTagPress}
          onUserPress={onUserTagPress}
        >
          {(reply.tagged_user
            ? `<user>@${reply.tagged_user.username}</user> `
            : "") + reply.text}
        </ReplyText>
      </Column>
    </ContentContainer>
  );
}
