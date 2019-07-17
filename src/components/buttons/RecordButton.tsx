import React from "react";
import styled from "styled-components/native";

import { images } from "assets/images";
import { RecordState } from "src/components/Recorder";
import { Text } from "src/components/Text";
import { colors } from "src/styles/colors";

interface IProps {
  state: RecordState;
  onPress?: () => any;
  count: number;
  playing: boolean;
}

const OutterWrapper = styled.TouchableOpacity`
  width: 88px;
  height: 88px;
  border-radius: 44px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.white};
`;

const InnerWrapper = styled.View`
  width: 82px;
  height: 82px;
  border-radius: 41px;
  align-items: center;
  justify-content: center;
  background-color: rgb(242, 242, 242);
`;

const Container = styled.View`
  width: 76px;
  height: 76px;
  border-radius: 38px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.white};
`;

const RedContainer = styled.View<{ radius: number }>`
  width: ${props => props.radius * 2};
  height: ${props => props.radius * 2};
  border-radius: ${props => props.radius};
  background-color: ${colors.red100};
  align-items: center;
  justify-content: center;
`;

function ReadyRecordButton() {
  return <RedContainer radius={24} />;
}

const Count = styled(Text).attrs({ type: "bold" })`
  font-size: 28px;
  color: ${colors.white};
`;

function CountRecordButton({ count }: { count: number }) {
  return (
    <RedContainer radius={30}>
      <Count>{count}</Count>
    </RedContainer>
  );
}

const RecordShape = styled.Image.attrs({ source: images.btnSpeakInputkeyStop })`
  width: 52px;
  height: 52px;
`;

function RecordingButton() {
  return (
    <RedContainer radius={38}>
      <RecordShape />
    </RedContainer>
  );
}

const PlayShape = styled.Image`
  width: 52px;
  height: 52px;
`;

function PlayButton({ playing }: { playing: boolean }) {
  return (
    <RedContainer radius={38}>
      <PlayShape
        source={playing ? images.pause : images.btnSpeakInputkeyPlay}
      />
    </RedContainer>
  );
}

export function RecordButton({ state, onPress, count, playing }: IProps) {
  return (
    <OutterWrapper onPress={onPress}>
      <InnerWrapper>
        <Container>
          {state === "READY" && <ReadyRecordButton />}
          {state === "COUNT" && <CountRecordButton count={count} />}
          {state === "RECORDING" && <RecordingButton />}
          {state === "FINISH" && <PlayButton playing={playing} />}
        </Container>
      </InnerWrapper>
    </OutterWrapper>
  );
}
