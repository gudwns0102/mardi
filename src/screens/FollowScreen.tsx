import { inject, observer } from "mobx-react";
import React from "react";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";
import createUUID from "uuid";

import { FollowList } from "src/components/lists/FollowList";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { FollowBundleType, IFollowBundle } from "src/stores/FollowBundle";
import { IFollowStore } from "src/stores/FollowStore";
import { IRootStore } from "src/stores/RootStore";

interface IInjectProps {
  followStore: IFollowStore;
}

interface IParams {
  uuid: IUser["uuid"];
  followBundleType: FollowBundleType;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, IParams>;
}

const Close = styled(Text)`
  font-size: 16px;
  line-height: 27px;
  color: rgb(177, 177, 177);
`;

const HeaderTitle = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  line-height: 27px;
  color: rgb(69, 69, 69);
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    followStore: store.followStore
  })
)
@observer
export class FollowScreen extends React.Component<IProps> {
  public uuid: IUser["uuid"];
  public followBundleId: string;
  public followBundleType: FollowBundleType;
  public followBundle: IFollowBundle;

  constructor(props: IProps) {
    super(props);

    this.uuid = props.navigation.getParam("uuid");
    this.followBundleId = createUUID();
    this.followBundleType = props.navigation.getParam("followBundleType");
    this.followBundle = props.followStore.createBundle(this.followBundleId);
  }

  public componentDidMount() {
    this.followBundle.initializeFollows(this.followBundleType, {
      uuid: this.uuid
    });
  }

  public componentWillUnmount() {
    const { followStore } = this.props;
    followStore.clearBundle(this.followBundleId);
  }

  public render() {
    const { followBundle } = this;
    return (
      <>
        <PlainHeader>
          <Close onPress={this.goBack}>닫기</Close>
          <HeaderTitle>
            {this.followBundleType === "FOLLOWER" ? "팔로워" : "팔로잉"}
          </HeaderTitle>
        </PlainHeader>
        <FollowList followBundle={followBundle} />
      </>
    );
  }

  private goBack = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
  };
}

export const navigateFollowScreen = (
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) => {
  navigation.push("FollowScreen", params);
};
