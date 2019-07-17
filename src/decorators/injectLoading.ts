import { getStore } from "src/stores/RootStore";

export function injectLoading(_: any, prop: string, descriptor?: any): any {
  let fn: any;
  let patchedFn: any;

  const isNormalFunction = !!descriptor.value;
  const isArrowFunction = !!descriptor.initializer;

  if (isNormalFunction) {
    fn = descriptor.value;
    return {
      configurable: true,
      enumerable: false,
      get() {
        const { loadingStore } = getStore();

        if (!patchedFn) {
          patchedFn = async (...args: any[]) => {
            try {
              loadingStore.showLoading();
              await fn.call(this, ...args);
            } catch (error) {
              throw error;
            } finally {
              loadingStore.hideLoading();
            }
          };
        }
        return patchedFn;
      },
      set(newFn: any) {
        patchedFn = undefined;
        fn = newFn;
      },
    };
  }

  if (isArrowFunction) {
    function initializer(component: any) {
      return async (...args: any[]) => {
        const { loadingStore } = getStore();

        try {
          loadingStore.showLoading();
          await descriptor.initializer.call(component)(...args);
        } catch (error) {
          throw error;
        } finally {
          loadingStore.hideLoading();
        }
      };
    }

    return {
      configurable: true,
      enumerable: false,
      initializer() {
        return (this[prop] = initializer(this));
      },
    };
  }

  return descriptor;
}
