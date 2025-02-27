declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_GEMINI_API_KEY: string;
  }
}

interface ImportMeta {
  env: {
    VITE_GEMINI_API_KEY?: string;
    [key: string]: string | undefined;
  };
}

interface Window {
  _env_?: {
    REACT_APP_GEMINI_API_KEY?: string;
    [key: string]: string | undefined;
  };
}
