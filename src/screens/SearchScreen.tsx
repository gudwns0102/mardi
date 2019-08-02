import _ from "lodash";
import { inject, observer } from "mobx-react";
import React from "react";
import { Keyboard } from "react-native";
import {
  NavigationEventSubscription,
  NavigationScreenProp
} from "react-navigation";
import styled from "styled-components/native";
import uuid from "uuid";

import { images } from "assets/images";
import { ContentLayoutCardButton } from "src/components/buttons/ContentLayoutCardButton";
import { ContentLayoutListButton } from "src/components/buttons/ContentLayoutListButton";
import { ContentSortTypeButtonGroup } from "src/components/buttons/ContentSortTypeButtonGroup";
import { IconButton } from "src/components/buttons/IconButton";
import { ContentList } from "src/components/lists/ContentList";
import { CurationList } from "src/components/lists/CurationList";
import { RecommendList } from "src/components/lists/RecommendList";
import { Text } from "src/components/Text";
import { withAudioPlayer } from "src/hocs/withAudioPlayer";
import { navigateListenDetailScreen } from "src/screens/ListenDetailScreen";
import { navigateSearchQuestionScreen } from "src/screens/SearchQuestionScreen";
import { IContentStore } from "src/stores/ContentStore";
import { IQuestionStore } from "src/stores/QuestionStore";
import { IRecommendStore } from "src/stores/RecommendStore";
import { IRootStore } from "src/stores/RootStore";
import { colors } from "src/styles/colors";

interface IInjectProps {
  contentStore: IContentStore;
  questionStore: IQuestionStore;
  recommendStore: IRecommendStore;
}

interface IParams {
  defaultText?: string;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, IParams>;
}

interface IState {
  text: string;
  focused: boolean;
  layoutType: ContentLayoutType;
}

const KeyboardDismissWrapper = styled.TouchableOpacity.attrs({
  activeOpacity: 1
})`
  width: 100%;
  flex: 1;
`;

const SearchInputContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  padding: 0 12px;
  background-color: rgb(241, 241, 241);
`;

const SearchInputDeleteButton = styled(IconButton)`
  position: absolute;
  right: 20px;
  width: 24px;
  height: 24px;
`;

const SearchInput = styled.TextInput.attrs({
  placeholder: "이름 또는 제목을 검색하세요",
  placeholderTextColor: "rgb(180, 180, 180)",
  returnKeyType: "search"
})`
  width: 100%;
  height: 34px;
  font-size: 15px;
  color: rgb(25, 86, 212);
  align-self: center;
  padding: 0 11px;
  border-radius: 8px;
  background-color: ${colors.white};
`;

const BodyContainer = styled.View`
  width: 100%;
  flex: 1;
  background-color: rgb(241, 241, 241);
`;

const CurationContainer = styled.View`
  width: 100%;
  background-color: ${colors.white};
`;

const SectionText = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  color: rgb(69, 69, 69);
  margin-left: 20px;
  margin-right: 10px;
`;

const CurationSectionText = styled(SectionText)`
  margin-top: 10px;
  margin-bottom: 12px;
`;

const RecommendSectionText = styled(SectionText)`
  margin-bottom: 9px;
`;

const ContentCardListContainer = styled.View`
  width: 100%;
  flex: 1;
`;

const ContentCardListHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding-right: 18px;
`;

const ContentCardList = styled(ContentList).attrs({
  contentContainerStyle: { paddingBottom: 54, paddingTop: 8 }
})``;

const StyledContentLayoutCardButton = styled(ContentLayoutCardButton)`
  width: 40px;
`;

const StyledContentLayoutListButton = styled(ContentLayoutListButton)`
  width: 40px;
`;

const Spacer = styled.View`
  flex: 1;
