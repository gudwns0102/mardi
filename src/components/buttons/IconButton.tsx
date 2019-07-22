import React from "react";
import { ImageProps } from "react-native";
import styled from "styled-components/native";

import { Button, IButtonProps } from "src/components/buttons/Button";

export interface IIconButtonProps extends IButtonProps {
  source: ImageProps["source"];
  imageProps?: Omit<ImageProps, "source">;
}

const Container = styled(Button)`
  overflow: hidden;
`;

const Image = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: cover;
`;

export function IconButton({ source, imageProps, ...props }: IIconButtonProps) {
  return (
    <Container {...props}>
      <Image {...imageProps} source={source} />
    </Container>
  );
}
