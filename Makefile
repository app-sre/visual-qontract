.PHONY: help build up down logs shell clean setup

# Default target
help: ## Show this help message
	@echo "Visual App-Interface - Podman Compose Commands"
	@echo "=============================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

setup: ## Setup environment file from example
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "Created .env file from env.example"; \
		echo "Please edit .env file with your configuration"; \
	else \
		echo ".env file already exists"; \
	fi

build: ## Build the Podman image
	podman compose build

up: ## Start the application in detached mode
	podman compose up -d

up-build: ## Build and start the application
	podman compose up -d --build

down: ## Stop and remove containers
	podman compose down

logs: ## Show application logs
	podman compose logs -f visual-app-interface

shell: ## Open shell in running container
	podman compose exec visual-app-interface /bin/bash

restart: ## Restart the application
	podman compose restart visual-app-interface

status: ## Show container status
	podman compose ps

clean: ## Remove containers, networks, and images
	podman compose down --rmi all --volumes --remove-orphans

dev: ## Start in development mode with logs
	podman compose up --build

test-connection: ## Test if the application is responding
	@echo "Testing connection to http://127.0.0.1:8080..."
	@curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://127.0.0.1:8080 || echo "Connection failed"
