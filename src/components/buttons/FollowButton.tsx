import React from "react";
import styled from "styled-components/native";

import { Button } from "src/components/buttons/Button";
import { colors } from "src/styles/colors";

interface IProps {
  onPress?: () => void;
  isFollowing: boolean;
}

const Container = styled(Button)<{ active: boolean }>`
  width: 90px;
  height: 30px;
  background-color: ${props => (props.active ? colors.white : colors.blue300)};
  border-radius: 6px;
  border-width: 1px;
  border-color: ${props =>
    props.active ? "rgb(155, 155, 155)" : "transparent"};
`;

const activeContentStyle = {
  fontSize: 13,
  lineHeight: 20,
  color: "rgb(155, 155, 155)",
};

const inactiveContentStyle = {
  fontSize: 13,
  lineHeight: 20,
  color: colors.white
};

export function FollowButton({ onPress, isFollowing }: IProps) {
  return (
    <Container
      active={isFollowing}
      onPress={onPress}
      textProps={{
        type: "bold",
        style: isFollowing ? activeContentStyle : inactiveContentStyle
      }}
    >
      {isFollowing ? "팔로잉" : "팔로우"}
    </Container>
  );
}
