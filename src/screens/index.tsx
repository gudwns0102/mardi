import hoistNonReactStatic from "hoist-non-react-statics";
import _ from "lodash";
import React from "react";
import { StatusBar, StatusBarProps } from "react-native";
import {
  NavigationEvents,
  SafeAreaView,
  SafeAreaViewProps
} from "react-navigation";
import styled from "styled-components/native";

import { ActionSheetModalScreen as $ActionSheetModalScreen } from "src/screens/ActionSheetModalScreen";
import { AnnounceScreen as $AnnounceScreen } from "src/screens/AnnounceScreen";
import { AuthLandingScreen as $AuthLandingScreen } from "src/screens/AuthLandingScreen";
import { AuthScreen as $AuthScreen } from "src/screens/AuthScreen";
import { AuthVerifyScreen as $AuthVerifyScreen } from "src/screens/AuthVerifyScreen";
import { ButtonModalScreen as $ButtonModalScreen } from "src/screens/ButtonModalScreen";
import { CameraScreen as $CameraScreen } from "src/screens/CameraScreen";
import { ContentEditScreen as $ContentEditScreen } from "src/screens/ContentEditScreen";
import { ContentRecommendScreen as $ContentRecommendScreen } from "src/screens/ContentRecommendScreen";
import { FeedScreen as $FeedScreen } from "src/screens/FeedScreen";
import { FollowAndContentRecommendScreen as $FollowAndContentRecommendScreen } from "src/screens/FollowAndContentRecommendScreen";
import { FollowRecommendScreen as $FollowRecommendScreen } from "src/screens/FollowRecommendScreen";
import { FollowScreen as $FollowScreen } from "src/screens/FollowScreen";
import { IntroRecordScreen as $IntroRecordScreen } from "src/screens/IntroRecordScreen";
import { KeywordScreen as $KeywordScreen } from "src/screens/KeywordScreen";
import { ListenDetailScreen as $ListenDetailScreen } from "src/screens/ListenDetailScreen";
import { ListenScreen as $ListenScreen } from "src/screens/ListenScreen";
import { MagazineInfoModal as $MagazineInfoModal } from "src/screens/MagazineInfoModal";
import { MagazineReplyScreen as $MagazineReplyScreen } from "src/screens/MagazineReplyScreen";
import { MagazineScreen as $MagazineScreen } from "src/screens/MagazineScreen";
import { PlayerScreen as $PlayerScreen } from "src/screens/PlayerScreen";
import { PrevMagazineDetailScreen as $PrevMagazineDetailScreen } from "src/screens/PrevMagazineDetailScreen";
import { PrevMagazineScreen as $PrevMagazineScreen } from "src/screens/PrevMagazineScreen";
import { ProfileEditScreen as $ProfileEditScreen } from "src/screens/ProfileEditScreen";
import { ProfileResetPasswordScreen as $ProfileResetPasswordScreen } from "src/screens/ProfileResetPasswordScreen";
import { QuestionScreen as $QuestionScreen } from "src/screens/QuestionScreen";
import { RecordScreen as $RecordScreen } from "src/screens/RecordScreen";
import { ReplyScreen as $ReplyScreen } from "src/screens/ReplyScreen";
import { ResetPasswordScreen as $ResetPasswordScreen } from "src/screens/ResetPasswordScreen";
import { SearchQuestionScreen as $SearchQuestionScreen } from "src/screens/SearchQuestionScreen";
import { SearchScreen as $SearchScreen } from "src/screens/SearchScreen";
import { SettingScreen as $SettingScreen } from "src/screens/SettingScreen";
import { SplashScreen as $SplashScreen } from "src/screens/SplashScreen";
import { UserPageScreen as $UserPageScreen } from "src/screens/UserPageScreen";
import { WebViewScreen as $WebViewScreen } from "src/screens/WebViewScreen";

import { isAndroid } from "src/utils/Platform";

const Container = styled(SafeAreaView)<{
  forceInset: SafeAreaViewProps["forceInset"];
}>`
  width: 100%;
  flex: 1;
  background-color: transparent;
`;

function decorateScreen<
  T,
  P extends {
    options?: {
      statusBarProps?: StatusBarProps;
      forceInset?: SafeAreaViewProps["forceInset"];
    };
  }
