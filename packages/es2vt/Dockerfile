FROM node:16-alpine
WORKDIR /usr/src/
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4002
CMD [ "node", "src/index.js" ]