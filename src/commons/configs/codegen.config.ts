import { CodegenConfig } from '@graphql-codegen/cli';

import dotenv from 'dotenv';

dotenv.config({
  path: ['.env', '.env.local', '.env.development', '.env.development.local'],
});

const host = 'http://localhost:9856';

const config: CodegenConfig = {
  schema: `${host}/graphql`,
  documents: ['src/**/*.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/commons/graphql-models/': {
      preset: 'client',
    },
  },
};

export default config;
