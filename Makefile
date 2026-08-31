# VaultFlow Build System Makefile

.PHONY: all build start dev test clean docker-build docker-run

all: build test

install:
	npm install

build:
	npm run build

start:
	npm start

dev:
	npm run dev

test:
	npm test

clean:
	rm -rf dist coverage node_modules

docker-build:
	docker build -t vaultflow:latest .

docker-run:
	docker run -p 3000:3000 vaultflow:latest
