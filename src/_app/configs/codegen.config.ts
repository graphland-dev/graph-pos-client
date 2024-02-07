import { CodegenConfig } from "@graphql-codegen/cli";

import dotenv from "dotenv";

dotenv.config({
  path: [".env", ".env.local", ".env.development", ".env.development.local"],
});

const config: CodegenConfig = {
  schema: `${process.env.VITE_API_URL}/graphql` as string,
  documents: ["src/**/*.tsx"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/_app/graphql-models/": {
      preset: "client",
    },
  },
};

export default config;
