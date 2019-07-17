import React from "react";
import { FlatList, ListRenderItem } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { BottomNotch } from "src/components/BottomNotch";
import { Button } from "src/components/buttons/Button";
import { colors } from "src/styles/colors";

type ActionSheetButtonType = "INFO" | "ERROR";

interface IActionSheetButton {
  buttonType: ActionSheetButtonType;
  content: string;
  onPress?: () => any;
}

interface IParams {
  buttons: IActionSheetButton[];
}

interface IProps {
  navigation: NavigationScreenProp<any, IParams>;
}

const Container = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  background-color: transparent;
`;

const Overlay = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ActionButton = styled(Button)`
  width: 100%;
  height: 58px;
  border-radius: 0;
  background-color: ${colors.white};
`;

const Seperator = styled.View`
  width: 100%;
  height: 1px;
  background-color: rgb(230, 230, 230);
`;

export class ActionSheetModalScreen extends React.Component<IProps> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      translucent: false
    },
    forceInset: {
      top: "never"
    }
  };

  public render() {
    const { navigation } = this.props;
    const buttons = navigation.getParam("buttons");
    return (
      <React.Fragment>
        <Container onPress={this.goBack}>
          <Overlay />
          <FlatList
            data={buttons}
            renderItem={this.renderActionButtonItem}
            keyExtractor={item => item.content}
            ItemSeparatorComponent={Seperator}
            scrollEnabled={false}
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%"
            }}
          />
        </Container>
        <BottomNotch backgroundColor={colors.white} />
      </React.Fragment>
    );
  }

  private renderActionButtonItem: ListRenderItem<IActionSheetButton> = ({
    item
  }) => {
    return (
      <ActionButton
        onPress={item.onPress}
        textProps={{
          style: {
            color:
              item.buttonType === "INFO" ? "rgb(25, 82, 212)" : colors.red100
          }
        }}
      >
        {item.content}
      </ActionButton>
    );
  };

  private goBack = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
    return true;
  };
}

export function navigateActionSheetModalScreen(
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) {
  navigation.navigate("ActionSheetModalScreen", params);
}
