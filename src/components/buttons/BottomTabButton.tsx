import React from "react";
import { ImageProps } from "react-native";
import styled from "styled-components/native";

import { images } from "assets/images";

const Container = styled.Image`
  width: 34px;
  height: 34px;
`;

export function createBottomTabButton({
  source,
  focusSource
}: {
  source: ImageProps["source"];
  focusSource: ImageProps["source"];
}) {
  return function BottomTabButton({ focused }: { focused: boolean }) {
    return <Container source={focused ? focusSource : source} />;
  };
}

export const MagazineTabButton = createBottomTabButton({
  focusSource: images.btnTabHomeOn,
  source: images.btnTabHomeOff
});

export const ListenTabButton = createBottomTabButton({
  focusSource: images.btnTabListenOn,
  source: images.btnTabListenOff
});

export const SearchTabButton = createBottomTabButton({
  focusSource: images.btnTabSearchOn,
  source: images.btnTabSearchOff
});

export const QuestionTabButton = createBottomTabButton({
  focusSource: images.btnTabSpeakOn,
  source: images.btnTabSpeakOff
});

export const NotiTabButton = createBottomTabButton({
  focusSource: images.btnTabNotiOn,
  source: images.btnTabNotiOff
});

export const MypageTabButton = createBottomTabButton({
  focusSource: images.btnTabMypageOn,
  source: images.btnTabMypageOff
});
