import hoistNonReactStatics from "hoist-non-react-statics";
import _ from "lodash";
import React from "react";
import { Linking } from "react-native";

import { navigateAuthLandingScreen } from "src/screens/AuthLandingScreen";
import { navigateListenScreen } from "src/screens/ListenScreen";
import { navigateResetPasswordScreen } from "src/screens/ResetPasswordScreen";
import { getStore } from "src/stores/RootStore";

type CommandType = "resetPassword" | "confirmEmail";

export interface ILinkingScreenProps {
  handleDeepLink: (url: string) => Promise<{ isNavigatingAction: boolean }>;
  getInitialURL: () => Promise<string | null>;
}

export const withLinking = <T extends ILinkingScreenProps & IScreenProps<any>>(
  Component: React.ComponentType<T>
): any => {
  class WithLinking extends React.Component<T> {
    public async componentDidMount() {
      this.initLinkingListener();
    }

    public render() {
      return (
        <Component
          {...this.props}
          handleDeepLink={this.handleDeepLink}
          getInitialURL={this.getInitialURL}
        />
      );
    }

    public initLinkingListener = () => {
      Linking.addEventListener("url", ({ url }) => this.handleDeepLink(url));
    };

    private getInitialURL = () => {
      return Linking.getInitialURL();
    };

    private handleDeepLink = async (
      url: string
    ): Promise<{ isNavigatingAction: boolean }> => {
      const result = this.retriveDataFromUrl(url);
      if (result) {
        const { command, data } = result;
        const commandToActionMap: {
          [key in CommandType]: () => Promise<{ isNavigatingAction: boolean }>
        } = {
          resetPassword: _.partial(this.handleResetPassword, data),
          confirmEmail: _.partial(this.handleConfirmEmail, data)
        };

        return await commandToActionMap[command]();
      }

      throw new Error("withLinking: Unhandled action");
    };

    private handleResetPassword = async (
      data: any
    ): Promise<{ isNavigatingAction: boolean }> => {
      const { navigation } = this.props;
      navigateResetPasswordScreen(navigation, { base64Code: data });
      return {
        isNavigatingAction: true
      };
    };

    private handleConfirmEmail = async (
      data: any
    ): Promise<{ isNavigatingAction: boolean }> => {
      const { navigation } = this.props;
      const { authStore } = getStore();
      const { verification, fetchClient } = await authStore.verifyEmail(data);
      if (!verification || !fetchClient) {
        navigateAuthLandingScreen(navigation);
      } else {
        navigateListenScreen(navigation);
      }

      return {
        isNavigatingAction: true
      };
    };

    private retriveDataFromUrl = (url: string | null) => {
      if (url) {
        const trimProtocol = url.split("//")[1];
        const split = trimProtocol.split("/");
        const length = split.length;
        const command = split[length - 2];
        const data = split[length - 1];
        return {
          command: command as CommandType,
          data
        };
      }

      return null;
    };
  }

  return hoistNonReactStatics(WithLinking, Component);
};
