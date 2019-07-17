import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

interface IProps {
  children: JSX.Element[];
  style?: ViewProps["style"];
}

export const PLAIN_HEADER_HEIGHT = 44;

const Container = styled.View`
  width: 100%;
  height: ${PLAIN_HEADER_HEIGHT};
  padding: 0 18px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: transparent;
`;

const LeftAbsolute = styled.View`
  position: absolute;
  left: 18px;
`;

const RightAbsolute = styled.View`
  position: absolute;
  right: 18px;
`;

export function PlainHeader({ children, ...props }: IProps) {
  return (
    <Container {...props}>
      <LeftAbsolute>{children[0]}</LeftAbsolute>
      {children[1]}
      <RightAbsolute>{children[2]}</RightAbsolute>
    </Container>
  );
}
