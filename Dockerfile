ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

RUN apk add --no-cache nodejs-npm jq yarn

COPY . .
RUN yarn --forzen-lockfile
RUN yarn build

# Copy data for add-on
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]