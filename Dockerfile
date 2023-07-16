ARG BUILD_FROM
FROM $BUILD_FROM

RUN echo "GROCY-UI: hello!"

ENV LANG C.UTF-8
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN echo "GROCY-UI: installing dependencies"
RUN apk add --no-cache \
    nodejs \
    npm \
    git \
    jq \
    yarn


RUN echo "GROCY-UI: copying files"
COPY . .
RUN echo "GROCY-UI: running yarn install"
RUN yarn --frozen-lockfile
RUN echo "GROCY-UI: running yarn build"
RUN yarn build

# Copy data for add-on
RUN chmod a+x /run.sh

RUN echo "GROCY-UI: running run.sh"
CMD [ "/run.sh" ]
RUN echo "GROCY-UI: finished building"