import sys

from celery import Celery

app = Celery()
app.config_from_object('celeryconfig')

@app.task
def add(x, y):
    return x + y
