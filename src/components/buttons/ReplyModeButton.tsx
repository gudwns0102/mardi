import styled from "styled-components/native";

import { IconButton } from "src/components/buttons/IconButton";
import { colors } from "src/styles/colors";

export const ReplyModeButton = styled(IconButton)`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${colors.blue300};
  align-items: center;
  justify-content: center;
`;
