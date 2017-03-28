# TAPIR Hoof #

**Hoof** displayes the data provided by REST API from **Twig**. 
It provides web-based user interface including dashboard, search page, widgets and graphics. 
It offers paginated output of search results.

Fast, clean and simple.

**Tapir Hoof** is a static web content after the build procedure and requires access to **Twig** only.
**Tapir Hoof** can be deployed on any http server, e.g. NGINX (https://www.nginx.com).
External dependencies of the UI are Open Sans and Source Sans Pro fonts. 
These fonts are requested by end-user's browser.
**Tapir Hoof** functionality doesn't depend on these fonts and that's just a recommendation.

![hoof.png](https://cloud.githubusercontent.com/assets/16978841/24424428/328ffb6e-1409-11e7-8d9a-b8ac0b1ac5d4.png)

### Recomendation ###
We recommend to use NGINX HTTP Server as front-end server.
As it's described bellow the solution depends on NGINX HTTP server configuration.

### Build ###
To build the application you need to use NPM (https://www.npmjs.com).
NPM has to be installed before the solutuon deployment begins.
To build components:
```
# cd <path of Tapir Hoof repository>
# npm run distclean
# npm install
# npm run build
```
Static content will be packaged to ./htdocs directory.

### Installation ###
* Copy all build files from ./htdocs to web directory on HTTP server. Usually, web directory is /var/www/html. <br> If you use SELinux, you need change security context for it.
* Configure location section for access to **Twig**.

You can save example of NGINX configurtion bellow to file /etc/nginx/conf.d/tapir-hoof.conf

#### Configuration ####

_Example of NGINX configuration file (/etc/nginx/conf.d/tapir-hoof.conf)_
```
server {

	listen 80;

	root /var/www/html;
	index index.html;

	# Make site accessible from http://localhost/
	server_name tapir-hoof.dev.sip3.io;
	
	location / {
	    try_files $uri $uri/ /index.html;
	}

	location /api/ {
	    proxy_pass http://tapir-twig.dev.sip3.io:8080;
    }

}
```

Dev environment will be available at http://localhost:8080.
It needs access to **Tapir Twig**. Default location is http://tapir-twig.dev.sip3.io.
