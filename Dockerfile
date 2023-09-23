FROM node:20.7.0-bullseye

WORKDIR /app

COPY package.json .
RUN npm i

COPY . .

## EXPOSE [Port you mentioned in the vite.config file]
EXPOSE 3000

ENTRYPOINT ["npm", "run", "dev", "--host"]