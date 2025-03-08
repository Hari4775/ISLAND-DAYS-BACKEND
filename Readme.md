1. allowed ec2 instances public ip on mongo db server
2. npm install pm2 -g
3. pm2 start  npm -- run dev
4. pm2 logs (for find the pm issues)


PROCESS MANAGERS:  using for run all time
pm2 list - list the all pms
pm2  flush <name> - for clearing the logs of the process manager
pm2 delete <name> - for deleting process manager
pm2 stop <name> - for stopping the process manager
pm2 start npm --name "islanddaysbackend" -- run dev - name changing the process manager