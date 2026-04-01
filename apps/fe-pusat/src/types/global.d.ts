/// <reference types="react" />
/// <reference types="react-dom" />

// Deklarasi environment variables (import.meta.env)
interface ImportMetaEnv {
  readonly VITE_WEBDDS_BROKER_URL?: string;
  readonly VITE_GRPC_PROXY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Deklarasi modul untuk aset gambar
declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}
