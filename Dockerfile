ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apk add --no-cache \
    nodejs \
    npm \
    git \
    jq \
    yarn


COPY . .
RUN yarn --frozen-lockfile
RUN yarn build

# Copy data for add-on
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]