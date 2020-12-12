# drf-vuejs

By Corey Gale (`mechtrondev[at]gmail.com`)

## Executive summary

Backend, frontend, IaC and automation to serve as a foundation for rapid-prototyping new apps.

## Stack

#### Frontend

- VueJS
- BootstrapVue

#### Backend

- Python 3
- Django REST framework
- `django-allauth` (login via Google and GitHub via OAuth2)
- SQLite DB

#### DevOps

- Docker container images
- Helm chart for Kubernetes deployment
- GitHub Actions workflow

## Setup

#### Backend

1. Change into the API base directory: `cd api`
1. Create a virtualenv: `python3 -m venv venv && source venv/bin/activate`
1. Install Python dependencies: `pip3 install -r requirements.txt`
1. Migrate the database: `python3 manage.py migrate`
1. Create a super user: `python3 manage.py createsuperuser --email me@corey.tech --username admin`
1. Start the API: `python3 manage.py runserver`
1. Log into the [Django Admin web console](http://localhost:8000/admin) using the superuser created in #5
1. Under the "Sites" section, add your site domain name(s) (`127.0.0.1` for local dev)

###### Setup GitHub OAuth

1. Setup a [new OAuth app in GitHub](https://github.com/settings/applications/new) and obtain a Client ID and Client Secret. Enter the callback URL `http://localhost:8000/auth/github/callback/`.
1. Under "Social Accounts", click "Add" and add a social application with the following info:
    Name: GitHub
    Client id: from #1
    Secret key: from #1
    Key: N/A
    Sites: move all "Available sites" to "Chosen sites"
1. Click "Save"

###### Setup Google OAuth

1. Setup a [new OAuth app in Google](https://developers.google.com/identity/sign-in/web/sign-in) and obtain a Client ID and Client Secret. Enter the callback URL `http://localhost:8000/auth/google/callback/`.
1. Under "Social Accounts", click "Add" and add a social application with the following info:
    Name: Google
    Client id: from #1
    Secret key: from #1
    Key: N/A
    Sites: move all "Available sites" to "Chosen sites"
1. Click "Save"

#### Frontend

Coming soon

## API Usage

1. Get your OAuth URL: `curl -I http://localhost:8000/auth/<provider>/url/` where `<provider>` is `github` or `google`
1. You will get a 302 re-direct URL from your 3rd party OAuth2 provider to the frontend. 
    Example callback: `https://frontend/auth/<provider>?code=a1e3ccca86ab0645cd92&state=MQ1CQVhgpSV4`
1. Get an auth token: `curl -X POST localhost:8000/auth/<provider>/token/ -d code=a1e3ccca86ab0645cd92`
    Example response: `{"key":"2f0d8f56aa3111e9b372a1ab582a0dcee22a71ba"}`
1. Get your user's details: `curl localhost:8000/auth/user/ -H "Authorization: Token 2f0d8f56aa3111e9b372a1ab582a0dcee22a71ba"`
    Example response:
    ```json
    {"pk":2,"username":"example","email":"you@example.com","first_name":"Example","last_name":"User"}
    ```
