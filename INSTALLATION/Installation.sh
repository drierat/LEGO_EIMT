#!/bin/bash

apt-get update && apt-get upgrade
apt-get install apache2 apache2-utils
apt-get install curl
ufw allow in "Apache Full"
apt-get install mysql-server
mysql_secure_installation
apt-get install php libapache2-mod-php php-mcrypt php-mysql
apt-get install git
curl -s https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
composer
cd /var/www/html/
a2enmod rewrite
systemctl restart apache2
cd /var/www/html/
composer require slim/slim "^3.0"
apt-get install putty
apt-get install phpmyadmin
apt-get install filezilla
chmod -R 777 /var/www

