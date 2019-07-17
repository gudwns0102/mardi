import React from "react";
import { FlatList, FlatListProps, ListRenderItem } from "react-native";
import styled from "styled-components/native";

import { ContentEmptyCard } from "src/components/cards/ContentEmptyCard";

interface IProps extends RemoveKeys<FlatListProps<any>, ["renderItem"]> {
  onFirstItemPress: () => void;
}

const Item = styled(ContentEmptyCard)`
  margin-bottom: 10px;
`;

export class ContentEmptyList extends React.Component<IProps> {
  public render() {
    return (
      <FlatList
        {...this.props}
        renderItem={this.renderItem}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    );
  }

  private renderItem: ListRenderItem<any> = ({ index }) => {
    const { onFirstItemPress } = this.props;
    return (
      <Item
        showContent={index === 0}
        // onPress={index === 0 ? onFirstItemPress : undefined}
      />
    );
  };
}
