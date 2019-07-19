declare module "*.json";

type AsyncFuncReturnType<T> = T extends (...args: any[]) => Promise<infer U>
  ? U
  : never;

type RemoveKeys<T, K extends Array<keyof T>> = Pick<
  T,
  Exclude<keyof T, K[keyof K]>
>;

type UnPromisify<T> = T extends Promise<infer U> ? U : T;

type RetrieveAsyncFunc<T extends (...args: any[]) => any> = ReturnType<
  T
> extends Promise<infer U>
  ? U
  : never;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
