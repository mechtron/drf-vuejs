By Corey Gale (`mechtrondev[at]gmail.com`)

## Features

1. Django REST framework API
1. Mobile-friendly VueJS web client
1. Buttery-smooth Google OAuth2 login flow
1. Support for additional OAuth2 providers via `django-allauth`
1. `docker-compose` dev environment
1. Kubernetes deployment to AWS EKS via Helm
1. GitHub Actions workflow for publishing Docker images and deploying to AWS EKS
1. API database can be either SQLite or MySQL
1. Pagination for large API responses

## Dev environment setup

### Backend (API and database)

1. Change into the API base directory: `cd api`
1. Create a virtualenv: `python3 -m venv venv && source venv/bin/activate`
1. Install Python dependencies: `pip3 install -r requirements.txt`
1. Migrate the database: `python3 manage.py migrate`
1. Create a super user: `python3 manage.py createsuperuser --email <your-email> --username admin`
1. Start the API: `python3 manage.py runserver`
1. Log into the [Django Admin web console](http://localhost:8000/admin) using the superuser created in #5
1. Under the "Sites" section, add your site domain name(s) (`127.0.0.1` for local dev)

#### Setup Google OAuth

1. Setup a [new OAuth app in Google](https://developers.google.com/identity/sign-in/web/sign-in) and obtain a Client ID and Client Secret. Enter the callback URL `http://localhost:8000/auth/google/callback/`.
1. Under "Social Accounts", click "Add" and add a social application with the following info:
    Name: Google
    Client id: from #1
    Secret key: from #1
    Key: N/A
    Sites: move all "Available sites" to "Chosen sites"
1. Click "Save"

#### Setup GitHub OAuth

1. Setup a [new OAuth app in GitHub](https://github.com/settings/applications/new) and obtain a Client ID and Client Secret. Enter the callback URL `http://localhost:8000/auth/github/callback/`.
1. Under "Social Accounts", click "Add" and add a social application with the following info:
    Name: GitHub
    Client id: from #1
    Secret key: from #1
    Key: N/A
    Sites: move all "Available sites" to "Chosen sites"
1. Click "Save"

### Frontend

1. Change into the Web base directory: `cd web`
1. Install Node dependencies: `npm install`
1. Start the development server: `npm run serve`
1. View at [http://localhost:8080](http://localhost:8080)

### Docker Compose environment

If you prefer, there is also a `docker-compose` environment included which allows you to use MySQL for the API database instead of SQLite. Included are some helpful `make` targets to simplify its usage:

#### Start Docker environment

    make docker_up

#### Create the API's database for the first time

    make db_create

#### Migrate the API's database

    make db_migrate

## API usage

### Authentication

1. Get your OAuth URL: `curl -I http://localhost:8000/auth/<provider>/url/` where `<provider>` is `github` or `google`
1. You will get a 302 redirect URL from your 3rd party OAuth2 provider to the frontend.
    Example callback: `https://frontend/auth/<provider>?code=a1e3ccca86ab0645cd92&state=MQ1CQVhgpSV4`
1. Get an auth token: `curl -X POST localhost:8000/auth/<provider>/token/ -d code=a1e3ccca86ab0645cd92`
    Example response: `{"key":"2f0d8f56aa3111e9b372a1ab582a0dcee22a71ba"}`
1. Get your user's details: `curl localhost:8000/auth/user/ -H "Authorization: Token 2f0d8f56aa3111e9b372a1ab582a0dcee22a71ba"`
    Example response:
    ```json
    {"pk":2,"username":"example","email":"you@example.com","first_name":"Example","last_name":"User"}
    ```
1. Logout: `curl localhost:8000/auth/logout/ -H "Authorization: Token 2f0d8f56aa3111e9b372a1ab582a0dcee22a71ba"`
    Example response:
    ```json
    {"detail":"Successfully logged out."}
    ```

### Posts

1. Get recent Posts: `curl localhost:8000/posts`
1. Get HOF Posts: `curl localhost:8000/hof`
1. Like a Post: `curl localhost:8000/like/<id>/` where `<id>` is the Post ID
1. Create a Post (session required): `curl -X POST -H "Authorization: Token 2f0d8f56aa3111e9b372a1ab582a0dcee22a71ba" localhost:8000/post -d title="Test title" -d content="Test content"`
1. Edit a Post (session required): `curl -X PUT -H "Authorization: Token 2f0d8f56aa3111e9b372a1ab582a0dcee22a71ba" localhost:8000/post/<id>/ -d title="Updated title" -d content="Updated content"` 
1. Delete a Post (session required): `curl -X DELETE -H "Authorization: Token 2f0d8f56aa3111e9b372a1ab582a0dcee22a71ba" localhost:8000/post/<id>/`

## Docker images

#### API

    docker pull mechtron/posts-api

#### Web

    docker pull mechtron/posts-web

##### Manually build and tag Docker images

###### API

```bash
APP_DIR=api \
IMAGE_NAME=mechtron/posts-api \
COMMIT_TAG=API_v1.0 \
make docker_image
```

###### Web

```bash
APP_DIR=web \
IMAGE_NAME=mechtron/posts-web \
COMMIT_TAG=Web_v1.1 \
make docker_image
```

## Kubernetes Helm chart

### Helm chart

You can deploy to Kubernetes using the project's helm chart located in `helm/posts`.

#### First release

    make helm_deps && make helm_upgrade_install

#### Deploy a new release

    make helm_upgrade_install

#### Deploy a new release securely

This target should be used when deploying an environment that is exposed to the Internet. It expects the environment variables `API_SECRET` and `MYSQL_PASSWORD` to be defined (these values should be injected by your CI pipeline or secrets manager).

    make helm_upgrade_install_secure

#### Delete a release

    make helm_delete
