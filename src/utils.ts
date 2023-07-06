import type { Option } from "./type";
import { TableStickyConfig } from "./type";
/**
 * @desc 防抖函数
 * @param {Function} fn
 * @param {Number} delay
 * @param {Boolean} immediate
 * @returns Function
 */
// export const debounce = function <T = unknown>(
//   fn: (
//     option: Option,
//     tableStickyConfigs?: {
//       [C in keyof TableStickyConfig]?: TableStickyConfig[C];
//     }
//   ) => void,
//   delay: number,
//   immediate?: boolean
// ) {
//   let timer: number = 0;
//   return function (
//     this: T,
//     option: Option,
//     tableStickyConfigs?: {
//       [C in keyof TableStickyConfig]?: TableStickyConfig[C];
//     }
//   ) {
//     const that = this;
//     if (timer) {
//       clearTimeout(timer);
//       timer = 0;
//     }
//     if (immediate) {
//       let rightNow = !timer;
//       timer = window.setTimeout(() => {
//         timer = 0;
//       }, delay);
//       if (rightNow) {
//         fn.call(that, option, tableStickyConfigs);
//       }
//     } else {
//       timer = window.setTimeout(() => {
//         fn.call(that, option, tableStickyConfigs);
//       }, delay);
//     }
//   };
// };

/**
 * @desc 防抖装饰器
 * @param delay {number}
 * @param immediate {boolean}
 * @returns {MethodDecorator}
 */
export function Debounce(delay: number, immediate: boolean = false) {
  return function <A extends any[], R>(
    _target: any,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: A) => R>
  ) {
    let timer: NodeJS.Timeout | null = null;
    const originalMethod = descriptor.value!;

    descriptor.value = function (
      this: ThisParameterType<(...args: A) => R>,
      ...args: A
    ) {
      const context = this;

      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      if (immediate) {
        let callNow = !timer;
        if (callNow) {
          return originalMethod.apply(context, args);
        }
        timer = setTimeout(() => {
          timer = null;
        }, delay);
      } else {
        timer = setTimeout(() => {
          return originalMethod.apply(context, args);
        }, delay);
      }
    };
    return descriptor;
  };
}

// /**
//  * @desc  截流函数(时间戳)
//  * @param {Function} fn
//  * @param {Number} delay
//  * @returns
//  */
// export const throttle = function <T = unknown>(
//   fn: (option: Option) => void,
//   delay: number
// ): (this: T, option: Option) => void {
//   // 使用闭包返回一个函数并且用到闭包函数外面的变量previous
//   let previous = 0;
//   return function (this: T, option: Option) {
//     const that = this;
//     const now = new Date().getTime();
//     if (now - previous > delay) {
//       fn.call(that, option);
//       previous = now;
//     }
//   };
// };

export function Throttle(delay: number, leading: boolean = true) {
  return function <A extends any[], R>(
    _target: any,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: A) => R>
  ) {
    let previous = 0;
    let timer: NodeJS.Timeout | null = null;
    const originalMethod = descriptor.value!;

    descriptor.value = function (
      this: ThisParameterType<(...args: A) => R>,
      ...args: A
    ) {
      const now = Date.now();
      if (leading && !previous) {
        const result = originalMethod.apply(this, args);
        previous = now;
        return result;
      } else if (now - previous > delay) {
        clearTimeout(timer as NodeJS.Timeout);

        timer = setTimeout(() => {
          const result = originalMethod.apply(this, args);
          previous = Date.now();
          return result;
        }, delay);
      }
    };

    return descriptor;
  };
}
