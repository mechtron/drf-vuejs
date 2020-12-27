docker_up:
	docker-compose up -d --build

docker_down:
	docker-compose down

db_create:
	docker exec posts-db mysql -ppassword -e 'CREATE DATABASE IF NOT EXISTS posts;'

db_migrate:
	docker exec posts-api python3 manage.py migrate
