import _ from "lodash";
import { inject, Observer, observer } from "mobx-react";
import React, { ComponentClass } from "react";
import {
  Dimensions,
  FlatList,
  FlatListProps,
  ListRenderItem,
  RefreshControl
} from "react-native";
import { NavigationScreenProp, withNavigation } from "react-navigation";
import styled from "styled-components/native";

import { ContentCard } from "src/components/cards/ContentCard";
import { ContentListViewCard } from "src/components/cards/ContentListViewCard";
import { navigateReplyScreen } from "src/screens/ReplyScreen";
import { navigateUserPageScreen } from "src/screens/UserPageScreen";
import { IAudioStore } from "src/stores/AudioStore";
import { IContentBundle } from "src/stores/ContentBundle";
import { IContentStore } from "src/stores/ContentStore";
import { IRootStore } from "src/stores/RootStore";
import { IUserStore } from "src/stores/UserStore";

interface IInjectProps {
  audioStore?: IAudioStore;
  contentStore?: IContentStore;
  userStore?: IUserStore;
}

interface IProps
  extends RemoveKeys<
      FlatListProps<IContent>,
      ["renderItem", "data", "onRefresh"]
    >,
    IInjectProps {
  innerRef?: any;
  navigation: NavigationScreenProp<any, any>;
  type?: ContentLayoutType;
  contentBundle: IContentBundle;
  onCardPress?: (item: IContent) => any;
  onRefresh?: (defaultHandler: () => any) => any;
}

const { width } = Dimensions.get("window");

const List = styled<ComponentClass<FlatListProps<IContent>>>(FlatList)`
  width: 100%;
`;

const ContentCardViewItem = styled(ContentCard).attrs({
  showFooterIcons: true
})`
  margin: 6px 0px;
  width: ${width - 32}px;
  align-self: center;
`;

const ContentListViewItem = styled(ContentListViewCard)`
  margin: 4px 0;
  width: ${width - 32}px;
  align-self: center;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    audioStore: store.audioStore,
    contentStore: store.contentStore,
    userStore: store.userStore
  })
)
@observer
class C extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const { innerRef, onRefresh, type = "CARD", ...props } = this.props;

    const data = props.contentBundle.contentArray;

    return (
      <List
        ref={innerRef}
        data={data}
        renderItem={
          type === "CARD" ? this.renderCardViewItem : this.renderListViewItem
        }
        keyExtractor={this.keyExtractor}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0.1}
        onRefresh={props.contentBundle.refreshContents}
        refreshing={props.contentBundle.refreshing}
        refreshControl={
          <RefreshControl
            refreshing={props.contentBundle.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        {...props}
      />
    );
  }

  private get navigation() {
    return this.props.navigation;
  }

  private renderCardViewItem: ListRenderItem<IContent> = ({ item }) => {
    const { audioStore, contentStore } = this.props;

    return (
      <Observer>
        {() => {
          const currentAudio = audioStore!.currentAudio;
          const isPlaying =
            currentAudio && audioStore!.playing
              ? currentAudio.id === item.id
              : false;
          return (
            <ContentCardViewItem
              content={item}
              onPress={this.onCardPress(item)}
              onQuestionPress={
                item.question
                  ? _.partial(this.onQuestionPress, item.question)
                  : undefined
              }
              onAvatarPress={_.partial(this.onAvatarPress, item.user.uuid)}
              onHeartPress={_.partial(contentStore!.clickHeart, item.id)}
              onCommentPress={_.partial(this.onCommentPress, item)}
              onPlayPress={_.partial(this.onPlayPress, item)}
              playing={isPlaying}
            />
          );
        }}
      </Observer>
    );
  };

  private renderListViewItem: ListRenderItem<IContent> = ({ item }) => {
    const { audioStore, contentStore } = this.props;

    return (
      <Observer>
        {() => {
          const currentAudio = audioStore!.currentAudio;
          const isPlaying =
            currentAudio && audioStore!.playing
              ? currentAudio.id === item.id
              : false;
          return (
            <ContentListViewItem
              content={item}
              onPress={this.onCardPress(item)}
              onQuestionPress={
                item.question
                  ? _.partial(this.onQuestionPress, item.question)
                  : undefined
              }
              onAvatarPress={_.partial(this.onAvatarPress, item.user.uuid)}
              onHeartPress={_.partial(contentStore!.clickHeart, item.id)}
              onPlayPress={_.partial(this.onPlayPress, item)}
              playing={isPlaying}
            />
          );
        }}
      </Observer>
    );
  };

  private onCardPress = (item: IContent) => {
    const { onCardPress } = this.props;

    return () => {
      if (onCardPress) {
        onCardPress(item);
      }
    };
  };

  private onQuestionPress = (
    question: Pick<IQuestion, "id" | "category" | "text">
  ) => {
    this.navigation.navigate("SearchQuestionScreen", {
      questionId: question.id,
      questionText: question.text
    });
  };

  private onEndReached = () => {
    const { contentBundle } = this.props;
    contentBundle.appendContents();
  };

  private onAvatarPress = (uuid: IContent["user"]["uuid"]) => {
    navigateUserPageScreen(this.navigation, { uuid });
  };

  private onPlayPress = (content: IContent) => {
    const { audioStore } = this.props;
    audioStore!.pushAudio(content);
  };

  private onCommentPress = (content: IContent) => {
    navigateReplyScreen(this.navigation, {
      contentId: content.id,
      mode: "audio",
      showRecorder: true
    });
  };

  private keyExtractor = (item: IContent) => item.id.toString();

  private onRefresh = () => {
    const { contentBundle, onRefresh } = this.props;

    if (onRefresh) {
      onRefresh(contentBundle.refreshContents);
      return;
    }

    contentBundle.refreshContents();
  };
}

export const ContentList = withNavigation(
  React.forwardRef(
    (
      props: RemoveKeys<IProps, ["innerRef", "audioStore", "contentStore"]>,
      ref
    ) => <C {...props} innerRef={ref} />
  )
);
