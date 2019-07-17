import _ from "lodash";
import React from "react";
import { NavState } from "react-native";
import WebView from "react-native-webview";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { BackButton } from "src/components/buttons/BackButton";
import { PlainHeader } from "src/components/PlainHeader";

interface IParams {
  uri: string;
}

interface IProps extends IScreenProps<IParams> {}

const StyledWebView = styled(WebView)`
  width: 100%;
  flex: 1;
`;

export class WebViewScreen extends React.Component<IProps> {
  public webview = React.createRef<any>();
  public canGoBack = false;
  public loading = true;

  public render() {
    const { navigation } = this.props;
    const uri = navigation.getParam("uri");
    const validUri = !/^https?:\/\//i.test(uri) ? `https://${uri}` : uri;

    return (
      <>
        <PlainHeader>
          <BackButton onPress={this.goBack} />
          <React.Fragment />
          <React.Fragment />
        </PlainHeader>
        <StyledWebView
          ref={this.webview}
          source={{ uri: validUri }}
          onNavigationStateChange={this.onNavigationStateChange}
          onLoadStart={this.onLoad}
          onLoadEnd={this.onLoad}
        />
      </>
    );
  }

  private onNavigationStateChange = (e: NavState) => {
    const { canGoBack, loading } = e;
    this.canGoBack = !!canGoBack;
    this.loading = !!loading;
  };

  private onLoad = (e: NavState) => {
    const { loading } = e;
    this.loading = !!loading;
  };

  private goBack = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
  };
}

export function navigateWebViewScreen(
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) {
  navigation.push("WebViewScreen", params);
}
