.PHONY: run build push

IMAGE_NAME := quay.io/app-sre/visual-qontract
IMAGE_TAG := $(shell git rev-parse --short=7 HEAD)
IMAGE_TEST := visual-qontract-test

ifneq (,$(wildcard $(CURDIR)/.docker))
	DOCKER_CONF := $(CURDIR)/.docker
else
	DOCKER_CONF := $(HOME)/.docker
endif

run:
	yarn start:dev

build:
	@docker build -t $(IMAGE_NAME):latest .
	@docker tag $(IMAGE_NAME):latest $(IMAGE_NAME):$(IMAGE_TAG)

push:
	@docker --config=$(DOCKER_CONF) push $(IMAGE_NAME):latest
	@docker --config=$(DOCKER_CONF) push $(IMAGE_NAME):$(IMAGE_TAG)

build-test:
	@docker build -t $(IMAGE_TEST) -f Dockerfile.tester .

test: build-test
	@docker run --rm $(IMAGE_TEST)

dev-docker-run: build
	docker run --rm -p 8080:8080 \
		-e API_URI=https://host.docker.internal \
		-e GRAPHQL_URI=https://host.docker.internal \
		-v $(shell pwd)/public/env:/opt/visual-qontract/build/env \
		$(IMAGE_NAME):latest
