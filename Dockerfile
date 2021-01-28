ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

ADD package.json /

RUN apk add --no-cache nodejs-npm jq yarn && \
  yarn && \
  yarn build

# Copy data for add-on
COPY run.sh /
COPY public /
COPY .next /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]