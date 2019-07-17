import React from "react";
import { TouchableOpacityProps } from "react-native";
import styled from "styled-components/native";

import { images } from "assets/images";
import { Avatar } from "src/components/Avatar";
import { Text } from "src/components/Text";
import { colors } from "src/styles/colors";

interface IProps {
  style?: TouchableOpacityProps["style"];
  recommend: IRecommend;
  onPress?: () => any;
}

const Container = styled.TouchableOpacity`
  width: 100%;
  height: 60px;
  flex-direction: row;
  padding: 14px 0;
  background-color: ${colors.white};
`;

const RecommendAvatar = styled(Avatar).attrs({ diameter: 32 })`
  margin-right: 12px;
`;

const Column = styled.View``;

const Title = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  color: ${colors.mardiBlack};
  height: 25px;
  line-height: 25px;
`;

const PostCount = styled(Text).attrs({ type: "regular" })`
  font-size: 14px;
  color: rgb(176, 176, 176);
  height: 25px;
  line-height: 25px;
`;

export function RecommendCard({ recommend, style, onPress }: IProps) {
  return (
    <Container style={style} onPress={onPress}>
      <RecommendAvatar
        photo={recommend.image}
        defaultSource={images.speak}
        onPress={onPress}
      />
      <Column style={{ transform: [{ translateY: -5 }] }}>
        <Title>{recommend.keyword}</Title>
        <PostCount style={{ transform: [{ translateY: -8 }] }}>
          {recommend.num_contents} 개의 한마디
        </PostCount>
      </Column>
    </Container>
  );
}
