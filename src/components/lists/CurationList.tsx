import _ from "lodash";
import React, { ComponentClass } from "react";
import { FlatList, FlatListProps, ListRenderItem } from "react-native";
import styled from "styled-components/native";

import { CurationCard } from "src/components/cards/CurationCard";

interface IProps extends RemoveKeys<FlatListProps<ICuration>, ["renderItem"]> {
  innerRef?: any;
  onCurationPress: (curation: ICuration, index: number) => any;
}

const List = styled<ComponentClass<FlatListProps<ICuration>>>(FlatList)`
  background-color: transparent;
`;

const Item = styled(CurationCard)`
  height: 64px;
`;

class CurationListClass extends React.Component<IProps> {
  public render() {
    const { innerRef, onCurationPress } = this.props;
    const top30Curation = {
      id: 0,
      num_contents: 30,
      question: {
        audio: null,
        category: "",
        id: null,
        text: "금주 인기 Top 30"
      }
    };
    return (
      <List
        {...this.props}
        ref={innerRef}
        renderItem={this.renderCurationItem}
        keyExtractor={item => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          height: "100%",
          paddingLeft: 10,
          paddingVertical: 30,
          alignItems: "center"
        }}
        ListHeaderComponent={
          <Item
            curation={top30Curation}
            onPress={_.partial(onCurationPress, top30Curation, 0)}
          />
        }
      />
    );
  }

  public renderCurationItem: ListRenderItem<ICuration> = ({ item, index }) => {
    const { onCurationPress } = this.props;

    return (
      <Item curation={item} onPress={_.partial(onCurationPress, item, index)} />
    );
  };
}

export const CurationList = React.forwardRef(
  (props: Omit<IProps, "innerRef">, ref) => (
    <CurationListClass {...props} innerRef={ref} />
  )
);
