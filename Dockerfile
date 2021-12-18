ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

RUN echo "${ALPINE_MIRROR}/v3.11/main/" >> /etc/apk/repositories
RUN apk add nodejs --repository="http://dl-cdn.alpinelinux.org/alpine/v3.11/main/"
RUN apk add npm --repository="http://dl-cdn.alpinelinux.org/alpine/v3.11/main/"
RUN node --version
RUN apk add --no-cache jq yarn 


COPY . .
RUN yarn --frozen-lockfile
RUN yarn build
RUN rm -rf src node_modules
RUN yarn --frozen-lockfile --production

# Copy data for add-on
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]