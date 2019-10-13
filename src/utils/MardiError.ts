import _ from "lodash";

export class MardiError extends Error {
  public errors: IServerErrorData["detail"];

  constructor(props: IServerErrorData) {
    const { detail } = props;
    const primaryMessage = _.get(
      detail,
      [0, "message"],
      "알 수 없는 에러가 발생하였습니다."
    );

    super(primaryMessage);

    // this.errors = props.detail;
  }
}
