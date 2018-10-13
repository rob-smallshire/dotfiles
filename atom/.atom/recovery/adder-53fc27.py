import sys
from itertools import permutations

from celery import Celery

app = Celery()
app.config_from_object('celeryconfig')

def is_sorted(items):
    return all(items[i] <= items[i+1] for i in range(len(items)-1))

@app.task
def bad_sort(items):
    for permutation in permutations(items):
        if is_sorted(permutation):
            return permutation
