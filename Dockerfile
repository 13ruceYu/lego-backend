FROM node:16
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install --registry=https://registry.npm.taobao.org
RUN npm run tsc
EXPOSE 7007
CMD npx egg-scripts start --title=egg-server-lego-backend