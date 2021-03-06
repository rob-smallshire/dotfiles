import sys

from itertools import permutations
from random import shuffle

from celery import Celery, group

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
    return items

def main():
    difficulty = 10
    num_tasks = 100
    print([bad_sort(random_integers(difficulty))
                for _ in range(num_tasks)])
    return
    job = group([bad_sort(random_integers(difficulty))
                for _ in range(num_tasks)])

    result = job.apply_async()

    result.join(callback=print)


if __name__ == '__main__':
    main()
