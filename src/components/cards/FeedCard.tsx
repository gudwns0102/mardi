import _ from "lodash";
import React from "react";
import HTMLView, { HTMLViewNode } from "react-native-htmlview";
import styled from "styled-components/native";

import { images } from "assets/images";
import { IconButton } from "src/components/buttons/IconButton";
import { Text } from "src/components/Text";
import { colors, getBackgroundByIndex } from "src/styles/colors";
import { getPatternByIndex } from "src/utils/ContentPattern";
import { formatDiffTime } from "src/utils/Time";

interface IProps {
  feed: IFeed;
  onPress?: () => any;
  onAvatarPress?: () => any;
  onNamePress?: () => any;
}

interface IState {
  timeString: string;
}

const Container = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  padding: 8px 12px;
  min-height: 56px;
`;

const Avatar = styled(IconButton)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-self: flex-start;
`;

const Body = styled.View`
  flex: 1;
  justify-content: center;
  margin-left: 12px;
  margin-right: 20px;
`;

const ContentImage = styled.Image`
  width: 40px;
  height: 40px;
  align-self: flex-start;
`;

const ContentImageHolder = styled.Image`
  width: 40px;
  height: 40px;
  align-self: flex-start;
`;

const NameText = styled(Text).attrs({ type: "bold" })`
  color: ${colors.mardiBlack};
`;

const styles = {
  span: {
    color: colors.mardiBlack,
    fontFamily: "SpoqaHanSans-Regular"
  },
  time: {
    color: "rgb(155, 155, 155)",
    fontFamily: "SpoqaHanSans-Regular"
  },
  b: {
    color: colors.mardiBlack,
    fontFamily: "SpoqaHanSans-Bold"
  }
};

function createRenderNode(onNamePress?: () => any) {
  return function renderNode(
    node: HTMLViewNode,
    index: number
  ): React.ReactNode {
    if (node.name === "b") {
      const content: string = _.get(node, ["children", 0, "data"], "");
      return (
        <NameText
          key={index}
          onPress={onNamePress ? _.partial(onNamePress, content) : undefined}
        >
          {content}
        </NameText>
      );
    }
  };
}

export class FeedCard extends React.Component<IProps, IState> {
  public feedTime: number = 0;
  public state = {
    timeString: ""
  };

  public componentDidMount() {
    const { feed } = this.props;
    this.feedTime = new Date(feed.time).getTime();
    this.updateTimeString();
    setInterval(this.updateTimeString, 10000);
  }

  public render() {
    const { feed, onPress, onAvatarPress } = this.props;
    return (
      <Container onPress={onPress}>
        <Avatar
          source={
            feed.related_user.photo
              ? { uri: feed.related_user.photo }
              : images.user
          }
          onPress={onAvatarPress}
        />
        <Body>{this.feedContent}</Body>
        {_.get(feed.content, ["image"], null) ? (
          <ContentImage source={{ uri: feed.content!.image! }} />
        ) : (
          <ContentImageHolder
            source={getPatternByIndex(
              _.get(feed.content, ["default_image_pattern_idx"], 0)
            )}
            style={{
              backgroundColor: getBackgroundByIndex(
                _.get(feed.content, ["default_image_color_idx"], 0)
              )
            }}
          />
        )}
      </Container>
    );
  }

  private get feedContent() {
    const { feed, onNamePress } = this.props;
    const { timeString } = this.state;
    const { text: template } = feed;

    return (
      <HTMLView
        value={`<span>${template}<time> ${timeString}</time></span>`}
        stylesheet={styles}
        addLineBreaks={false}
        renderNode={createRenderNode(onNamePress)}
      />
    );
  }

  private updateTimeString = () => {
    const { timeString } = this.state;
    const newTimeString = formatDiffTime(this.feedTime);
    if (newTimeString !== timeString) {
      this.setState({ timeString: newTimeString });
    }
  };
}
