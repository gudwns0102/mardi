import _ from "lodash";
import { inject, observer } from "mobx-react";
import React, { ComponentClass } from "react";
import { FlatList, FlatListProps, ListRenderItem } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { getKeywordCategoriesAPI } from "src/apis/keywordCategories/getKeywordCategories";
import { BackButton } from "src/components/buttons/BackButton";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { Bold } from "src/components/texts/Bold";
import { IRootStore } from "src/stores/RootStore";
import { IUserStore } from "src/stores/UserStore";
import { colors } from "src/styles/colors";

export interface ICategory {
  id: number;
  text: string;
  keywords: string[];
  description: string;
}

interface IInjectProps {
  userStore: IUserStore;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, any>;
}

interface IState {
  categories: ICategory[];
  keywordActiveMap: Map<string, boolean>;
}

const HeaderText = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
`;

const SaveText = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  color: ${colors.blue300};
`;

const Label = styled(Text)`
  font-size: 18px;
  margin-bottom: 5px;
`;

const SubLabel = styled(Text)`
  font-size: 15px;
  color: rgb(153, 153, 153);
  margin-bottom: 16px;
`;

const CategoryList = styled<ComponentClass<FlatListProps<ICategory>>>(FlatList)`
  padding: 0 20px;
`;

const KeywordList = styled<ComponentClass<FlatListProps<string>>>(
  FlatList
).attrs({
  horizontal: true,
  scrollEnabled: false,
  contentContainerStyle: {
    width: "100%",
    flexWrap: "wrap"
  }
})``;

const KeywordButton = styled.TouchableOpacity<{ active: boolean }>`
  height: 34px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  margin-right: 8px;
  margin-bottom: 12px;
  background-color: ${props => (props.active ? colors.blue300 : colors.white)};
  border-width: 1px;
  border-color: ${props =>
    props.active ? "transparent" : "rgb(196, 196, 255)"};
`;

const KeywordText = styled(Bold)<{ active: boolean }>`
  font-size: 13px;
  color: ${props => (props.active ? colors.white : colors.blue300)};
  line-height: 18px;
`;

const Padding40 = styled.View`
  margin-bottom: 40px;
`;

@inject(({ store }: { store: IRootStore }) => ({
  userStore: store.userStore
}))
@observer
export class KeywordScreen extends React.Component<IProps, IState> {
  public static opionts: IScreenOptions = {
    statusBarProps: {
      backgroundColor: colors.white
    }
  };

  public state = {
    categories: [],
    keywordActiveMap: new Map()
  };

  public async componentDidMount() {
    const { userStore } = this.props;
    const categories = await getKeywordCategoriesAPI();
    const tags = userStore.client!.tags;
    const keywordActiveMap = new Map<string, boolean>();
    for (const category of categories) {
      for (const keyword of category.keywords) {
        const isActive = tags.includes(keyword);
        keywordActiveMap.set(keyword, isActive);
      }
    }

    this.setState({ categories, keywordActiveMap });
  }

  public render() {
    const { categories } = this.state;
    return (
      <>
        <PlainHeader>
          <BackButton onPress={this.goBack} />
          <HeaderText>키워드 선택</HeaderText>
          <SaveText onPress={this.saveKeyword}>Save</SaveText>
        </PlainHeader>
        <CategoryList
          data={categories}
          renderItem={this.renderCategoryItem}
          ItemSeparatorComponent={Padding40}
          keyExtractor={item => item.id.toString()}
        />
      </>
    );
  }

  public renderCategoryItem: ListRenderItem<ICategory> = ({ item: $item }) => {
    return (
      <React.Fragment>
        <Label>{$item.text}</Label>
        <SubLabel>{$item.description}</SubLabel>
        <KeywordList
          data={$item.keywords}
          renderItem={this.renderKeywordItem}
          keyExtractor={item => item}
        />
      </React.Fragment>
    );
  };

  public renderKeywordItem: ListRenderItem<string> = ({ item }) => {
    const { keywordActiveMap } = this.state;
    const active = keywordActiveMap.get(item);
    return (
      <KeywordButton
        active={active}
        onPress={_.partial(this.toggleKeyword, item)}
      >
        <KeywordText active={active}>{item}</KeywordText>
      </KeywordButton>
    );
  };

  private toggleKeyword = (keyword: string) => {
    const { keywordActiveMap } = this.state;
    const currentState = keywordActiveMap.get(keyword);
    keywordActiveMap.set(keyword, !currentState);
    this.setState({ keywordActiveMap });
    return;
  };

  private saveKeyword = () => {
    const { navigation, userStore } = this.props;
    const { keywordActiveMap } = this.state;
    const tags = Array.from(keywordActiveMap.entries())
      .filter(([__, active]) => active)
      .map(([keyword, __]) => keyword);
    userStore.updateClientKeywords(tags);
    navigation.goBack(null);
  };

  private goBack = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
  };
}

export function navigateKeywordScreen(
  navigation: NavigationScreenProp<any, any>
) {
  navigation.navigate("KeywordScreen");
}
