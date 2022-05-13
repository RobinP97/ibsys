## Docker HTTP lokal
    docker build . -t ibsys

    docker run -p 80:80 ibsys

## Hosting
    web.jeberhardt.dev
    TODO: BasicAuth
    https://www.strato.de/server/linux-vserver/

    docker run -d --name=ibsys --restart=unless-stopped  -p=443:443 \
    -v ~/cert/fullchain.pem:/config/nginx/fullchain.pem:ro          \
    -v ~/cert/privkey.pem:/config/nginx/privkey.pem:ro              \
    ibsys:latest

    docker logs -f ibsys