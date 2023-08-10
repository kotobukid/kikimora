FROM node:16-alpine
RUN apk update && apk add --no-cache sqlite
COPY . /app
WORKDIR /app
#RUN npm run sync
RUN chmod +x /app/entrypoint.sh

#CMD ["npm", "run", "run"]

CMD ["/app/entrypoint.sh"]
#ENTRYPOINT ["/app/entrypoint.sh"]