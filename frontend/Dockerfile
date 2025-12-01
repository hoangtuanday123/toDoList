FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g serve quasar-cli@0.6.5
# make the 'frontend' folder the current working directory
WORKDIR /frontend

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'frontend' folder)
COPY . .

# build app for production with minification
RUN quasar build

EXPOSE 9000
CMD [ "serve","-s", "dist/spa", "-l", "9000" ]
