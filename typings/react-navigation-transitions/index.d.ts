declare module "react-navigation-transitions" {
  interface ITransition {
    transitionSpec: any;
    screenInterpolator: any;
  }
  function fromTop(duration?: number): ITransition;
  function fromBottom(duration?: number): ITransition;
  function fromLeft(duration?: number): ITransition;
  function fromRight(duration?: number): ITransition;
  function fadeIn(duration?: number): ITransition;
}
