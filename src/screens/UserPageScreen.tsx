import _ from "lodash";
import { inject, observer } from "mobx-react";
import React, { ComponentClass } from "react";
import { FlatList, FlatListProps, ListRenderItem } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";
import createUUID from "uuid";

import { images } from "assets/images";
import { Button } from "src/components/buttons/Button";
import { IconButton } from "src/components/buttons/IconButton";
import { UserPageListenButton } from "src/components/buttons/UserPageListenButton";
import { UserPageRecordButton } from "src/components/buttons/UserPageRecordButton";
import { ContentLayoutSelector } from "src/components/ContentLayoutSelector";
import { ContentList } from "src/components/lists/ContentList";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { HedaerText } from "src/components/texts/HeaderText";
import { withAudioPlayer } from "src/hocs/withAudioPlayer";
import { navigateFollowScreen } from "src/screens/FollowScreen";
import { navigateIntroRecordScreen } from "src/screens/IntroRecordScreen";
import { navigateListenDetailScreen } from "src/screens/ListenDetailScreen";
import { navigateProfileEditScreen } from "src/screens/ProfileEditScreen";
import { navigateQuestionScreen } from "src/screens/QuestionScreen";
import { navigateSettingScreen } from "src/screens/SettingScreen";
import { IAudioStore } from "src/stores/AudioStore";
import { IAuthStore } from "src/stores/AuthStore";
import { IContentBundle } from "src/stores/ContentBundle";
import { IContentStore } from "src/stores/ContentStore";
import { IRootStore } from "src/stores/RootStore";
import { IUserStore } from "src/stores/UserStore";
import { colors } from "src/styles/colors";

interface IInjectProps {
  audioStore: IAudioStore;
  authStore: IAuthStore;
  contentStore: IContentStore;
  userStore: IUserStore;
}

interface IParams {
  uuid: IUser["uuid"];
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, IParams>;
}

interface IState {
  uuid: string;
  isMypage: boolean;
  contentLayoutType: ContentLayoutType;
}

const BackButton = styled(IconButton).attrs({ source: images.btnCommonBack })`
  width: 24px;
  height: 24px;
`;

const SettingButton = styled(IconButton).attrs({ source: images.setting })`
  width: 24px;
  height: 24px;
`;

const Container = styled.View`
  width: 100%;
  flex: 1;
`;

const ProfileContainer = styled.View`
  width: 100%;
  align-items: center;
  padding: 17px 20px 0px;
`;

const AvatarRecordRow = styled.View<{ hasIntro: boolean }>`
  flex-direction: row;
  height: ${props => (props.hasIntro ? 74 : 64)};
  align-items: ${props => (props.hasIntro ? "flex-start" : "center")};
  justify-content: ${props => (props.hasIntro ? "flex-start" : "center")};
  margin-top: 12px;
  margin-bottom: ${props => (props.hasIntro ? 16 : 34)};
  margin-right: ${props => (props.hasIntro ? 0 : 9)};
`;

const Avatar = styled.Image`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  margin-bottom: 6px;
`;

const ProfileBottomRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-left: 12px;
  padding-right: 6px;
  padding-bottom: 10px;
  border-bottom-width: 1px;
  border-bottom-color: rgb(236, 236, 236);
`;

const RowSpacer = styled.View`
  flex: 1;
`;

const Name = styled(Text).attrs({ type: "bold" })`
  flex: 1;
  font-size: 16px;
  line-height: 20px;
  color: ${colors.greyishBrown};
  margin-bottom: 9px;
`;

const InactiveButton = styled(Button).attrs({
  textProps: {
    type: "bold",
    style: {
      fontSize: 13,
      color: "rgb(155, 155, 155)"
    }
  }
})`
  width: 100px;
  height: 30px;
  border-radius: 9px;
  padding: 0 12px;
  background-color: ${colors.white};
  border-color: rgb(155, 155, 155);
  border-width: 1px;
`;

const ActiveButton = styled(Button).attrs({
  textProps: {
    type: "bold",
    style: {
      fontSize: 13,
      color: colors.white
    }
  }
})`
  width: 100px;
  height: 30px;
  border-radius: 6px;
  padding: 0 12px;
  background-color: ${colors.blue300};
`;

const InfoColumn = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  align-items: center;
  margin-right: 18px;
`;

