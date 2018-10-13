

from adder import bad_sort

def random_integers(size):
    items = list(range(size))
    shuffle(items)
    return items

def main():
    difficulty = 3
    num_tasks = 10

    job = group([bad_sort.s(random_integers(10)) for _ in range(20)])
    result = job.apply_async()
    print("Waiting...")
    result.get(callback=print)
    print("Done!")

if __name__ == '__main__':
    main()
