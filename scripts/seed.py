#!/usr/bin/env python3

import datetime
import os
import string
import random
import requests


API_HOST = os.environ.get('API_HOST', 'http://127.0.0.1:8000')
API_AUTH_TOKEN = os.environ.get('API_AUTH_TOKEN', '')
NUMBER_OF_POSTS_TO_CREATE = int(os.environ.get('NUMBER_OF_POSTS_TO_CREATE', 100))
_NUMBER_OF_LIKES_MIN = 0
_NUMBER_OF_LIKES_MAX = 100


def generate_random_string(length):
    return ''.join(
        random.SystemRandom().choice(
            string.ascii_uppercase + string.digits
        ) for _ in range(length))


def get_auth_header():
    return {'Authorization': 'Token {}'.format(API_AUTH_TOKEN)}


def generate_post_data():
    return {
        'title': generate_random_string(random.randint(3, 128)),
        'content': generate_random_string(random.randint(5, 2048)),
    }


def create_post():
    response = requests.post(
        '{}/post'.format(API_HOST),
        headers=get_auth_header(),
        data=generate_post_data(),
    )
    assert response.json()["id"] != None
    return response.json()


def like_post(post_id):
    response = requests.get(
        '{api_hostname}/like/{post_id}'.format(
            api_hostname=API_HOST,
            post_id=post_id,
        ),
    )
    return response


def main():
    for i in range(0, NUMBER_OF_POSTS_TO_CREATE):
        post = create_post()
        like_count = random.randint(_NUMBER_OF_LIKES_MIN, _NUMBER_OF_LIKES_MAX)
        for _ in range(like_count):
            like_post(post["id"])
        print((
            "{current}/{count} Seeded post with ID "
            "{post_id} and liked it {like_count} times"
        ).format(
            current=i+1,
            count=NUMBER_OF_POSTS_TO_CREATE,
            post_id=post["id"],
            like_count=like_count,
        ))


if __name__ == '__main__':
    main()
