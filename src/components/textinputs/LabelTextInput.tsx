import React from "react";
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputProps,
  ViewProps
} from "react-native";
import styled from "styled-components/native";

import { TextInput } from "src/components/textinputs/TextInput";
import { colors } from "src/styles/colors";

interface IProps extends TextInputProps {
  style?: ViewProps["style"];
  inputStyle?: TextInputProps["style"];
  focusStyle?: TextInputProps["style"];
  label: string;
}

const Container = styled.View`
  width: 100%;
  min-height: 52px;
  max-height: 250px;
  flex-direction: row;
  align-items: center;
  padding: 16px 0;
  background-color: ${colors.white};
`;

const Input = styled(TextInput)`
  padding-left: 66px;
  width: 100%;
  height: 100%;
`;

const Label = styled(TextInput)`
  position: absolute;
  width: 66px;
  top: 16px;
  align-self: flex-start;
  font-size: 14px;
  color: ${colors.gray400};
`;

export class LabelTextInput extends React.Component<IProps, {}> {
  public state = {
    isFocused: false
  };

  public render() {
    const { style, label, inputStyle, focusStyle, ...rest } = this.props;
    const { onFocus, onBlur, ...remain } = rest;
    const { isFocused } = this.state;
    return (
      <Container style={[style, isFocused ? focusStyle : {}]}>
        <Label value={label} editable={false} />
        <Input
          style={inputStyle}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          {...remain}
        />
      </Container>
    );
  }

  private onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    const { onFocus } = this.props;

    if (onFocus) {
      onFocus(e);
    }

    this.setState({ isFocused: true });
  };

  private onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    const { onBlur } = this.props;

    if (onBlur) {
      onBlur(e);
    }

    this.setState({ isFocused: false });
  };
}
