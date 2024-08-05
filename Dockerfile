ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

RUN echo "${ALPINE_MIRROR}/v3.18/main/" >> /etc/apk/repositories
RUN apk add --no-cache libc6-compat gcc g++ make python3
RUN apk add nodejs npm --repository="http://dl-cdn.alpinelinux.org/alpine/v3.18/main/"
RUN apk add --no-cache jq yarn 

COPY . .
RUN yarn install --network-timeout 1000000 --frozen-lockfile
RUN yarn build

# Copy data for add-on
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]