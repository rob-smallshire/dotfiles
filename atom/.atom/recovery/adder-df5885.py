import sys

from itertools import permutations
from random import shuffle

from celery import Celery

app = Celery()
app.config_from_object('celeryconfig')

def is_sorted(items):
    return all(items[i] <= items[i+1] for i in range(len(items)-1))

@app.task
def bad_sort(items):
    """A catastrophically inefficient sort."""
    for permutation in permutations(items):
        if is_sorted(permutation):
            return permutation

def random_integers(size):
    items = list(range(size))
    shuffle(items)

def main():
    size = 10
    async_results = [bad_sort.delay(random_integers(size))
    for items  in product(range(root_num))]

if __name__ == '__main__':
    main()
    
