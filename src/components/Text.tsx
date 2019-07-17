import React from "react";
import { Text as RNText, TextProps } from "react-native";

type FontType = "regular" | "bold";

export interface ITextProps extends TextProps {
  type?: FontType;
}

const textTypeToFont = new Map<FontType, string>()
  .set("regular", "SpoqaHanSans-Regular")
  .set("bold", "SpoqaHanSans-Bold");

export class Text extends React.Component<ITextProps> {
  public render() {
    const { type, style, ...props } = this.props;
    return (
      <RNText
        {...props}
        style={[style, { fontFamily: textTypeToFont.get(type || "regular") }]}
      />
    );
  }
}
