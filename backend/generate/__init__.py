"""
Module to generate users
"""

from re import compile
from faker import Faker

from random import sample
from base_app.models import User


fake = Faker()


def generate_users(n: int):
    pattern = compile(r"[^\w\d]+")
    pwd = "2I1^oW0NGV&i"
    users = []
    for _ in range(n):
        name = fake.unique.name()
        first, last = name.split(maxsplit=1)
        username = pattern.sub("", name.lower())
        email = f"{username}@gmail.com"
        user = User(
            username=username,
            email=email,
            first_name=first,
            last_name=last,
        )
        user.set_password(pwd)
        try:
            user.full_clean()
        except Exception:
            continue
        users.append(user)
    User.objects.bulk_create(users)
    return users


def generate_followers(users: list[User], count: int):
    count = min(len(users) - 1, count)

    for user in users:
        followers = sample(users, count)
        user.followers.set(u for u in followers if u != user)


def run_generation(users: int, followers: int):
    users = generate_users(users)
    generate_followers(users, followers)
