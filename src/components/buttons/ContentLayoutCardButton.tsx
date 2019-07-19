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

const CardLayoutIcon = styled.View<{ isActive: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px
    ${props => (props.isActive ? "rgb(25, 86, 212)" : "rgb(151, 151, 151)")};
`;

export function ContentLayoutCardButton({ isActive, ...props }: IProps) {
  return (
    <LayoutSelectorButton isActive={isActive} {...props}>
      <CardLayoutIcon isActive={isActive} />
    </LayoutSelectorButton>
  );
}
