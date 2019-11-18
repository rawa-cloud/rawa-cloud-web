cp -r ../dist ./dist

docker build -t rawa/web .

# docker run -p 8000:8000 --name rawa-web rawa/web