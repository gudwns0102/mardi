import _ from "lodash";
import { Observer } from "mobx-react";
import React from "react";
import {
  createBottomTabNavigator,
  createStackNavigator,
  NavigationBottomTabScreenOptions,
  NavigationScreenProp
} from "react-navigation";
import { fromBottom, fromRight } from "react-navigation-transitions";
import styled from "styled-components/native";

import {
  ListenTabButton,
  MagazineTabButton,
  MypageTabButton,
  NotiTabButton,
  QuestionTabButton
} from "src/components/buttons/BottomTabButton";
import * as Screens from "src/screens";
import { getStore } from "src/stores/RootStore";

export interface IMainTabNavigatorParams {
  scrollToTop: () => any;
}

const NotiContainer = styled.View`
  width: 34px;
  height: 34px;
`;

const FeedIconRedCircle = styled.View`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: rgb(255, 10, 10);
  top: 2px;
  right: 2px;
`;

const tabBarVisibleList = [
  "ListenScreen",
  "ListenDetailScreen",
  "QuestionScreen",
  "MypageScreen",
  "OtherUserScreen",
  "SearchScreen",
  "FeedScreen",
  "SearchQuestionScreen",
  "MagazineScreen"
];

const MagazineNavigator = createStackNavigator(
  {
    MagazineScreen: {
      screen: Screens.MagazineScreen
    }
  },
  {
    headerMode: "none",

    transitionConfig: ({ scene, scenes }) => {
      const last = scenes[scenes.length - 1];

      return {
        ...fromRight()
      };
    }
  }
);

const ListenNavigator = createStackNavigator(
  {
    ListenScreen: {
      screen: Screens.ListenScreen
    },
    ListenDetailScreen: {
      screen: Screens.ListenDetailScreen
    },
    ContentEditScreen: {
      screen: Screens.ContentEditScreen
    },
    CameraScreen: {
      screen: Screens.CameraScreen
    }
    // OtherUserScreen: {
    //   screen: Screens.UserPageScreen
    // }
  },
  {
    headerMode: "none",

    transitionConfig: ({ scene, scenes }) => {
      const last = scenes[scenes.length - 1];

      if (last.route.routeName === "FeedScreen") {
        return {
          ...fromBottom(500)
        };
      }

      return {
        ...fromRight()
      };
    }
  }
);

const QuestionNavigator = createStackNavigator(
  {
    QuestionScreen: {
      screen: Screens.QuestionScreen
    }
  },
  {
    headerMode: "none"
  }
);

const FeedNavigator = createStackNavigator(
  {
    FeedScreen: {
      screen: Screens.FeedScreen
    },
    ListenDetailScreen: {
      screen: Screens.ListenDetailScreen
    }
  },
  {
    headerMode: "none"
  }
);

const MypageNavigator = createStackNavigator(
  {
    MypageScreen: {
      screen: Screens.UserPageScreen
    },
    ListenDetailScreen: {
      screen: Screens.ListenDetailScreen
    },
    ContentEditScreen: {
      screen: Screens.ContentEditScreen
    },
    CameraScreen: {
      screen: Screens.CameraScreen
    },
    SettingScreen: {
      screen: Screens.SettingScreen
    },
    AnnounceScreen: {
      screen: Screens.AnnounceScreen
    },
    ProfileResetPasswordScreen: {
      screen: Screens.ProfileResetPasswordScreen
    }
  },
  {
    headerMode: "none"
  }
);

