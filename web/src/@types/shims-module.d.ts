/* eslint-disable @typescript-eslint/naming-convention */

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.css' {
  const content: any;
  export default content;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

interface HttpApi {
  [key: string]: any;
}
type HttpMethodType = 'delete' | 'get' | 'head' | 'options' | 'post' | 'put' | 'patch';


interface ImportMeta {
  globEager: any;
}
