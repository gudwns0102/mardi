import hoistNonReactStatics from "hoist-non-react-statics";
import _ from "lodash";
import React from "react";
// import Onesignal, {
//   OpenResult,
//   ReceivedNotification
// } from "react-native-onesignal";
import {
  NavigationActions,
  NavigationScreenProp,
  StackActions
} from "react-navigation";

import { environment } from "src/config/environment";
import { navigateUserPageScreen } from "src/screens/UserPageScreen";
import { getStore } from "src/stores/RootStore";

type NotificationType = "none" | "navigateContent" | "navigateUser";

interface INotificationData {
  action: NotificationType;
  contentId?: IContent["id"];
  userId?: IUser["uuid"];
}

// Onesignal.init(environment.onesignal);

export const withOnesignal = <
  T extends { navigation: NavigationScreenProp<any, any> }
>(
  Component: React.ComponentType<T>
): any => {
  class WithOnesignal extends React.Component<T> {
    constructor(props: T) {
      super(props);

      this.handleNavigateContentAction = this.ignoreIfNotLoggedIn(
        this.handleNavigateContentAction
      );

      this.handleNavigateUserAction = this.ignoreIfNotLoggedIn(
        this.handleNavigateUserAction
      );
    }

    public async componentDidMount() {
      // Onesignal.inFocusDisplaying(2);
      // Onesignal.addEventListener("received", this.onReceived);
      // Onesignal.addEventListener("opened", this.onOpened);

      return;
    }

    public onOpened = (e: OpenResult) => {
      const { additionalData } = e.notification.payload;

      if (!additionalData) {
        return;
      }

      const { action, contentId, userId } = additionalData as INotificationData;
      const actionMap: {
        [key in NotificationType]: (...args: any[]) => void
      } = {
        none: this.handleNoneAction,
        navigateContent: _.partial(
          this.handleNavigateContentAction,
          contentId!
        ),
        navigateUser: _.partial(this.handleNavigateUserAction, userId)
      };

      return actionMap[action]();
    };

    public onReceived = (e: ReceivedNotification) => {
      const { userStore } = getStore();
      const clientId = userStore.clientId;
      const data = { has_unread_feeds: true };
      if (clientId) {
        userStore.upsertUserById(clientId, data);
      }
      return;
    };

    public ignoreIfNotLoggedIn = (func: (...args: any[]) => any) => {
      return (...args: any[]) => {
        const { userStore } = getStore();
        const loggedIn = !!userStore.clientId;

        if (!loggedIn) {
          return;
        }

        func(...args);
      };
    };

    public handleNoneAction = () => {
      return;
    };

    public handleNavigateContentAction = (contentId: IContent["id"]) => {
      const { navigation } = this.props;
      const mainTabNavigator = navigation.dangerouslyGetParent()!;

      const mainTabAction = NavigationActions.navigate({
        routeName: "ListenNavigator"
      });

      const navigateAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: "ListenScreen" }),
          NavigationActions.navigate({
            routeName: "ListenDetailScreen",
            params: { contentId }
          })
        ]
      });

      mainTabNavigator.dispatch(mainTabAction);
      navigation.dispatch(navigateAction);
    };

    public handleNavigateUserAction = (uuid?: IUser["uuid"]) => {
      const { navigation } = this.props;

      if (!uuid) {
        return;
      }

      navigateUserPageScreen(navigation, { uuid });
    };

    public render() {
      return <Component {...this.props} />;
    }
  }

  return hoistNonReactStatics(WithOnesignal, Component);
};
