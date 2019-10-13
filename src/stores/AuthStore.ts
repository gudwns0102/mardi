import axios from "axios";
import _ from "lodash";
import { flow, types } from "mobx-state-tree";
import { NavigationScreenProp } from "react-navigation";

import { AccessToken, LoginManager } from "react-native-fbsdk";
import {
  postAuthEmailCheck,
  postAuthEmailLogin,
  postAuthEmailSendVerification,
  postAuthEmailSignup,
  postAuthEmailVerify,
  postAuthFacebookLogin,
  postAuthPasswordChange,
  postAuthPasswordReset,
  postAuthPasswordResetConfirm
} from "src/apis";
import { environment } from "src/config/environment";
import { navigateAuthLandingScreen } from "src/screens/AuthLandingScreen";
import { getRootStore } from "src/stores/RootStoreHelper";
import {
  AsyncStorageKeys,
  getStorageItem,
  setStorageItem
} from "src/utils/AsyncStorage";
import { MardiError } from "src/utils/MardiError";
import { getPlatform } from "src/utils/Platform";

export const AuthStore = types
  .model({
    accessToken: types.optional(types.string, "test")
  })
  .actions(self => {
    const rootStore = getRootStore(self);
    const initialize = flow(function*(
      navigation: NavigationScreenProp<any, any>
    ) {
      const accessToken: string =
        (yield getStorageItem(AsyncStorageKeys.ACCESS_TOKEN)) || "";

      self.accessToken = accessToken;

      axios.defaults.baseURL = environment.baseURL;

      axios.interceptors.response.use(
        response => {
          return response;
        },
        error => {
          console.dir(error);
          const errorData = _.get(error, [
            "response",
            "data"
          ]) as IServerErrorData;
          const errorStatus = _.get(error, ["response", "status"], null);

          if (errorStatus === 401) {
            rootStore.toastStore.openToast({
              content: "로그인 세션이 만료되었습니다.",
              type: "ERROR"
            });
            removeAccessToken();
            navigateAuthLandingScreen(navigation);
            return error;
          }

          throw new MardiError(errorData);
        }
      );
    });

    const checkEmailExisting = flow(function*(email: string) {
      const {
        result
      }: RetrieveAsyncFunc<
        typeof postAuthEmailCheck
      > = yield postAuthEmailCheck({ email });

      return result;
    });

    const signUpEmail = (data: {
      email: string;
      password1: string;
      password2: string;
      username: string;
    }) => {
      return postAuthEmailSignup({ ...data, platform: getPlatform() });
    };

    const signInEmail = flow(function*(data: {
      email: string;
      password: string;
    }) {
      const {
        token,
        uuid,
        verified
      }: RetrieveAsyncFunc<
        typeof postAuthEmailLogin
      > = yield postAuthEmailLogin(data);

      updateAccessToken(token);

      return {
        token,
        uuid,
        verified
      };
    });

    const resendVerificationEmail = (email: string) => {
      return postAuthEmailSendVerification({ email });
    };

    const confirmForgotPasswordEmail = flow(function*(data: {
      new_password1: string;
      new_password2: string;
      token: string;
      uuid: string;
    }) {
      return postAuthPasswordResetConfirm(data);
    });

    const signInFacebook = flow(function*() {
      LoginManager.logOut();

      try {
        const loginResult = yield LoginManager.logInWithPermissions([
          "email",
          "public_profile"
        ]);

        const { isCancelled, declinedPermissions } = loginResult;

        if (isCancelled || !_.isEmpty(declinedPermissions)) {
          return;
        }

        const tokenResponse = yield AccessToken.getCurrentAccessToken();

        if (!tokenResponse) {
          return;
        }

        const { accessToken: facebookAccessToken, userID } = tokenResponse;

        const response: RetrieveAsyncFunc<
          typeof postAuthFacebookLogin
        > = yield postAuthFacebookLogin({
          access_token: facebookAccessToken
        });

        updateAccessToken(response.token);

        return response;
      } catch (error) {
        return;
      }
    });

    const sendForgotPasswordEmail = (email: string) => {
      return postAuthPasswordReset({ email });
    };

    const changePassword = (
      oldPassword: string,
      newPassword1: string,
      newPassword2: string
    ) => {
      return postAuthPasswordChange({
        old_password: oldPassword,
        new_password1: newPassword1,
        new_password2: newPassword2
      });
    };

    const verifyEmail = flow(function*(key: string) {
      try {
        const {
          token
        }: RetrieveAsyncFunc<
          typeof postAuthEmailVerify
        > = yield postAuthEmailVerify({ key });

        updateAccessToken(token);

        const uuid = yield rootStore.userStore.fetchClient();

        return {
          verification: true,
          fetchClient: true
        };
      } catch (error) {
        return {
          verification: false,
          fetchClient: false
        };
      }
    });

    const logoutClient = () => {
      rootStore.userStore.removeClient();
      removeAccessToken();
    };

    const updateAccessToken = (token: string) => {
      self.accessToken = token;
      setStorageItem(AsyncStorageKeys.ACCESS_TOKEN, token);
    };

    const removeAccessToken = () => {
      self.accessToken = "";
      setStorageItem(AsyncStorageKeys.ACCESS_TOKEN, "");
    };

    const invalidateAccessTokenForTest = () => {
      updateAccessToken("INVALID_TOKEN");
    };

    return {
      initialize,
      checkEmailExisting,
      confirmForgotPasswordEmail,
      sendForgotPasswordEmail,
      signUpEmail,
      signInEmail,
      signInFacebook,
      invalidateAccessTokenForTest,
      resendVerificationEmail,
      logoutClient,
      changePassword,
      verifyEmail
    };
  });

export type IAuthStore = typeof AuthStore.Type;