const MainTabNavigator = createBottomTabNavigator(
  {
    MagazineNavigator: {
      screen: MagazineNavigator,
      navigationOptions: ({
        navigation
      }: {
        navigation: NavigationScreenProp<any, IMainTabNavigatorParams>;
      }): NavigationBottomTabScreenOptions => {
        let tabBarVisible = false;
        const { routes } = navigation.state;
        const { routeName: currentRoute, key } = routes[routes.length - 1];

        if (_.includes(tabBarVisibleList, currentRoute)) {
          tabBarVisible = true;
        }

        return {
          tabBarVisible,
          tabBarIcon: ({ focused }: any) => (
            <MagazineTabButton focused={focused} />
          ),
          tabBarOnPress: ({ defaultHandler }) => {
            const parentNavigation = navigation.dangerouslyGetParent()!;
            const { index, routes: parentRoutes } = parentNavigation.state;
            const prevFocusedTabKey = parentRoutes[index].key;
            if (
              prevFocusedTabKey === "ListenNavigator" &&
              currentRoute === "ListenScreen"
            ) {
              const scrollToTop = navigation.getParam("scrollToTop");

              if (scrollToTop) {
                scrollToTop();
              }
            }
            defaultHandler();
          }
        };
      }
    },
    ListenNavigator: {
      screen: ListenNavigator,
      navigationOptions: ({
        navigation
      }: {
        navigation: NavigationScreenProp<any, IMainTabNavigatorParams>;
      }): NavigationBottomTabScreenOptions => {
        let tabBarVisible = false;
        const { routes } = navigation.state;
        const { routeName: currentRoute, key } = routes[routes.length - 1];

        if (_.includes(tabBarVisibleList, currentRoute)) {
          tabBarVisible = true;
        }

        return {
          tabBarVisible,
          tabBarIcon: ({ focused }: any) => (
            <ListenTabButton focused={focused} />
          ),
          tabBarOnPress: ({ defaultHandler }) => {
            const parentNavigation = navigation.dangerouslyGetParent()!;
            const { index, routes: parentRoutes } = parentNavigation.state;
            const prevFocusedTabKey = parentRoutes[index].key;
            if (
              prevFocusedTabKey === "ListenNavigator" &&
              currentRoute === "ListenScreen"
            ) {
              const scrollToTop = navigation.getParam("scrollToTop");

              if (scrollToTop) {
                scrollToTop();
              }
            }
            defaultHandler();
          }
        };
      }
    },
    QuestionNavigator: {
      screen: QuestionNavigator,
      navigationOptions: ({
        navigation
      }: {
        navigation: NavigationScreenProp<any>;
      }): NavigationBottomTabScreenOptions => {
        let tabBarVisible = false;
        const { routes } = navigation.state;
        const currentRoute = routes[routes.length - 1].routeName;

        if (_.includes(tabBarVisibleList, currentRoute)) {
          tabBarVisible = true;
        }

        return {
          tabBarVisible,
          tabBarIcon: ({ focused }: any) => (
            <QuestionTabButton focused={focused} />
          ),
          tabBarOnPress: ({ defaultHandler }) => {
            getStore().questionStore.changeQuestionsStyle();
            defaultHandler();
          }
        };
      }
    },
    FeedNavigator: {
      screen: FeedNavigator,
      navigationOptions: ({
        navigation
      }: {
        navigation: NavigationScreenProp<any>;
      }) => {
        let tabBarVisible = false;
        const { routes } = navigation.state;
        const currentRoute = routes[routes.length - 1].routeName;

        if (_.includes(tabBarVisibleList, currentRoute)) {
          tabBarVisible = true;
        }

        return {
          tabBarVisible,
          tabBarIcon: ({ focused }: any) => (
            <Observer>
              {() => {
                const client = getStore().userStore.client;
                return (
                  <NotiContainer>
                    <NotiTabButton focused={focused} />
                    {client && client.has_unread_feeds ? (
                      <FeedIconRedCircle />
                    ) : null}
                  </NotiContainer>
                );
              }}
            </Observer>
          )
        };
      }
    },
    MypageNavigator: {
      screen: MypageNavigator,
      navigationOptions: ({
        navigation
      }: {
        navigation: NavigationScreenProp<any>;
      }) => {
        let tabBarVisible = false;
        const { routes } = navigation.state;
        const currentRoute = routes[routes.length - 1].routeName;

        if (_.includes(tabBarVisibleList, currentRoute)) {
          tabBarVisible = true;
        }

        return {
          tabBarVisible,
          tabBarIcon: ({ focused }: any) => (
            <MypageTabButton focused={focused} />
          )
        };
      }
    }
  },
  {
    tabBarOptions: {
      showLabel: false,
      style: {
        backgroundColor: "rgba(240, 240, 240, 0.9)",
        paddingHorizontal: 10
      }
    }
  }
);

const CommonStackNavigator = createStackNavigator(
  {
    MainTabNavigator: {
      screen: MainTabNavigator
    },
    OtherUserScreen: {
      screen: Screens.UserPageScreen
    },
    ProfileEditScreen: {
      screen: Screens.ProfileEditScreen
    },
    KeywordScreen: {
      screen: Screens.KeywordScreen
    },
    ReplyScreen: {
      screen: Screens.ReplyScreen
    },
    RecordScreen: {
      screen: Screens.RecordScreen
    },
    ContentEditScreen: {
      screen: Screens.ContentEditScreen
    },
    CameraScreen: {
      screen: Screens.CameraScreen
    },
    IntroRecordScreen: {
      screen: Screens.IntroRecordScreen
    },
    SearchQuestionScreen: {
      screen: Screens.SearchQuestionScreen
    },
    ListenDetailScreen: {
      screen: Screens.ListenDetailScreen
    },
    FollowScreen: {
      screen: Screens.FollowScreen
    },
    FollowAndContentRecommendScreen: {
      screen: Screens.FollowAndContentRecommendScreen
    },
    FollowRecommendScreen: {
      screen: Screens.FollowRecommendScreen
    },
    ContentRecommendScreen: {
      screen: Screens.ContentRecommendScreen
    },
    SearchScreen: {
      screen: Screens.SearchScreen
    },
    PrevMagazineScreen: {
      screen: Screens.PrevMagazineScreen
    },
    MagazineReplyScreen: {
      screen: Screens.MagazineReplyScreen
    },
    PrevMagazineDetailScreen: {
      screen: Screens.PrevMagazineDetailScreen
    }
  },
  {
    headerMode: "none"
  }
);

export const MainNavigator = createStackNavigator(
  {
    CommonStackNavigator: {
      screen: CommonStackNavigator
    },
    PlayerScreen: {
      screen: Screens.PlayerScreen
    }
  },
  {
    mode: "modal",
    headerMode: "none",
    transitionConfig: ({ scene, scenes }) => {
      return {
        ...fromBottom(500)
      };
    }
  }
);
