import React from "react";
import { TextInput as RNTextInput } from "react-native";
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputProps,
  TextProps
} from "react-native";

interface IProps extends TextInputProps {
  innerRef?: any;
  focusStyle?: TextInputProps["style"];
  rightComponent?: JSX.Element;
  placeholderStyle?: TextProps["style"];
}

class StyledTextInput extends React.Component<IProps> {
  public state = {
    isFocused: false
  };

  public render() {
    const { style, focusStyle, onFocus, onBlur, ...props } = this.props;
    const { placeholderStyle, value, ...rest } = props;
    const { isFocused } = this.state;
    return (
      <RNTextInput
        ref={rest.innerRef}
        value={value}
        style={[
          { padding: 0 },
          style,
          isFocused ? focusStyle : {},
          value ? {} : placeholderStyle
        ]}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        autoCapitalize="none"
        selectionColor="rgb(25, 86, 212)"
        autoCorrect={false}
        {...rest}
      />
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

export const TextInput = React.forwardRef(
  (props: Omit<IProps, "innerRef">, ref: any) => {
    return <StyledTextInput {...props} innerRef={ref} />;
  }
);
