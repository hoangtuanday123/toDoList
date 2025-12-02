FROM node:lts-alpine
RUN npm install -g serve quasar-cli@0.6.5
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN quasar build

EXPOSE 9000
CMD [ "serve","-s", "dist/spa", "-l", "9000" ]
