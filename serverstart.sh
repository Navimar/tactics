pm2 start app.js --name 'unitcraft' --max-restarts=0
pm2 start resize/resize.js --name 'resizer' --max-restarts=0
pm2 logs