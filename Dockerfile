FROM node:20
RUN apt-get update
RUN mkdir /app
WORKDIR /app
COPY package.json /app/
RUN npm install --legacy-peer-deps
COPY . /app/
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s","dist"]
