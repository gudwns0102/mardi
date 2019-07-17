import _ from "lodash";
import React from "react";
import { FlatList, FlatListProps, ListRenderItem } from "react-native";
import styled from "styled-components/native";

import { RecommendCard } from "src/components/cards/RecommendCard";

interface IProps extends RemoveKeys<FlatListProps<IRecommend>, ["renderItem"]> {
  onCardPress: (recommend: IRecommend) => any;
}

const Item = styled(RecommendCard)`
  padding-left: 20px;
`;

export class RecommendList extends React.Component<IProps> {
  public render() {
    const { style, ...props } = this.props;
    return (
      <FlatList
        {...props}
        renderItem={this.renderCurationItem}
        keyExtractor={item => item.id.toString()}
        style={[{ width: "100%", flex: 1 }, style]}
      />
    );
  }

  public renderCurationItem: ListRenderItem<IRecommend> = ({ item }) => {
    const { onCardPress } = this.props;
    return <Item recommend={item} onPress={_.partial(onCardPress, item)} />;
  };
}
