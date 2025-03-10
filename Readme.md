
# DEPLOYMENT
- signup aws 
- launch instance 
- ssh -i "BACKEND-ISLANDDAYS.pem"
- ssh -i "BACKEND-ISLANDDAYS.pem" ubuntu@ec2-13-60-180-199.eu-north-1.compute.amazonaws.com 
- git clone https://
- Run this command to install NVM: curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
- install node version - nvm install 20.15.1
- npm install
- npm start
- make sure in mongodb-> network access-> add  aws instance ip address 
- in instance settings -> security froups -> inbound roules -> edit inbound roules -> add roules ->
    - type= custom,  port- anything, anywhere acess


# PROCESS MANAGER ( used for running server all time)

- npm install pm2 -g
- pm2 start  npm -- start
- pm2 logs (for find the pm issues)

 
- pm2 list : list the all pms
- pm2  flush <name> : for clearing the - logs of the process manager
- pm2 delete <name> : for deleting process manager
- pm2 stop <name> :for stopping the process manager
-  pm2 start npm --name "islanddaysbackend" -- start
: name changing the process 
manager
- pm2 status : get  the pm2 details (names online)

# nginx proxipas ( for setting backend api - islanddays.in/api)
-    server_name 13.49.240.152;

        location /api/ {

        proxy_pass http://localhost:8000/;
        proxy_pass_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

