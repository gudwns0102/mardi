import React, { useCallback } from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { images } from "assets/images";
import { Observer } from "mobx-react";
import { NavigationScreenProp, withNavigation } from "react-navigation";
import { Button } from "src/components/buttons/Button";
import { Text } from "src/components/Text";
import { IMagazineContent } from "src/models/MagazineContent";
import { navigateMagazineReplyScreen } from "src/screens/MagazineReplyScreen";
import { navigateUserPageScreen } from "src/screens/UserPageScreen";
import { shadow } from "src/utils/Shadow";

interface IProps extends ViewProps {
  navigation: NavigationScreenProp<any, any>;
  magazineId: number;
  magazineContent: IMagazineContent;
}

const Container = styled.View`
  padding: 18px 18px 12px;
  background-color: white;
  border-radius: 2px;
`;

const Title = styled(Text).attrs({ type: "bold" })`
  font-size: 28px;
  line-height: 36px;
  color: rgb(0, 0, 0);
  margin-bottom: 10px;
`;

const Content = styled(Text)`
  font-size: 16px;
  color: rgb(0, 0, 0);
  margin-bottom: 16px;
`;

const Footer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const AvatarWrapper = styled.TouchableOpacity``;

const Avatar = styled.Image.attrs({ source: images.airplane })`
  width: 26px;
  height: 26px;
  border-radius: 13px;
  margin-right: 9px;
`;

const Name = styled(Text).attrs({ type: "bold" })`
  font-size: 13px;
  color: rgb(155, 155, 155);
  flex: 1;
`;

const CommentButton = styled(Button)`
  height: 36px;
  padding: 0 6px;
  border-radius: 8px;
  background-color: white;
  ${shadow({ opacity: 0.09, shadowOffset: { x: 0, y: 4 } })};
  margin-right: 7px;
`;

const CommentIcon = styled.Image.attrs({ source: images.btnContentsComment })`
  width: 24px;
  height: 24px;
`;

const CommentText = styled(Text).attrs({ type: "bold" })`
  width: 44px;
  font-size: 14px;
  color: rgb(0, 0, 0);
  text-align: center;
`;

const ShareButton = styled(Button)`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: white;
  ${shadow({ opacity: 0.09, shadowOffset: { x: 0, y: 4 } })};
`;

const ShareIcon = styled.Image.attrs({ source: images.btnCommonShare })`
  width: 24px;
  height: 24px;
`;

export const MagazineContentCard = withNavigation(
  ({ navigation, magazineId, magazineContent, ...props }: IProps) => {
    const onAvatarPress = useCallback(() => {
      const { link_user } = magazineContent;
      if (link_user && link_user.uuid) {
        navigateUserPageScreen(navigation, { uuid: link_user.uuid });
      }
    }, [magazineContent]);

    const onCommentPress = useCallback(() => {
      navigateMagazineReplyScreen(navigation, {
        magazineId,
        magazineContentId: magazineContent.id,
        mode: "audio",
        showRecorder: true
      });
    }, [magazineContent]);

    return (
      <Observer>
        {() => (
          <Container {...props}>
            <Title numberOfLines={2}>{magazineContent.title}</Title>
            <Content numberOfLines={2}>{magazineContent.text}</Content>
            <Footer>
              <AvatarWrapper
                disabled={!magazineContent.link_user}
                onPress={onAvatarPress}
              >
                <Avatar
                  source={
                    magazineContent.picture
                      ? { uri: magazineContent.picture }
                      : images.airplane
                  }
                />
              </AvatarWrapper>
              <Name>{magazineContent.user_name}</Name>
              <CommentButton onPress={onCommentPress}>
                <CommentIcon />
                <CommentText>{magazineContent.num_replies || 0}</CommentText>
              </CommentButton>
              <ShareButton>
                <ShareIcon />
              </ShareButton>
            </Footer>
          </Container>
        )}
      </Observer>
    );
  }
);
