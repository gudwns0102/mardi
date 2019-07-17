import React from "react";
import { Platform, SwitchProps } from "react-native";
import styled from "styled-components/native";

import { images } from "assets/images";
import { IconButton } from "src/components/buttons/IconButton";
import { ListenButton } from "src/components/buttons/ListenButton";
import { ITextProps, Text } from "src/components/Text";
import { colors } from "src/styles/colors";

export type SettingCardType = "PLAIN" | "NAVIGATE" | "AUDIO" | "SWITCH";

export type SettingCardProps =
  | IPlainSettingProps
  | INavigateSettingProps
  | IAudioSettingProps
  | ISwitchSettingProps;

interface IPlainSettingProps {
  type: "PLAIN";
  title: string;
  onPress: () => any;
  contentStyle?: ITextProps["style"];
}

interface INavigateSettingProps {
  type: "NAVIGATE";
  title: string;
  onPress: () => any;
  contentStyle?: ITextProps["style"];
}

export interface IAudioSettingProps {
  type: "AUDIO";
  title: string;
  onPress: () => any;
  isPlaying?: boolean;
  contentStyle?: ITextProps["style"];
}

export interface ISwitchSettingProps {
  type: "SWITCH";
  title: string;
  value: SwitchProps["value"];
  onValueChange: SwitchProps["onValueChange"];
  contentStyle?: ITextProps["style"];
}

const TouchableWrapper = styled.TouchableOpacity``;

const Container = styled.View`
  width: 100%;
  height: 54px;
  padding-horizontal: 20px;
  align-self: center;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.white};
`;

const Title = styled(Text)`
  font-size: 14px;
  height: 20px;
  line-height: 20px;
  color: ${colors.black};
`;

const NavigateButton = styled(IconButton)`
  width: 24px;
  height: 24px;
`;

const Switch = styled.Switch.attrs({
  onTintColor: colors.blue300,
  thumbTintColor: colors.white
})``;

function PlainSettingCard(props: IPlainSettingProps) {
  const { title, onPress, contentStyle } = props;

  return (
    <TouchableWrapper onPress={onPress}>
      <Container>
        <Title style={contentStyle}>{title}</Title>
      </Container>
    </TouchableWrapper>
  );
}

function NavigateSettingCard(props: INavigateSettingProps) {
  const { title, onPress } = props;

  return (
    <TouchableWrapper onPress={onPress}>
      <Container>
        <Title>{title}</Title>
        <NavigateButton source={images.icPreviousRight} />
      </Container>
    </TouchableWrapper>
  );
}

function AudioSettingCard(props: IAudioSettingProps) {
  const { title, onPress, isPlaying } = props as IAudioSettingProps;

  return (
    <Container>
      <Title>{title}</Title>
      <ListenButton onPress={onPress} isPlaying={isPlaying} />
    </Container>
  );
}

function SwitchSettingCard(props: ISwitchSettingProps) {
  const { title, value, onValueChange } = props as ISwitchSettingProps;

  return (
    <Container>
      <Title>{title}</Title>
      <Switch
        value={value}
        onValueChange={onValueChange}
        style={
          Platform.OS === "ios"
            ? {
                backgroundColor: "rgb(230, 230, 230)",
                borderRadius: 17
              }
            : null
        }
      />
    </Container>
  );
}

export function SettingCard(props: SettingCardProps) {
  return (
    <React.Fragment>
      {props.type === "PLAIN" ? <PlainSettingCard {...props} /> : null}
      {props.type === "NAVIGATE" ? <NavigateSettingCard {...props} /> : null}
      {props.type === "AUDIO" ? <AudioSettingCard {...props} /> : null}
      {props.type === "SWITCH" ? <SwitchSettingCard {...props} /> : null}
    </React.Fragment>
  );
}
