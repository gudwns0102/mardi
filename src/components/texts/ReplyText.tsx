import _ from "lodash";
import React from "react";
import { TextProps, ViewProps } from "react-native";
import HTMLView, { HTMLViewNode } from "react-native-htmlview";
import styled from "styled-components/native";

import { ITextProps, Text } from "src/components/Text";
import { colors } from "src/styles/colors";

interface IProps extends ITextProps {
  children: string;
  onLinkPress?: (url: string) => any;
  onTagPress?: (text: string) => any;
  onUserPress?: () => any;
  rootComponentProps?: ViewProps;
  textComponentProps?: TextProps;
}

const TagText = styled(Text)`
  color: ${colors.blue300};
`;

const UserText = styled(Text)`
  color: ${colors.blue300};
`;

const userRegEx = /(^@\S*)/;
const tagRegEx = /(?:^|\s)(#\S+)/g;
const urlRegEx = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

const styles = {
  span: {
    color: colors.mardiBlack,
    fontFamily: "SpoqaHanSans-Regular",
    lineHeight: 20
  },
  tag: {
    color: colors.blue300,
    fontFamily: "SpoqaHanSans-Regular"
  },
  user: {
    color: colors.blue300,
    fontFamily: "SpoqaHanSans-Regular"
  },
  a: {
    color: colors.blue300,
    fontFamily: "SpoqaHanSans-Regular",
    textDecorationLine: "underline"
  } as any
};

function createRenderNode(
  onTagPress?: (text: string) => any,
  onUserPress?: () => any
) {
  return function renderNode(
    node: HTMLViewNode,
    index: number
  ): React.ReactNode {
    if (node.name === "tag") {
      const content: string = _.get(node, ["children", 0, "data"], "");
      const removePrefixContent = content.trim().replace(/^#/, "");
      return (
        <TagText
          key={index}
          onPress={
            onTagPress ? _.partial(onTagPress, removePrefixContent) : undefined
          }
        >
          {content}
        </TagText>
      );
    }

    if (node.name === "user") {
      const content: string = _.get(node, ["children", 0, "data"], "");
      const removePrefixContent = content.trim().replace(/^@/, "");
      return (
        <UserText key={index} onPress={onUserPress ? onUserPress : undefined}>
          {content}
        </UserText>
      );
    }
  };
}

export function ReplyText(props: IProps) {
  const text = props.children
    .replace(userRegEx, "<user>$&</user>")
    .replace(tagRegEx, "<tag>$&</tag>")
    .replace(urlRegEx, "<a href='$&'>$&</a>");

  return (
    <HTMLView
      value={`<span>${text}</span>`}
      stylesheet={styles}
      onLinkPress={props.onLinkPress}
      renderNode={createRenderNode(props.onTagPress, props.onUserPress)}
      RootComponent={($props: any) => <Text {...$props} />}
      rootComponentProps={props.rootComponentProps}
      textComponentProps={props.textComponentProps}
    />
  );
}