>(Screen: React.ComponentType<T> & P) {
  return hoistNonReactStatic(
    class extends React.Component<T> {
      public render() {
        return (
          <Container
            forceInset={this.forceInset}
            style={{ backgroundColor: this.iosStatusBarColor }}
          >
            <NavigationEvents onWillFocus={this.onWillFocus} />
            <StatusBar {...this.statusBarProps} />
            <Screen {...(this.props as any)} />
          </Container>
        );
      }

      private get statusBarProps(): StatusBarProps {
        const defaultStatusBarProps: StatusBarProps = {
          animated: true,
          showHideTransition: "slide",
          backgroundColor: "transparent",
          barStyle: "dark-content",
          translucent: false
        };
        return {
          ...defaultStatusBarProps,
          ..._.get(Screen.options, ["statusBarProps"], {})
        };
      }

      private get forceInset() {
        const defaultForceInset: SafeAreaViewProps["forceInset"] = {
          top: "always",
          bottom: "never"
        };
        return {
          ...defaultForceInset,
          ..._.get(Screen.options, ["forceInset"], {})
        };
      }

      private get iosStatusBarColor() {
        return this.statusBarProps.backgroundColor;
      }

      private onWillFocus = () => {
        if (isAndroid()) {
          StatusBar.setBackgroundColor(
            _.get(this.statusBarProps, ["backgroundColor"], "transparent"),
            true
          );
          StatusBar.setBarStyle(
            _.get(this.statusBarProps, ["barStyle"], "dark-content")
          );
        }
      };
    },
    Screen
  );
}

export const AuthLandingScreen = decorateScreen($AuthLandingScreen);
export const AuthScreen = decorateScreen($AuthScreen);
export const AuthVerifyScreen = decorateScreen($AuthVerifyScreen);
export const ButtonModalScreen = decorateScreen($ButtonModalScreen);
export const ListenScreen = decorateScreen($ListenScreen);
export const ResetPasswordScreen = decorateScreen($ResetPasswordScreen);
export const SplashScreen = decorateScreen($SplashScreen);
export const WebViewScreen = decorateScreen($WebViewScreen);
export const ListenDetailScreen = decorateScreen($ListenDetailScreen);
export const ActionSheetModalScreen = decorateScreen($ActionSheetModalScreen);
export const ReplyScreen = decorateScreen($ReplyScreen);
export const SearchScreen = decorateScreen($SearchScreen);
export const SearchQuestionScreen = decorateScreen($SearchQuestionScreen);
export const FeedScreen = decorateScreen($FeedScreen);
export const UserPageScreen = decorateScreen($UserPageScreen);
export const ProfileEditScreen = decorateScreen($ProfileEditScreen);
export const KeywordScreen = decorateScreen($KeywordScreen);
export const ContentEditScreen = decorateScreen($ContentEditScreen);
export const SettingScreen = decorateScreen($SettingScreen);
export const AnnounceScreen = decorateScreen($AnnounceScreen);
export const ProfileResetPasswordScreen = decorateScreen(
  $ProfileResetPasswordScreen
);
export const CameraScreen = decorateScreen($CameraScreen);
export const RecordScreen = decorateScreen($RecordScreen);
export const IntroRecordScreen = decorateScreen($IntroRecordScreen);
export const QuestionScreen = decorateScreen($QuestionScreen);
export const FollowScreen = decorateScreen($FollowScreen);
export const ContentRecommendScreen = decorateScreen($ContentRecommendScreen);
export const FollowAndContentRecommendScreen = decorateScreen(
  $FollowAndContentRecommendScreen
);
export const FollowRecommendScreen = decorateScreen($FollowRecommendScreen);
export const PlayerScreen = decorateScreen($PlayerScreen);
export const MagazineScreen = decorateScreen($MagazineScreen);
export const PrevMagazineScreen = decorateScreen($PrevMagazineScreen);
export const MagazineReplyScreen = decorateScreen($MagazineReplyScreen);
export const PrevMagazineDetailScreen = decorateScreen(
  $PrevMagazineDetailScreen
);
export const MagazineInfoModal = decorateScreen($MagazineInfoModal);
