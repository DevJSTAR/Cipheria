.PHONY: help build run stop clean dev test push

help:
	@echo "Cipheria Docker Commands"
	@echo ""
	@echo "Available commands:"
	@echo "  build     - Build Docker image"
	@echo "  run       - Run container"
	@echo "  dev       - Run development mode"
	@echo "  stop      - Stop container"
	@echo "  clean     - Remove image and container"
	@echo "  test      - Test the image"
	@echo "  push      - Build and tag for registry"
	@echo "  logs      - Show container logs"
	@echo "  shell     - Access container shell"

build:
	docker build -f docker/Dockerfile -t cipheria:latest .

run:
	docker run -d --name cipheria -p 3000:3000 --restart unless-stopped cipheria:latest

dev:
	cd docker && docker-compose --profile dev up -d

stop:
	-docker stop cipheria
	-docker rm cipheria

clean: stop
	-docker rmi cipheria:latest
	-docker system prune -f

test:
	docker run --rm --name cipheria-test -p 3001:3000 -d cipheria:latest
	sleep 10
	@curl -f http://localhost:3001 > /dev/null && echo "Test passed" || echo "Test failed"
	docker stop cipheria-test

push:
	cd docker && chmod +x build.sh && ./build.sh

logs:
	docker logs -f cipheria

shell:
	docker exec -it cipheria sh

up: build run
restart: stop run