import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Text } from "src/components/Text";
import { colors } from "src/styles/colors";
import { shadow } from "src/utils/Shadow";

interface IProps {
  style?: ViewProps["style"];
  percent: number;
  content?: string;
}

const Container = styled.View`
  flex: 1;
  height: 20px;
  border-radius: 10px;
  background-color: rgb(240, 240, 240);
  margin: 0 16px;
  overflow: hidden;
  flex-direction: row;
`;

const PaddingResolver = styled.View`
  width: 100%;
  flex: 1;
  overflow: hidden;
  flex-direction: row;
`;

const PlayedArea = styled.View<{ percent: number }>`
  flex: ${props => props.percent / 100};
  min-width: 12px;
  height: 12px;
  left: 0;
  border-radius: 6px;
  margin: 4px;
  background-color: ${colors.blue300};
  ${shadow({ opacity: 0.5, shadowOffset: { x: 0, y: 0 } })}
`;

const Content = styled(Text)`
  position: absolute;
  width: 100%;
  align-self: center;
  font-size: 15px;
  color: rgb(155, 155, 155);
  text-align: center;
`;

export class TimeProgressBar extends React.Component<IProps> {
  public render() {
    const { style, percent, content } = this.props;
    return (
      <Container style={style}>
        <PaddingResolver>
          <PlayedArea percent={Math.min(Math.max(0, percent), 100)} />
        </PaddingResolver>
        <Content>{content}</Content>
      </Container>
    );
  }
}
