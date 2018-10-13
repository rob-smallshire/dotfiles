Exercise 5 - Persistence Oriented Repositories
==============================================

In this exercise you'll be creating a persistence oriented repository in which
can store ``WorkItem`` objects. If you'd also like to create a repository for
``Board``, that can be homework.  We *won't* be depending on the repositories we
make in this exercise in the later exercises, so we have a bit of freedom here.

The objectives for this exercise are to:

* understand how persistence oriented repositories can store aggregates

* recall that repositories don't *create* aggregates, but they will
  *instantiate* them. The act of creation is the responsibility of *factories*
  not repositories.

* appreciate that repositories work at the aggregate level rather than at the
  child-entity level

* understand the use of the dependency inversion principle to maintain
  technology independence of the domain model

* learn how organise infrastructure concerns, such as specific persistence
  technologies, in the source code

* understand how to maintain an *identity map* in Python

.. attention::

   The code for this exercise is in ``code/05_repositories/``


Exercise 5a
-----------

To pursue an 'onion', 'hexagonal' or 'clean' architecture we need to use
dependency inversion. This means that rather than our domain model being
implemented-in-terms-of a persistence technology, our model only contains
*abstract* repositories.  The *concrete* implementations of these repositories
will live elsewhere, in an infrastructure layer.

Since repositories typically have a one-to-one correspondence with aggregates,
we find it convenient to locate the abstract repositories within the aggregate
module, alongside the entities and factories.

The abstractness of our repository interface is enforced using the ``ABCMeta``
metaclass and the ``abstractmethod`` decorator, both imported from the ``abc``
module of the Python Standard Library.

We've added the following repository abstract base class into the bottom of
``workitem.py``:

.. literalinclude:: ../../../outsets/05_repositories/kanban/domain/model/workitem.py
   :language: python
   :lines: 100-

Read through the docstrings carefully, so you can fully understand what is
expected.

Exercise 5b
-----------

We've also created an infrastructure package in the top-level ``infrastructure``
directory, and in
``infrastructure/persistence_oriented_repos/work_item_repository.py`` you'll
find a partially implemented *concrete* repository called
``JsonWorkItemRepository`` which is intended to store work item aggregates as
separate files within a directory, each containing a single JSON representations
of a work item. The filenames will be based on the unique work item IDs.

We've already implemented the ``__init__()`` and ``put(work_item)`` methods but
the query methods definitely need your attention:

.. literalinclude:: ../../../outsets/05_repositories/infrastructure/persistence_oriented_repos/work_item_repository.py
   :language: python


We've also implemented a comprehensive test-suite for ``JsonWorkItemRepository``
in ``tests/test_json_workitem_repository.py``.

Implement the ``work_item_with_id()``, ``work_items_with_ids()`` and
``work_items_with_name()`` repository query methods.

Check your progress with,

.. code-block:: shell

   $ python -m pytest tests/test_json_workitem_repository.py

.. hint::

   Efficiency is not our concern here. Code that works and is conformant to the
   interface is the goal in this exercise.  In reality, you might use a store
   such as *MongoDB* or recent versions of *PostgreSQL* which support binary
   JSON.

.. hint::

   The optional ``work_item_ids argument`` to ``work_items_with_name`` can be
   a bit awkward to handle because when provided it serves to *restrict* the
   result set. The default of ``None`` is equivalent to saying "the set of all
   possible work item IDs". At first that might seem tricky to represent, but
   take a look at ``univseral_container()`` in ``utility/containers.py`` for
   inspiration.

..  admonition:: Solution
   :class: toggle

   .. literalinclude:: ../../../solutions/05_repositories/infrastructure/persistence_oriented_repos/work_item_repository.py
      :language: python
      :emphasize-lines: 59-69, 82-88, 104-112


Exercise 5c
-----------

Near the end of the ``main()`` function in the application, instantiate a
``JsonWorkItemRepository`` and ``put()`` existing work items ``work_item_1``
through to ``work_item_5`` into it.

Retrieve the work items named "Land on Mars".

..  admonition:: Solution
   :class: toggle

   .. literalinclude:: ../../../solutions/05_repositories/application/main.py
      :language: python
      :lines: 97-107
