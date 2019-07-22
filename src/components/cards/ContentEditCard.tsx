import { BlurView } from "@react-native-community/blur";
import _ from "lodash";
import React from "react";
import { ImageProps, ViewProps } from "react-native";
import styled from "styled-components/native";

import { images } from "assets/images";
import { IconButton } from "src/components/buttons/IconButton";
import { Bold } from "src/components/texts/Bold";
import {
  getBackgroundByIndex,
  getPatternByIndex
} from "src/utils/ContentPattern";
import { shadow } from "src/utils/Shadow";

interface IProps {
  style?: ViewProps["style"];
  title: IContent["title"];
  questionText?: string;
  image?: ImageProps["source"];
  name: IContent["user"]["name"];
  avatar: IContent["user"]["photo"];
  onPress?: () => any;
  patternIndex: number;
  backgroundIndex: number;
}

const Container = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  width: 100%;
  height: 236px;
  border-radius: 14px;
  background-color: white;
  padding: 8px;

  ${shadow({ opacity: 0.09 })}
`;

const InnerContainer = styled.ImageBackground`
  width: 100%;
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
`;

const BodyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 42px 15px 0;
`;

const BodyContent = styled(Bold)`
  color: white;
`;

const Subtitle = styled(BodyContent).attrs({ numberOfLines: 1 })`
  font-size: 12px;
  text-align: center;
`;

const Title = styled(BodyContent).attrs({ numberOfLines: 3 })`
  font-size: 19px;
  text-align: center;
  width: 287px;
  min-height: 58px;
`;

const FooterContainer = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  height: 42px;
  flex-direction: row;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
  border-top-width: 1px;
  border-top-color: rgba(255, 255, 255, 0.9);
`;

const Avatar = styled(IconButton)`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-right: 9px;
  overflow: hidden;
  margin-left: 6px;
`;

const FooterContent = styled(Bold)`
  font-size: 13px;
  color: black;
`;

const FooterButtonWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-right: 12px;
`;

const HeartButton = styled(IconButton)`
  width: 28px;
  height: 28px;
`;

const HeartCount = styled(Bold)`
  min-width: 44px;
  font-size: 16px;
  text-align: center;
  color: #454545;
`;

const PlayButton = styled(IconButton)`
  width: 28px;
  height: 28px;
`;

const PlayCount = styled(Bold)`
  min-width: 44px;
  font-size: 16px;
  text-align: center;
  color: rgb(25, 86, 212);
`;

const Divider = styled.View`
  width: 1px;
  height: 20px;
  background-color: rgb(153, 153, 153);
  margin-left: 10px;
  margin-right: 5px;
`;

const PhotoButton = styled.View`
  position: absolute;
  top: 12px;
  height: 30px;
  flex-direction: row;
  align-items: center;
  border-radius: 15px;
  padding-left: 7px;
  padding-right: 10px;
  background-color: rgba(0, 0, 0, 0.3);
`;

const PhotoIcon = styled.Image.attrs({ source: images.camera })`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const PhotoButtonText = styled(Bold)`
  font-size: 16px;
  height: 24px;
  line-height: 24px;
  color: white;
  text-align: right;
`;

const BlurLayer = styled(BlurView)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export function ContentEditCard({
  style,
  title,
  questionText,
  image,
  name,
  avatar,
  onPress,
  patternIndex,
  backgroundIndex
}: IProps) {
  const source = avatar ? { uri: avatar } : images.user;
  return (
    <Container style={style} onPress={onPress}>
      <InnerContainer
        source={image || getPatternByIndex(patternIndex)}
        style={{ backgroundColor: getBackgroundByIndex(backgroundIndex) }}
        imageStyle={{ resizeMode: image ? "cover" : "repeat" }}
      >
        <BodyContainer>
          <PhotoButton>
            <PhotoIcon />
            <PhotoButtonText>사진넣기</PhotoButtonText>
          </PhotoButton>
          {questionText ? <Subtitle>"{questionText}"</Subtitle> : null}
          <Title>{title}</Title>
        </BodyContainer>
        <FooterContainer>
          <BlurLayer blurAmount={3} blurType="light" />
          <Avatar source={source} activeOpacity={1} />
          <FooterContent>{name}</FooterContent>
          <FooterButtonWrapper>
            <HeartButton source={images.heartGray} activeOpacity={1} />
            <HeartCount>0</HeartCount>
            <Divider />
            <PlayButton source={images.playBlue} activeOpacity={1} />
            <PlayCount>0</PlayCount>
          </FooterButtonWrapper>
        </FooterContainer>
      </InnerContainer>
    </Container>
  );
}