`;

const HasNoResultContainer = styled.View`
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const HasNoResultText = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  color: rgb(25, 86, 212);
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    contentStore: store.contentStore,
    questionStore: store.questionStore,
    recommendStore: store.recommendStore
  })
)
@withAudioPlayer
@observer
export class SearchScreen extends React.Component<IProps, IState> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "rgb(241, 241, 241)"
    }
  };
  public totalContentBundleId: string;
  public searchContentBundleId: string;
  public curationListRef = React.createRef<any>();
  public searchTimer: any;
  public focusListener: NavigationEventSubscription | null = null;

  constructor(props: IProps) {
    super(props);

    props.contentStore.createContentBundle(
      (this.totalContentBundleId = uuid())
    );
    props.contentStore.createContentBundle(
      (this.searchContentBundleId = uuid())
    );

    this.state = {
      text: props.navigation.getParam("defaultText") || "",
      focused: false,
      layoutType: "CARD"
    };
  }

  public componentDidMount() {
    const { questionStore, recommendStore, navigation } = this.props;
    const { text } = this.state;

    questionStore.fetchCurations();
    recommendStore.fetchRecommends();
    this.totalContentBundle.initializeContents({ search: text });
    this.focusListener = navigation.addListener("didFocus", options => {
      const defaultText = _.get(
        options.action,
        ["params", "defaultText"],
        null
      );
      // console.log(options);
      // const lastDefaultText = _.get(
      //   options.lastState,
      //   ["params", "defaultText"],
      //   ""
      // );
      // const defaultText = _.get(options.state.params, ["defaultText"], "");
      // console.log("lastDefaultText: ", lastDefaultText);
      // console.log("defaultText: ", defaultText);
      // console.log("this.state.text: ", this.state.text);
      // if (lastDefaultText !== defaultText) {
      //   this.setState({ text: defaultText }, this.resetSearchTimeout);
      // }
      if (defaultText !== null) {
        this.setState({ text: defaultText }, this.resetSearchTimeout);
      }
    });
  }

  public componentWillUnmount() {
    const { contentStore } = this.props;
    contentStore.clearContentBundle(this.totalContentBundleId);
    contentStore.clearContentBundle(this.searchContentBundleId);

    if (this.focusListener) {
      this.focusListener.remove();
    }
  }

  public render() {
    const { text, focused } = this.state;

    const showCurationSection = !focused && text === "";
    const showTotalContentSection =
      this.totalContentBundle && !focused && text === "";
    const showSearchContentSection = this.searchContentBundle && text !== "";
    const showRecommendSection = focused && text === "";

    return (
      <KeyboardDismissWrapper onPress={Keyboard.dismiss}>
        <SearchInputContainer>
          <SearchInput
            value={text}
            style={{
              color: focused ? "rgb(25, 86, 212)" : "rgb(69, 69, 69)",
              fontFamily: "SpoqaHanSans-Bold"
            }}
            onChangeText={this.onChangeText}
            onFocus={() => {
              this.setState({ focused: true });
            }}
            onBlur={() => {
              this.setState({ focused: false });
            }}
          />
          <SearchInputDeleteButton
            source={images.btnTextDelete}
            onPress={this.onDeleteTextPress}
          />
        </SearchInputContainer>
        <BodyContainer>
          {showCurationSection && this.CurationSection}
          {showTotalContentSection && this.TotalContentSection}
          {showSearchContentSection && this.SearchContentSection}
          {showRecommendSection && this.RecommendSection}
        </BodyContainer>
      </KeyboardDismissWrapper>
    );
  }

  private get CurationSection() {
    const { questionStore } = this.props;
    const curations = Array.from(questionStore.curations.values());

    return (
      <CurationContainer>
        <CurationSectionText>추천주제</CurationSectionText>
        <CurationList
          ref={this.curationListRef}
          data={curations}
          onCurationPress={this.onCurationPress}
        />
      </CurationContainer>
    );
  }

  private get TotalContentSection() {
    const { contentStore } = this.props;
    const { layoutType } = this.state;
    const contentBundle = contentStore.bundles.get(this.totalContentBundleId)!;

    return (
      <ContentCardListContainer>
        {contentBundle ? (
          <ContentCardList
            contentBundle={contentBundle}
            type={layoutType}
            onCardPress={this.onContentPress}
            ListHeaderComponent={
              <ContentCardListHeaderRow style={{ marginVertical: 8 }}>
                <SectionText>전체보기</SectionText>
                <ContentSortTypeButtonGroup
                  sortType={this.totalContentBundle.sortType}
                  onLatestPress={this.onLatestPress}
                  onTrendPress={this.onTrendPress}
                />
                <Spacer />
                <StyledContentLayoutCardButton
                  isActive={layoutType === "CARD"}
                  onPress={() => this.setState({ layoutType: "CARD" })}
                />
                <StyledContentLayoutListButton
                  isActive={layoutType === "LIST"}
                  onPress={() => this.setState({ layoutType: "LIST" })}
                />
              </ContentCardListHeaderRow>
            }
          />
        ) : null}
      </ContentCardListContainer>
    );
  }

  private get SearchContentSection() {
    const { contentStore } = this.props;
    const { layoutType } = this.state;
    const contentBundle = contentStore.bundles.get(this.searchContentBundleId)!;

    return (
      <ContentCardListContainer>
        {contentBundle ? (
          contentBundle.isFirstFetching ? null : contentBundle.hasNoResult ? (
            <HasNoResultContainer>
              <HasNoResultText>검색결과 없음</HasNoResultText>
            </HasNoResultContainer>
          ) : (
            <ContentCardList
              contentBundle={contentBundle}
              type={layoutType}
              onCardPress={this.onContentPress}
              ListHeaderComponent={
                <ContentCardListHeaderRow>
                  <SectionText>검색결과</SectionText>
                  <Spacer />
                  <StyledContentLayoutCardButton
                    isActive={layoutType === "CARD"}
                    onPress={() => this.setState({ layoutType: "CARD" })}
                  />
                  <StyledContentLayoutListButton
                    isActive={layoutType === "LIST"}
                    onPress={() => this.setState({ layoutType: "LIST" })}
                  />
                </ContentCardListHeaderRow>
              }
            />
          )
        ) : null}
      </ContentCardListContainer>
    );
  }

  private get RecommendSection() {
    const { recommendStore } = this.props;

    return (
      <>
        <RecommendSectionText>추천 검색어</RecommendSectionText>
        <RecommendList
          data={recommendStore.recommendArray}
          onCardPress={this.onRecommendPress}
          keyboardShouldPersistTaps="always"
        />
      </>
    );
  }

  private get totalContentBundle() {
    const { contentStore } = this.props;
    return contentStore.bundles.get(this.totalContentBundleId)!;
  }

  private get searchContentBundle() {
    const { contentStore } = this.props;
    return contentStore.bundles.get(this.searchContentBundleId)!;
  }

  private resetSearchTimeout = () => {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      const { text } = this.state;
      this.searchContentBundle.initializeContents({ search: text });
    }, 300);
  };

  private onChangeText = ($text: string) => {
    this.setState({ text: $text }, this.resetSearchTimeout);
  };

  private onCurationPress = (curation: ICuration, index: number) => {
    const { navigation } = this.props;
    navigateSearchQuestionScreen(navigation, {
      questionId: curation.question.id,
      questionText: curation.question.text
    });
  };

  private onContentPress = (item: IContent) => {
    const { navigation } = this.props;
    navigateListenDetailScreen(navigation, {
      contentId: item.id
    });
  };

  private onRecommendPress = (item: IRecommend) => {
    Keyboard.dismiss();
    this.setState({ text: item.keyword }, this.resetSearchTimeout);
  };

  private onDeleteTextPress = () => {
    Keyboard.dismiss();
    this.searchContentBundle.clearContents();
    this.setState({ text: "", focused: false });
  };

  private onLatestPress = () => {
    const { sortType } = this.totalContentBundle;
    if (sortType !== "LATEST") {
      this.totalContentBundle.initializeLatestContents();
    }
  };

  private onTrendPress = () => {
    const { sortType } = this.totalContentBundle;
    if (sortType !== "TREND") {
      this.totalContentBundle.initializeTrendContents();
    }
  };
}

export function navigateSearchScreen(
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) {
  navigation.push("SearchNavigator", params);
}
