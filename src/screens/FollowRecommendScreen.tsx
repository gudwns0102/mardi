import { inject, observer } from "mobx-react";
import React from "react";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";
import uuid from "uuid";

import { BackButton } from "src/components/buttons/BackButton";
import { FollowList } from "src/components/lists/FollowList";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { Bold } from "src/components/texts/Bold";
import { IFollowStore } from "src/stores/FollowStore";
import { IRootStore } from "src/stores/RootStore";

interface IInjectProps {
  followStore: IFollowStore;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, any>;
}

interface IState {
  order?: "-num_followers";
}

const Container = styled.View`
  width: 100%;
  flex: 1;
  background-color: rgb(232, 232, 232);
`;

const BackText = styled(Text)`
  font-size: 16px;
  color: rgb(69, 69, 69);
`;

const HeaderTitle = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  line-height: 27px;
  color: rgb(69, 69, 69);
`;

const SectionRow = styled.View`
  flex-direction: row;
  align-items: center;
  height: 40px;
  padding-left: 20px;
`;

const SectionText = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  color: rgb(69, 69, 69);
  margin-right: 10px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 116px;
  height: 24px;
  border-radius: 11.5px;
  padding: 0 10px;
  background-color: white;
`;

const Content = styled(Bold)<{ isActive: boolean }>`
  font-size: 14px;
  color: ${props =>
    props.isActive ? "rgb(25, 86, 212)" : "rgb(155, 155, 155)"};
`;

const StyledFollowList = styled(FollowList)`
  background-color: white;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    followStore: store.followStore
  })
)
@observer
export class FollowRecommendScreen extends React.Component<IProps, IState> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "#EBEBEB"
    }
  };
  public followBundleId: string;

  constructor(props: IProps) {
    super(props);

    props.followStore.createBundle((this.followBundleId = uuid()));

    this.state = {
      order: "-num_followers"
    };
  }

  public componentDidMount() {
    this.followBundle.initializeFollows("RECOMMEND", {
      uuid: "",
      order: this.state.order
    });
  }

  public componentWillUnmount() {
    this.props.followStore.clearBundle(this.followBundleId);
  }

  public render() {
    const { order } = this.state;
    return (
      <>
        <PlainHeader>
          <BackButton onPress={this.goBack} />
          <HeaderTitle>팔로우 추천</HeaderTitle>
          <React.Fragment />
        </PlainHeader>
        <Container>
          <SectionRow>
            <SectionText>전체보기</SectionText>
            <ButtonContainer>
              <Content
                isActive={order === "-num_followers"}
                onPress={this.onFollowerOrderPress}
              >
                팔로워 수
              </Content>
              <Content
                isActive={order === undefined}
                onPress={this.onNewOrderPress}
              >
                신규
              </Content>
            </ButtonContainer>
          </SectionRow>
          <StyledFollowList followBundle={this.followBundle} />
        </Container>
      </>
    );
  }

  private get navigation() {
    return this.props.navigation;
  }

  private get followBundle() {
    return this.props.followStore.bundles.get(this.followBundleId)!;
  }

  private onFollowerOrderPress = () => {
    const { order } = this.state;
    if (order !== "-num_followers") {
      this.setState({ order: "-num_followers" });
      this.followBundle.initializeFollows("RECOMMEND", {
        order: "-num_followers",
        uuid: ""
      });
    }
  };

  private onNewOrderPress = () => {
    const { order } = this.state;
    if (order !== undefined) {
      this.setState({ order: undefined });
      this.followBundle.initializeFollows("RECOMMEND", {
        order: undefined,
        uuid: ""
      });
    }
  };

  private goBack = () => {
    this.navigation.goBack(null);
  };
}

export function navigateFollowRecommendScreen(
  navigation: NavigationScreenProp<any, any>
) {
  navigation.navigate("FollowRecommendScreen");
}
