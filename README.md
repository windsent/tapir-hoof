# TAPIR Hoof #

**Hoof** display provided by REST API data from **Twig**. Provides web-base user interface 
including dashboard, search page, widgets and graphics. Offers paginated output of search results.
Fast, clean and simple.

**Tapir Hoof** is static web content after build procedure. **Tapir Hoof** needs access only to **Twig**.
**Tapir Hoof** can deploy on any http server, e.g. NGINX (https://www.nginx.com).
External dependencies of UI is fonts Open Snas and Source Sans Pro. These fonts is requested from end user browser.
**Tapir Hoof** functionality doesn't depended on these fonts and their use is a recommendation.

![hoof.png](https://cloud.githubusercontent.com/assets/20966590/23656994/7b72803c-0355-11e7-8d2d-5cd56ced9c36.png)

### Recomendation ###
We recommended use NGINX HTTP Server as front end server.
Described solution bellow will depends on NGINX HTTP server configuration.

### Build ###
For build application you should use NPM (https://www.npmjs.com), it needs to do before installation procedure.
Building components:
```
# cd <path of Tapir Hoof repository>
# npm run distclean
# npm install
# npm run build
```
Static content will package to ./htdocs directory.

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
Needs access to **Tapir Twig**. Default location is http://tapir-twig.dev.sip3.io.