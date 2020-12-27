docker_up:
	mkdir -p .db-data
	docker-compose up -d --build

docker_down:
	docker-compose down

api_create_admin:
	docker exec -it posts-api python3 manage.py createsuperuser

db_create:
	docker exec posts-db mysql -ppassword -e 'CREATE DATABASE IF NOT EXISTS posts;'

db_migrate:
	docker exec posts-api python3 manage.py migrate
