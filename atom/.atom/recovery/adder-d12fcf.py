import sys

from celery import Celery

app = Celery()
app.config_from_object('celeryconfig')

@app.task
def compute(x, y):
    return x + y

def main():
    root_num = 10
    async_results = [compute.delay(a, b) for a, b in product(range(root_num))]
