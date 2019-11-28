import { inject, Observer, observer } from "mobx-react";
import React from "react";
import { Dimensions, FlatList, FlatListProps } from "react-native";
import styled from "styled-components/native";

import { BlurView } from "@react-native-community/blur";
import { images } from "assets/images";
import { Text } from "src/components/Text";
import { IMagazine } from "src/models/Magazine";
import { IMagazineContent } from "src/models/MagazineContent";
import { IRootStore } from "src/stores/RootStore";
import { colors } from "src/styles/colors";

interface IProps
  extends RemoveKeys<FlatListProps<IMagazineContent>, ["renderItem"]> {
  innerRef?: any;
  magazine: IMagazine;
  magazineId: number;
  store: IRootStore;
}

const { width } = Dimensions.get("window");

const MagazineContent = styled.ImageBackground`
  justify-content: flex-end;
  width: ${width}px;
  flex: 1;
  padding-top: 9px;
  padding-bottom: 12px;
  background: powderblue;
`;

const PageGuideText = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  color: ${colors.white};
  opacity: 0.7;
  padding-left: 14px;
`;

const PlayButton = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })`
  position: absolute;
  bottom: 12px;
  right: 12px;
  align-items: center;
  width: 86px;
  height: 79px;
  padding-top: 16px;
  padding-bottom: 4px;
  border: -0.5px solid white;
  border-radius: 16px;
  overflow: hidden;
  background-color: transparent;
`;

const PlayIcon = styled.Image.attrs({ source: images.playBlue })`
  width: 24px;
  height: 26px;
`;

const PlayText = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  color: #000000;
`;

const PlayButtonBlurView = styled(BlurView)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgb(255, 255, 255);
`;

@inject("store")
@observer
class Component extends React.Component<IProps> {
  public render() {
    const { magazine, magazineId, innerRef, ...props } = this.props;
    return (
      <FlatList
        {...props}
        ref={innerRef}
        style={{ flex: 1 }}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <Observer>
              {() => (
                <MagazineContent
                  source={
                    item.picture ? { uri: item.picture } : images.airplane
                  }
                >
                  <PageGuideText>{magazine.guide_text}</PageGuideText>
                  <PlayButton
                    onPress={() => {
                      this.props.store.audioStore.pushMagazineContentAudio({
                        magazineContent: item,
                        magazineId
                      });
                    }}
                  >
                    <PlayButtonBlurView blurAmount={37} blurType="light" />
                    <PlayIcon />
                    <PlayText>{item.num_played || 0}</PlayText>
                  </PlayButton>
                </MagazineContent>
              )}
            </Observer>
          );
        }}
      />
    );
  }
}

export const MagazineContentList = React.forwardRef(
  (props: RemoveKeys<IProps, ["innerRef", "store"]>, ref) => (
    <Component {...(props as any)} innerRef={ref} />
  )
);
