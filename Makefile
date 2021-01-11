docker_up:
	mkdir -p .db-data
	docker-compose up -d --build

docker_down:
	docker-compose down

docker_image:
	sh ./scripts/docker_build.sh

api_create_admin:
	docker exec -it posts-api python3 manage.py createsuperuser

db_create:
	docker exec posts-db mysql -ppassword -e 'CREATE DATABASE IF NOT EXISTS posts;'

db_migrate:
	docker exec posts-api python3 manage.py migrate
	docker restart posts-api

helm_upgrade_install:
	helm upgrade --install posts --namespace=posts --create-namespace helm/posts

helm_upgrade_install_secure:
ifeq ($(API_SECRET),)
	@echo API_SECRET must be set
endif
ifeq ($(MYSQL_PASSWORD),)
	@echo MYSQL_PASSWORD must be set
endif
	helm upgrade --install posts --namespace=posts --create-namespace helm/posts --set api.apiSecret=$(API_SECRET) --set mysql.mysqlPassword=$(MYSQL_PASSWORD)

helm_delete:
	helm --namespace posts delete posts

helm_deps:
	helm dependency update helm/posts
