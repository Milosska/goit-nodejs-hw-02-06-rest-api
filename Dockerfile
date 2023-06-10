ARG VERSION=18.15.0

FROM node:$VERSION

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

LABEL name='goit-nodejs-hw-02-06-rest-api'
LABEL maintainer="Milosska"
LABEL description="This is a training project on Node.js written for the contacts app"
LABEL build-date='2023-06-09'


CMD ["cross-env", "NODE_ENV=production", "node", "./server.js"]
