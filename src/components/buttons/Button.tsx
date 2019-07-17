import _ from "lodash";
import React from "react";
import { TouchableOpacityProps } from "react-native";
import styled from "styled-components/native";

import { ITextProps, Text } from "src/components/Text";

export interface IButtonProps extends TouchableOpacityProps {
  textProps?: ITextProps;
}

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Content = styled(Text)``;

export class Button extends React.Component<IButtonProps> {
  public render() {
    const { children, textProps, ...props } = this.props;
    const childrenArray = _.isArray(children) ? children : [children];

    return (
      <Container {...props}>
        {childrenArray.map((child, index) =>
          _.some([_.isString(child), _.isNumber(child)]) ? (
            <Content key={index} {...textProps}>
              {child}
            </Content>
          ) : (
            child
          )
        )}
      </Container>
    );
  }
}
