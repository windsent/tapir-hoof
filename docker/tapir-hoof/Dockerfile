FROM nginx:latest
MAINTAINER Windsent Sip3.IO <windsent@sip3.io>

RUN rm -rf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html
RUN mkdir -p /usr/share/nginx/html
RUN mkdir -p /var/log/tapir-hoof

ADD htdocs /usr/share/nginx/html
ADD nginx.conf /etc/nginx/

VOLUME ["/var/log/tapir-hoof"]

EXPOSE 8080

