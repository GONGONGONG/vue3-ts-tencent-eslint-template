export type Mixin<T, X> = T & X;
export type Pick<T, K extends keyof T> = { [key in K]: T[key] };
export type Partial<T> = { [key in keyof T]?: T[key] };
export type Require<T> = { [key in keyof T]-?: T[key] };
export type Readonly<T> = { readonly [key in keyof T]: T[key] };
export type Exclude<T, U> = T extends U ? never : T;
// type Type1 = string | number;
// export type Add = Exclude<Type1, string>

// 提取部分属性
export type Omit<T, K extends keyof T> = { // Pick<T, Exclude<keyof T, K>>;
  [P in keyof T as P extends K ? never : P]: T[P]
};

export type Concat<T extends string | number | bigint | boolean, S extends string | number | bigint | boolean> = `${T}${S}`;
