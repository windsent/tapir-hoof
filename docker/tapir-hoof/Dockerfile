FROM node AS uibuilder

# TODO: change windsent to sip3io
RUN git clone https://github.com/windsent/tapir-hoof.git
WORKDIR /tapir-hoof

RUN npm run distclean
RUN npm install
RUN npm run build

FROM nginx:alpine
MAINTAINER Windsent Sip3.IO <windsent@sip3.io>

RUN rm -rf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html
RUN mkdir -p /usr/share/nginx/html
RUN mkdir -p /var/log/tapir-hoof

COPY --from=uibuilder /tapir-hoof/htdocs/ /usr/share/nginx/html
COPY --from=uibuilder /tapir-hoof/docker/tapir-hoof/nginx.conf /etc/nginx/

VOLUME ["/var/log/tapir-hoof"]

EXPOSE 8080

