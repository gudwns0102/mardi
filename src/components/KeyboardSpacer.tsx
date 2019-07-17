import React from "react";
import Spacer from "react-native-keyboard-spacer";

import { isIos } from "src/utils/Platform";

export function KeyboardSpacer() {
  return isIos() ? <Spacer /> : <React.Fragment />;
}
