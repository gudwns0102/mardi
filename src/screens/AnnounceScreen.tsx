import _ from "lodash";
import { inject, observer } from "mobx-react";
import React, { ComponentClass } from "react";
import { FlatList, FlatListProps, ListRenderItem } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { BackButton } from "src/components/buttons/BackButton";
import { AnnounceCard } from "src/components/cards/AnnounceCard";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { IAnnounce, IAnnounceStore } from "src/stores/AnnounceStore";
import { IAudioStore } from "src/stores/AudioStore";
import { FollowBundleType } from "src/stores/FollowBundle";
import { IRootStore } from "src/stores/RootStore";
import { colors } from "src/styles/colors";
import { deviceWidth } from "src/utils/Dimensions";

interface IInjectProps {
  announceStore: IAnnounceStore;
  audioStore: IAudioStore;
}

interface IParams {
  uuid: IUser["uuid"];
  followBundleType: FollowBundleType;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, IParams>;
}

interface IState {
  showContentMap: Map<IAnnounce["id"], boolean>;
}

const HeaderTitle = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  line-height: 27px;
  color: rgb(69, 69, 69);
`;

const AnnounceList = styled<ComponentClass<FlatListProps<IAnnounce>>>(FlatList)`
  width: 100%;
  flex: 1;
`;

const Seperator = styled.View`
  width: ${deviceWidth - 40};
  height: 1px;
  align-self: center;
  background-color: rgb(236, 236, 236);
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    announceStore: store.announceStore,
    audioStore: store.audioStore
  })
)
@observer
export class AnnounceScreen extends React.Component<IProps, IState> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: colors.white
    }
  };

  constructor(props: IProps) {
    super(props);

    this.state = {
      showContentMap: new Map()
    };
  }

  public async componentDidMount() {
    const { announceStore } = this.props;
    const showContentMap = new Map();
    const announces = await announceStore.initializeAnnounces();
    announces.forEach(announce => showContentMap.set(announce.id, false));
    this.setState({ showContentMap });
  }

  public render() {
    const { audioStore, announceStore } = this.props;
    const data = announceStore.announceArray;
    return (
      <>
        <PlainHeader>
          <BackButton onPress={this.goBack} />
          <HeaderTitle>공지사항</HeaderTitle>
        </PlainHeader>
        <AnnounceList
          data={data}
          extraData={{
            instantAudio: audioStore.instantAudio,
            instantPlaying: audioStore.instantPlaying
          }}
          renderItem={this.renderAnnounceItem}
          keyExtractor={this.keyExtractor}
          ItemSeparatorComponent={Seperator}
        />
      </>
    );
  }

  private renderAnnounceItem: ListRenderItem<IAnnounce> = ({ item }) => {
    const { audioStore } = this.props;
    const { showContentMap } = this.state;
    const isPlaying = item.audio
      ? audioStore.instantAudio === item.audio && audioStore.instantPlaying
      : false;
    return (
      <AnnounceCard
        announce={item}
        showContent={!!showContentMap.get(item.id)}
        onPress={_.partial(this.onAnnouncePress, item.id)}
        onListenPress={
          item.audio ? _.partial(this.onListenPress, item) : undefined
        }
        isPlaying={isPlaying}
      />
    );
  };

  private onAnnouncePress = (id: IAnnounce["id"]) => {
    const newShowContentMap = new Map(this.state.showContentMap);
    const show = !!newShowContentMap.get(id);
    newShowContentMap.set(id, !show);
    this.setState({ showContentMap: newShowContentMap });
  };

  private onListenPress = (announce: IAnnounce) => {
    const { audioStore, announceStore } = this.props;
    const prevAudio = audioStore.instantAudio;
    if (announce.audio) {
      audioStore.pushInstantAudio(announce.audio);

      if (
        _.every([
          audioStore.instantPlaying,
          prevAudio !== announce.audio,
          audioStore.instantAudio === announce.audio
        ])
      ) {
        announceStore.countAnnouncePlay(announce.id);
      }
    }
  };

  private keyExtractor = (item: IAnnounce) => item.id.toString();

  private goBack = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
  };
}

export const navigateAnnounceScreen = (
  navigation: NavigationScreenProp<any, any>
) => {
  navigation.push("AnnounceScreen");
};
