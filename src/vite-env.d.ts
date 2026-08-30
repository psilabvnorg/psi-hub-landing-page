/// <reference types="vite/client" />

// Source screenshots in src/assets/images/** are stored with uppercase
// extensions (e.g. 0.PNG). vite/client only declares the lowercase '*.png'
// module pattern, so sections that import specific screenshots by name
// (Hero, Gallery) need this declared too.
declare module '*.PNG' {
  const src: string;
  export default src;
}