const Count = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  color: ${colors.mardiBlack};
  line-height: 20px;
  align-self: center;
`;

const Label = styled(Text)`
  font-size: 12px;
  color: ${colors.gray400};
`;

const TagList = styled<ComponentClass<FlatListProps<string>>>(FlatList).attrs({
  contentContainerStyle: {
    alignItems: "center"
  },
  horizontal: true,
  showsHorizontalScrollIndicator: false
})`
  width: 100%;
  height: 44px;
`;

const TagItem = styled(Text)`
  font-size: 12px;
  color: ${colors.blue300};
  margin: 0 10px;
`;

const EmptyContainer = styled.View`
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
`;

const EmptyText = styled(Text)`
  color: rgb(155, 155, 155);
  font-size: 15px;
  line-height: 20px;
  text-align: center;
  margin-bottom: 12px;
`;

const EmptyTouchableText = styled(Text).attrs({ type: "bold" })`
  color: ${colors.blue300};
  font-size: 12px;
  text-decoration-line: underline;
`;

const StyledUserPageRecordButton = styled(UserPageRecordButton)`
  margin-bottom: 15px;
`;

const StyledUserPageListenButton = styled(UserPageListenButton)`
  margin-bottom: 15px;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    audioStore: store.audioStore,
    authStore: store.authStore,
    contentStore: store.contentStore,
    userStore: store.userStore
  })
)
@withAudioPlayer
@observer
export class UserPageScreen extends React.Component<IProps, IState> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "rgba(247, 247, 247, 0.8)"
    }
  };

  public contentBundleId = createUUID();
  public contentBundle: IContentBundle;
  public isMypageScreen: boolean;

  constructor(props: IProps) {
    super(props);

    const uuid = _.defaultTo(
      props.navigation.getParam("uuid"),
      props.userStore.clientId
    );

    this.isMypageScreen = props.navigation.state.routeName === "MypageScreen";

    const isMypage = uuid === props.userStore.clientId;
    this.contentBundle = props.contentStore.createContentBundle(
      this.contentBundleId
    );

    this.state = {
      uuid: _.defaultTo(
        props.navigation.getParam("uuid"),
        props.userStore.clientId!
      ),
      isMypage,
      contentLayoutType: "CARD"
    };
  }

  public componentDidMount() {
    const { uuid } = this.state;
    this.contentBundle.initializeContents({ user: uuid });
  }

  public componentWillUnmount() {
    const { contentStore } = this.props;
    contentStore.clearContentBundle(this.contentBundleId);
  }

  public get Profile() {
    const { audioStore, userStore } = this.props;
    const { uuid, isMypage, contentLayoutType } = this.state;
    const user = userStore.users.get(uuid);
    userStore.users.forEach($user => $user.follow_by_me);

    if (!user) {
      return null;
    }

    const source = user.photo ? { uri: user.photo } : images.user;
    const hasIntro = !!user.introduction;
    const isIntroPlaying =
      !!user.introduction &&
      audioStore.instantPlaying &&
      audioStore.instantAudio === user.introduction.audio;

    return (
      <ProfileContainer>
        <Avatar source={source} />
        <Name numberOfLines={1}>{user.name}</Name>
        {hasIntro ? (
          <StyledUserPageListenButton
            playing={isIntroPlaying}
            onPress={_.partial(
              audioStore.pushInstantAudio,
              user.introduction!.audio
            )}
          />
        ) : isMypage ? (
          <StyledUserPageRecordButton onPress={this.onRecordPress} />
        ) : null}
        <ProfileBottomRow>
          <InfoColumn onPress={this.onFollowerPress}>
            <Count>{user.num_followers}</Count>
            <Label>팔로워</Label>
          </InfoColumn>
          <InfoColumn onPress={this.onFollowingPress}>
            <Count>{user.num_followings}</Count>
            <Label>팔로잉</Label>
          </InfoColumn>
          <RowSpacer />
          {isMypage ? (
            <InactiveButton onPress={this.onProfileEditPress}>
              프로필 수정
            </InactiveButton>
          ) : user.follow_by_me ? (
            <InactiveButton onPress={this.toggleFollow}>팔로잉</InactiveButton>
          ) : (
            <ActiveButton onPress={this.toggleFollow}>팔로우</ActiveButton>
          )}
        </ProfileBottomRow>
        <TagList
          data={user.tags}
          renderItem={this.renderTagItem}
          keyExtractor={item => item}
        />
        <ContentLayoutSelector
          numContents={user.num_contents}
          onCardViewPress={_.partial(this.onContentLayoutPress, "CARD")}
          onListViewPress={_.partial(this.onContentLayoutPress, "LIST")}
          type={contentLayoutType}
        />
      </ProfileContainer>
    );
  }

  public render() {
    const { contentStore, userStore, navigation } = this.props;
    const { uuid, isMypage, contentLayoutType } = this.state;
    const user = userStore.users.get(uuid);
    userStore.users.forEach($user => $user.follow_by_me);

    if (!user) {
      userStore.fetchUser(uuid);
      return <React.Fragment />;
    }

    const store = contentStore.bundles.get(this.contentBundleId);

    return (
      <>
        <PlainHeader>
          {this.isMypageScreen ? (
            <React.Fragment />
          ) : (
            <BackButton onPress={this.goBack} />
          )}
          <HedaerText>{user.username}</HedaerText>
          {this.isMypageScreen ? (
            <SettingButton onPress={this.onSettingPress} />
          ) : (
            <React.Fragment />
          )}
        </PlainHeader>
        <Container>
          {store && (
            <ContentList
              contentBundle={store}
              type={contentLayoutType}
              onCardPress={this.onCardPress}
              onRefresh={this.onContentListRefresh}
              ListEmptyComponent={
                store.isFetching || !isMypage ? null : (
                  <EmptyContainer>
                    <EmptyText>
                      아직 컨텐츠가 없습니다.{"\n"}당신의 마디를 공유해주세요!
                    </EmptyText>
                    <EmptyTouchableText onPress={this.onEmptyContentCardPress}>
                      첫 마디 녹음하러 가기
                    </EmptyTouchableText>
                  </EmptyContainer>
                )
              }
              ListHeaderComponent={this.Profile}
            />
          )}
        </Container>
      </>
    );
  }

  private onSettingPress = () => {
    const { navigation } = this.props;
    navigateSettingScreen(navigation);
  };

  private onRecordPress = () => {
    const { navigation } = this.props;
    navigateIntroRecordScreen(navigation);
  };

  private toggleFollow = () => {
    const { userStore } = this.props;
    const { uuid } = this.state;
    userStore.toggleFollow(uuid!);
  };

  private onFollowerPress = () => {
    const { navigation } = this.props;
    const { uuid } = this.state;
    navigateFollowScreen(navigation, { uuid, followBundleType: "FOLLOWER" });
  };

  private onFollowingPress = () => {
    const { navigation } = this.props;
    const { uuid } = this.state;
    navigateFollowScreen(navigation, { uuid, followBundleType: "FOLLOWING" });
  };

  private onTextTagPress = (defaultText: string) => {
    const { navigation } = this.props;
    navigation.navigate("SearchScreen", { defaultText });
  };

  private renderTagItem: ListRenderItem<string> = ({ item }) => {
    return <TagItem>{item}</TagItem>;
  };

  private onContentLayoutPress = (contentLayoutType: ContentLayoutType) => {
    this.setState({ contentLayoutType });
  };

  private onCardPress = (content: IContent) => {
    const { navigation } = this.props;
    navigateListenDetailScreen(navigation, {
      contentId: content.id
    });
  };

  private onProfileEditPress = () => {
    const { navigation } = this.props;
    navigateProfileEditScreen(navigation);
  };

  private onEmptyContentCardPress = () => {
    const { navigation } = this.props;
    navigateQuestionScreen(navigation);
  };

  private onContentListRefresh = (defaultHandler: () => any) => {
    const { userStore } = this.props;
    const { uuid } = this.state;

    defaultHandler();
    userStore.fetchUser(uuid);
  };

  private goBack = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
  };
}

export function navigateUserPageScreen(
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) {
  navigateOtherUserScreen(navigation, params);
}

export function navigateMypageScreen(
  navigation: NavigationScreenProp<any, any>
) {
  navigation.navigate("MypageScreen");
}

export function navigateOtherUserScreen(
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) {
  navigation.push("OtherUserScreen", params);
}
