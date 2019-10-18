import _ from "lodash";
import React from "react";
import { Animated, Dimensions, SectionListData } from "react-native";
import { NavigationScreenProp, SectionList } from "react-navigation";
import styled from "styled-components/native";

import { images } from "assets/images";
import { IconButton } from "src/components/buttons/IconButton";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { colors } from "src/styles/colors";

interface IProps {
  navigation: NavigationScreenProp<any, any>;
}

const Container = styled.ScrollView`
  width: 100%;
  flex: 1;
  background-color: #ebebeb;
`;

const Header = styled(PlainHeader)`
  background-color: rgba(247, 247, 247, 0.8);
`;

const Back = styled(IconButton).attrs({ source: images.btnCommonBack })`
  width: 24px;
  height: 24px;
`;

const HeaderTitle = styled(Text).attrs({ type: "bold" })`
  font-size: 15px;
  line-height: 24px;
  color: rgb(69, 69, 69);
`;

const SectionHeader = styled.View<{ backgroundColor: string }>`
  justify-content: center;
  width: 294px;
  height: 32px;
  padding: 0 9px;
  background-color: ${props => props.backgroundColor};
  margin-bottom: 8px;
`;

const SectionText = styled(Text).attrs({ type: "bold" })`
  font-size: 15px;
  color: ${colors.white};
`;

const PrevMagazineContainer = styled.View`
  padding: 18px 18px 12px;
  background-color: white;
  margin: 0 12px 8px 9px;
`;

const PrevMagazineTitle = styled(Text).attrs({ type: "bold" })`
  font-size: 28px;
  line-height: 36px;
  color: rgb(0, 0, 0);
  margin-bottom: 10px;
`;

const Name = styled(Text).attrs({ type: "bold" })`
  font-size: 13px;
  color: rgb(155, 155, 155);
  flex: 1;
`;

export class PrevMagazineScreen extends React.Component<IProps> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "rgba(247, 247, 247, 0.8)"
    }
  };

  public scroll = new Animated.Value(0);

  public render() {
    const { navigation } = this.props;
    return (
      <Container>
        <Header>
          <Back onPress={() => navigation.goBack(null)} />
          <HeaderTitle>지난호 보기</HeaderTitle>
          <React.Fragment />
        </Header>
        <SectionList
          contentContainerStyle={{
            paddingTop: 9
          }}
          sections={[
            {
              data: [
                {
                  title: "유명한 일반인으로\n사는 것",
                  author: "Kimmy Kim"
                }
              ],
              title: "#13 - 글자가 냐하하",
              color: "rgb(187, 57, 119)"
            },
            {
              data: [
                {
                  title: "asdf",
                  author: "Kimmy Kim"
                }
              ],
              title: "#12 - 호별제목텍스트글자수는최대열여섯",
              color: "rgb(255,131,80)"
            }
          ]}
          renderItem={({ item }) => {
            return (
              <PrevMagazineContainer>
                <PrevMagazineTitle>{item.title}</PrevMagazineTitle>
                <Name>{item.author}</Name>
              </PrevMagazineContainer>
            );
          }}
          renderSectionHeader={({ section }) => {
            return (
              <SectionHeader backgroundColor={section.color}>
                <SectionText>{section.title}</SectionText>
              </SectionHeader>
            );
          }}
        />
      </Container>
    );
  }

  //   public renderSectionHeader: (info: {
  //     section: SectionListData<IMagazine>;
  // }) = ({ section }) => {
  //   section.titl
  // };
}

export function navigatePrevMagazineScreen(
  navigation: NavigationScreenProp<any, any>
) {
  navigation.navigate("PrevMagazineScreen");
}
