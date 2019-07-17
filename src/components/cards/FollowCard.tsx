import React from "react";
import styled from "styled-components/native";

import { Avatar } from "src/components/Avatar";
import { FollowButton } from "src/components/buttons/FollowButton";
import { Text } from "src/components/Text";

interface IProps {
  name: string;
  username: string | null;
  photo: string | null;
  followedByMe: boolean;
  onAvatarPress?: () => any;
  onFollowPress?: () => any;
  showFollowButton?: boolean;
}

const Container = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  height: 56px;
  flex-direction: row;
  align-items: center;
`;

const Body = styled.View`
  flex: 1;
  padding-horizontal: 10px;
`;

const Name = styled(Text).attrs({ type: "bold", numberOfLines: 1 })`
  font-size: 16px;
  height: 20px;
  line-height: 20px;
  color: rgb(69, 69, 69);
`;

const Nickname = styled(Text)`
  font-size: 10px;
  color: rgb(155, 155, 155);
  height: 15px;
`;

function FollowCardClass({ showFollowButton = true, ...props }: IProps) {
  return (
    <Container>
      <Avatar photo={props.photo} onPress={props.onAvatarPress} />
      <Body>
        <Name onPress={props.onAvatarPress}>{props.username}</Name>
        <Nickname onPress={props.onAvatarPress}>{props.name}</Nickname>
      </Body>
      {showFollowButton ? (
        <FollowButton
          isFollowing={props.followedByMe}
          onPress={props.onFollowPress}
        />
      ) : null}
    </Container>
  );
}

export const FollowCard = FollowCardClass;
