import _ from "lodash";

export const shadow = ({
  opacity,
  shadowOffset
}: {
  opacity: number;
  shadowOffset?: { x: number; y: number };
}) => `
  shadow-color: #000000;
  shadow-offset: ${_.get(shadowOffset, ["x"], 0)}px ${_.get(
  shadowOffset,
  ["y"],
  4
)}px;
  shadow-opacity: ${opacity};
  shadow-radius: 10;
  elevation: 8;
`;
