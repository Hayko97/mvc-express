FROM node:18
LABEL authors="ashugh"

WORKDIR "/usr/src/app"
COPY ../package*.json ./
RUN npm install

COPY . .
EXPOSE 8080

CMD [ "node", "server.js" ]

ENTRYPOINT ["top", "-b"]