## Docker HTTP lokal
    docker build . -t ibsys

    docker run -p 80:80 ibsys

## [Hosting](http://get-your-bike-production-plan.de)

    docker run -d --name=ibsys --restart=unless-stopped  -p=443:443 -p=80:80 \
    -v ~/cert/ibsys/fullchain.pem:/config/nginx/fullchain.pem:ro          \
    -v ~/cert/ibsys/privkey.pem:/config/nginx/privkey.pem:ro              \
    ibsys:latest

    docker logs -f ibsys
