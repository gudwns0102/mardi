import React from "react";
import styled from "styled-components/native";

import { Button, IButtonProps } from "src/components/buttons/Button";
import { colors } from "src/styles/colors";

interface IProps extends IButtonProps {
  isActive: boolean;
}

const LayoutSelectorButton = styled(Button)<{ isActive: boolean }>`
  width: 64px;
  height: 34px;
  border-radius: 9px;
  background-color: ${props => (props.isActive ? colors.white : "transparent")};
`;

const ListLayoutIconColumn = styled.View`
  height: 20px;
  justify-content: space-between;
`;

const ListLayoutIcon = styled.View<{ isActive: boolean }>`
  width: 20px;
  height: 9px;
  border-radius: 3px;
  border: 2px
    ${props => (props.isActive ? "rgb(25, 86, 212)" : "rgb(151, 151, 151)")};
`;

export function ContentLayoutListButton({ isActive, ...props }: IProps) {
  return (
    <LayoutSelectorButton isActive={isActive} {...props}>
      <ListLayoutIconColumn>
        <ListLayoutIcon isActive={isActive} />
        <ListLayoutIcon isActive={isActive} />
      </ListLayoutIconColumn>
    </LayoutSelectorButton>
  );
}
