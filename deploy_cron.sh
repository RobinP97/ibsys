#!/bin/bash
cd ~/projects/ibsys
if [[ $(git pull) != 'Already up to date.' ]]; then
  echo "$('['$(date +"%D %T %z")']') Rebuild"
  DOCKER_BUILDKIT=1 docker build . -t ibsys
  docker rm -f ibsys
  docker run -d --name=ibsys --restart=unless-stopped -p=443:443 -v ~/cert/fullchain.pem:/config/nginx/fullchain.pem:ro -v ~/cert/privkey.pem:/config/nginx/privkey.pem:ro ibsys:latest
  exit $res
fi

exit 0
