cp -r ../dist ./dist

docker buildx build --platform=linux/arm64 -t rawa/web .

# docker run -p 8000:8000 --name rawa-web rawa/web