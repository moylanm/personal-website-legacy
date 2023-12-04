# Include variables from .envrc
include .envrc

# ==================================================================================== #
# HELPERS
# ==================================================================================== #

## help: print this help message
.PHONY: help
help:
	@printf 'Usage:\n'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' | sed -e 's/^/ /'

.PHONY: confirm
confirm:
	@printf 'Are you sure? [y/N] ' && read ans && [ $${ans:-N} = y ]

# ==================================================================================== #
# DEVELOPMENT
# ==================================================================================== #

## run/api: run the cmd/api application
.PHONY: run/api
run/api:
	@go run ./cmd/api -db-dsn=${DB_DSN} -admin-username=${ADMIN_USERNAME} -admin-password=${ADMIN_PASSWORD}

## db/psql: connect to the database using psql
.PHONY: db/psql
db/psql:
	@psql ${DB_DSN}

## db/migrations/new name=$1: create a new database migration
.PHONY: db/migrations/new
db/migrations/new:
	@printf 'Creating migration files for ${name}...\n'
	migrate create -seq -ext=.sql -dir=./migrations ${name}

## db/migrations/up: apply all up database migrations
.PHONY: db/migrations/up
db/migrations/up: confirm
	@printf 'Running up migrations...\n'
	@migrate -path ./migrations -database ${DB_DSN} up

# db/migrations/down apply all down database migrations
.PHONY: db/migrations/down
db/migrations/down:
	@printf 'Running down migrations...\n'
	@migrate -path ./migrations -database ${DB_DSN} down

# ==================================================================================== #
# QUALITY CONTROL
# ==================================================================================== #

## audit: tidy dependencies and format, vet, and test all code
.PHONY: audit
audit: vendor
	@printf 'Formatting code...\n'
	go fmt ./...
	@printf 'Vetting code...\n'
	go vet ./...
	staticcheck ./...
	@printf 'Running tests...\n'
	go test -race -vet=off ./...

## vendor: tidy and vendor dependencies
.PHONY: vendor
vendor:
	@printf 'Tidying and verifying module dependencies...\n'
	go mod tidy
	go mod verify
	@printf 'Vendoring dependencies...\n'
	go mod vendor

# ==================================================================================== #
# BUILD
# ==================================================================================== #

## build/api: build the cmd/api application
.PHONY: build/api
build/api:
	@printf 'Building cmd/api...\n'
	go build -ldflags='-s -w' -o=./bin/api ./cmd/api
	GOOS=linux GOARCH=amd64 go build -ldflags='-s -w' -o=./bin/linux_amd64/api ./cmd/api

# ==================================================================================== #
# PRODUCTION
# ==================================================================================== #

production_host_ip = '146.190.175.246'

## production/connect: connect to the production server
.PHONY: production/connect
production/connect:
	ssh myles@${production_host_ip}

## production/deploy/api: deploy the api to production
.PHONY: production/deploy/api
production/deploy/api:
	rsync -P ./bin/linux_amd64/api myles@${production_host_ip}:~
	rsync -rP --delete ./migrations myles@${production_host_ip}:~
	rsync -P ./remote/production/api.service myles@${production_host_ip}:~
	rsync -P ./remote/production/Caddyfile myles@${production_host_ip}:~
	ssh -t myles@${production_host_ip} '\
		migrate -path ~/migrations -database $$WEBSITE_DB_DSN up \
		&& sudo mv ~/api.service /etc/systemd/system/ \
		&& sudo systemctl enable api \
		&& sudo systemctl restart api \
		&& sudo mv ~/Caddyfile /etc/caddy/ \
		&& sudo systemctl reload caddy \
		'
