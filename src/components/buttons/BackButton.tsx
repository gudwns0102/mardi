import React from "react";
import styled from "styled-components/native";

import { images } from "assets/images";
import {
  IconButton,
  IIconButtonProps
} from "src/components/buttons/IconButton";

const Container = styled(IconButton)`
  width: 24px;
  height: 24px;
`;

export function BackButton(props: Omit<IIconButtonProps, "source">) {
  return <Container {...props} source={images.btnCommonBack} />;
}
