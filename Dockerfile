FROM node:18-alpine3.18

ENV LANG C.UTF-8

RUN apk add --no-cache \
    libc6-compat \
    gcc \
    g++ \
    make \
    python3 \
    jq \
    yarn

COPY . .

RUN yarn install --network-timeout 1000000 --frozen-lockfile && yarn build

# Copy data for add-on
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]