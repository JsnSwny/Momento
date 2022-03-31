#!/bin/sh

# pull changes
sudo git pull

# update npm packages for frontend and backend
sudo npm install
cd client
sudo npm install

# build frontend
sudo npm build

# restart backend server
pm2 restart /var/www/html/Momento/server/index.js

# restart frontend server - not always needed but just in case
sudo systemctl restart nginx
