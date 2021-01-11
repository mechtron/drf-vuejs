By Corey Gale (`mechtrondev[at]gmail.com`)

# Features

1. Django REST framework API
1. Mobile-friendly VueJS web client
1. Buttery-smooth Google OAuth2 login flow
1. Support for additional OAuth2 providers via `django-allauth` & `dj-rest-auth`
1. Kubernetes deployment to AWS EKS via Helm
1. GitHub Actions workflow for publishing Docker images and deploying to AWS EKS
1. Local dev environment built with `docker-compose`
1. Remote ephemeral dev environments deployed to AWS EKS (with auto clean-up)
1. API supports both SQLite and MySQL databases
1. Pagination for large API responses

# Environments

## Production

`drf-vuejs`'s [production environment](https://posts.k8s.sandbox.ggops.com) is hosted using Kubernetes on AWS EKS. The application is deployed using the included Helm chart via GitHub Actions using [`mechtron/github-actions-ek8s-toolbox`](https://github.com/pdemagny/github-actions-ek8s-toolbox).

## Dev environments

`drf-vuejs` supports 3 different development environments:

1. Local IDE (SQLite database)
1. Local `docker-compose` environment (MySQL database)
1. Ephemeral test environments hosted on AWS EKS

# Setup

## 1) Local environment

### Backend (API and database)

1. Change into the API base directory: `cd api`
1. Create a virtualenv: `python3 -m venv venv && source venv/bin/activate`
1. Install Python dependencies: `pip3 install -r requirements.txt`
1. Migrate the database: `python3 manage.py migrate`
    Note: running the migrations will also create a Django superuser with username `admin` and password `password`. If you would like to specify a different password, set the `DJANGO_SU_PASSWORD` environment variable before migrating the database.
1. Start the API: `python3 manage.py runserver`
1. Log into the [Django Admin web console](http://localhost:8000/admin/) using the superuser created in #4.
1. Under the "Sites" section, add your site domain name(s) (`localhost` for local dev)

#### Google OAuth

1. Setup a [new OAuth app in Google](https://developers.google.com/identity/sign-in/web/sign-in) and obtain a Client ID and Client Secret. Enter the callback URL `http://localhost:8080/auth/google/`.
1. Under "Social Accounts", click "Add" and add a social application with the following info:
    Name: Google
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

## 2) Docker Compose environment

If you prefer, there is also a `docker-compose` environment included which allows you to use MySQL for the API database instead of SQLite. Included are some helpful `make` targets to simplify its usage:

#### Start Docker environment

    make docker_up

#### Create the API's database for the first time

    make db_create

#### Migrate the API's database

    make db_migrate

## 3) Ephemeral test environments

Code pushed to branches other than `master` will automatically create or update an ephemeral test environment available at `posts-<sanitized-branch-name>.k8s.sandbox.ggops.com`. These environments will be cleaned-up (deleted) automatically by `kube-janitor` 7 days after the most recent push to the environment's remote feature branch.

Note: to use the OAuth features of the app, you will also need to arm the app with your OAuth credentials (see "Google OAuth" above). To access the API's Django admin web console, Use `kubectl`'s `port-forward` to the API container:

    kubectl -n <sanitized-branch-name> port-forward posts-api-123abc-45de 8000

# API usage

### Authentication

1. Generate and redirect your client to Google's OAuth Login URL.
    Example URL: `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:8080/auth/google/&prompt=consent&response_type=code&client_id=<client_id>&scope=email+profile&access_type=offline` where `<client_id>` is your Client ID from #1 in "Setup Google OAuth" above.
1. You will get a 302 redirect URL from your 3rd party OAuth2 provider to the frontend.
    Example callback: `https://frontend/auth/<provider>/?code=a1e3ccca86ab0645cd92&state=MQ1CQVhgpSV4`
1. Get an auth token: `curl -X POST localhost:8000/auth/<provider>/ -d code=a1e3ccca86ab0645cd92`
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

# Kubernetes deployments

## Cluster dependencies

To deploy the app using the included Helm chart, the target Kubernetes cluster must have the following dependencies installed:

1. [Ambassador](https://github.com/datawire/ambassador-chart)
1. [kube-janitor](https://codeberg.org/hjacobs/kube-janitor)

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

# Docker images

### API

    docker pull mechtron/posts-api

### Web

    docker pull mechtron/posts-web

#### Manually build and tag Docker images

##### API

```bash
APP_DIR=api \
IMAGE_NAME=mechtron/posts-api \
COMMIT_TAG=API_v1.0 \
make docker_image
```

##### Web

```bash
APP_DIR=web \
IMAGE_NAME=mechtron/posts-web \
COMMIT_TAG=Web_v1.1 \
make docker_image
```

# Forking?

If you're planning on forking this project, the included GitHub Actions workflow expects the following repository secrets:

| Secret name               | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| `API_SECRET_DEV`          | Dev API secret                                             |
| `API_SECRET_PROD`         | Prod API secret                                            |
| `AWS_ACCESS_KEY_ID`       | AWS access key ID (must have access to `EKS_CLUSTER_NAME`) |
| `AWS_SECRET_ACCESS_KEY`   | AWS secret access key                                     |
| `DJANGO_SU_EMAIL_DEV`     | Dev admin user email (defaults to `you@example.com`)       |
| `DJANGO_SU_EMAIL_PROD`    | Prod admin user email                                      |
| `DJANGO_SU_PASSWORD_DEV`  | Dev admin user password                                    |
| `DJANGO_SU_PASSWORD_PROD` | Prod admin user password                                   |
| `DOCKER_PASSWORD`         | DockerHub password (typically an API token)                |
| `DOCKER_USERNAME`         | DockerHub username                                         |
| `EKS_CLUSTER_NAME`        | AWS EKS cluster name                                       |
| `MYSQL_PASSWORD_DEV`      | Dev database `root` user password                          |
| `MYSQL_PASSWORD_PROD`     | Prod database `root` user password                         |
