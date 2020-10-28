#variables
DBHOST=localhost
DBNAME=Pallas
DBUSER=testi
DBPASSWD=testpass


# Update packages
sudo apt-get update

# Install Node.js and NPM
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install npm
sudo npm install -g npm@6.14.6

#install mysql
debconf-set-selections <<< "mysql-server mysql-server/root_password password $DBPASSWD"
debconf-set-selections <<< "mysql-server mysql-server/root_password_again password $DBPASSWD"
apt-get install -y mysql-server mysql-client

#Creat databases and user then grant privaleges
mysql -uroot -p$DBPASSWD -e "CREATE DATABASE $DBNAME"
mysql -uroot -p$DBPASSWD -e "CREATE USER '$DBUSER'@'localhost' IDENTIFIED BY '$DBPASSWD'"
mysql -uroot -p$DBPASSWD -e "GRANT ALL PRIVILEGES ON $DBNAME.* TO '$DBUSER'@'localhost'"
mysql -uroot -p$DBPASSWD -e "CREATE USER '$DBUSER'@'10.0.2.2' IDENTIFIED BY '$DBPASSWD'"
mysql -uroot -p$DBPASSWD -e "GRANT ALL PRIVILEGES ON $DBNAME.* TO '$DBUSER'@'10.0.2.2'"
mysql Pallas< ../../vagrant/src/sql/luonnit.sql -uroot -p$DBPASSWD
mysql Pallas< ../../vagrant/src/sql/Segmentit.sql -uroot -p$DBPASSWD
mysql Pallas< ../../vagrant/src/sql/Koordinaatit.sql -uroot -p$DBPASSWD




#Temppeorary commads here