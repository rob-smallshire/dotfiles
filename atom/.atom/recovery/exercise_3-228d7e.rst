Exercise 3: Working with Sequences and Unit Tests
=================================================

Background: How might enumerate() work?
-------------------------------------

We've seen how the built-in ``enumerate()`` function can be used to generate
integer indexes corresponding the elements in a sequence such as a list. But
how does ``enumerate()`` do its job?

In this exercise, you'll create a function very similar to ``enumerate()``,
called ``indexed()``, which accepts a sequence and returns a collection of
pairs (*i.e.* 2-tuples) where the first element of each tuple is the integer
index of an item, and the second is the item itself.

For the first time, you'll be using automated *unit tests* to guide your
programming. Unit tests are Python functions which check whether a
*unit-under-test* works as expected. In this exercise, the *unit* in question
is the ``indexed()`` function you'll be writing.

The suite of tests is contained in ``test_indexed.py`` and the code you'll be
writing will go in ``sequence_tools.py``.

Exercise 3a : Running the tests
-------------------------------

Let's start by seeing how to run the tests. You haven't written any code yet,
so we expect the tests to fail. That's okay, as you progress through this
exercise, the tests should begin to pass.

To run the tests, from an operating system prompt use the following command::

  $ python -m unittest test_indexed

This command tells Python to *execute* the ``unittest`` module from the Python,
and passes to it the *module name* for the module which contains the tests.

You should see output similar to the following::

    $ python -m unittest test_indexed.TestIndexed
    FEFFFF
    ======================================================================
    ERROR: test_first_element_of_output_tuples_is_arithmetic_progression_with_increment_of_one (test_indexed.TestIndexed)
    ----------------------------------------------------------------------
    Traceback (most recent call last):
      File "/Users/rjs/dev/indexed/test_indexed.py", line 38, in test_first_element_of_output_tuples_is_arithmetic_progression_with_increment_of_one
        for index, item in indexed(sequence):
    TypeError: 'NoneType' object is not iterable

    ======================================================================
    FAIL: test_empty_input_sequence_gives_empty_output_sequence (test_indexed.TestIndexed)
    ----------------------------------------------------------------------
    Traceback (most recent call last):
      File "/Users/rjs/dev/indexed/test_indexed.py", line 12, in test_empty_input_sequence_gives_empty_output_sequence
        []
    AssertionError: First sequence has no length.    Non-sequence?
    - None
    + []

    ======================================================================
    FAIL: test_indexed_characters_from_a_string (test_indexed.TestIndexed)
    ----------------------------------------------------------------------
    Traceback (most recent call last):
      File "/Users/rjs/dev/indexed/test_indexed.py", line 60, in test_indexed_characters_from_a_string
        (10, 'h')]
    AssertionError: First sequence has no length.    Non-sequence?
    - None
    + [(0, 'S'),
    +  (1, 'i'),
    +  (2, 'x'),
    +  (3, 't'),
    +  (4, 'y'),
    +  (5, ' '),
    +  (6, 'N'),
    +  (7, 'o'),
    +  (8, 'r'),
    +  (9, 't'),
    +  (10, 'h')]

    ======================================================================
    FAIL: test_indexed_items_from_a_range (test_indexed.TestIndexed)
    ----------------------------------------------------------------------
    Traceback (most recent call last):
      File "/Users/rjs/dev/indexed/test_indexed.py", line 89, in test_indexed_items_from_a_range
        (5, 20),]
    AssertionError: First sequence has no length.    Non-sequence?
    - None
    + [(0, 10), (1, 12), (2, 14), (3, 16), (4, 18), (5, 20)]

    ======================================================================
    FAIL: test_indexed_items_from_a_tuple (test_indexed.TestIndexed)
    ----------------------------------------------------------------------
    Traceback (most recent call last):
      File "/Users/rjs/dev/indexed/test_indexed.py", line 76, in test_indexed_items_from_a_tuple
        (8, 10946964)]
    AssertionError: First sequence has no length.    Non-sequence?
    - None
    + [(0, 0),
    +  (1, 0),
    +  (2, 1),
    +  (3, 1),
    +  (4, 10),
    +  (5, 200),
    +  (6, 5915),
    +  (7, 229376),
    +  (8, 10946964)]

    ======================================================================
    FAIL: test_non_empty_input_sequence_gives_non_empty_output_sequence (test_indexed.TestIndexed)
    ----------------------------------------------------------------------
    Traceback (most recent call last):
      File "/Users/rjs/dev/indexed/test_indexed.py", line 32, in test_non_empty_input_sequence_gives_non_empty_output_sequence
        (12, 551)]
    AssertionError: First sequence has no length.    Non-sequence?
    - None
    + [(0, 1),
    +  (1, 1),
    +  (2, 1),
    +  (3, 1),
    +  (4, 2),
    +  (5, 3),
    +  (6, 6),
    +  (7, 11),
    +  (8, 23),
    +  (9, 47),
    +  (10, 106),
    +  (11, 235),
    +  (12, 551)]

    ----------------------------------------------------------------------
    Ran 6 tests in 0.002s

    FAILED (failures=5, errors=1)

This might look quite scary! Don't worry though. Have a read through the test
code in ``test_indexed.py`` and see if you can understand how the tests work,
and how their ouput relates to the specific behaviours of ``indexed()`` that
they are testing.

.. hint::

  We've used the ``class`` keyword in this test. This is an aspect of how the
  ``unittest`` framework is used and the details aren't important here. For now,
  you can think of the `class` simply as a mechanism for grouping the tests.
  We'll come back to classes later in the course.

If you can run the tests, they fail, and you think understand why, then you're
ready to move onto the next step.


Exercise 3b : Running the tests
-------------------------------

Modify and complete the implementation of the ``indexed()`` function as
necessary until you get all the tests passing.


Exercise 3c : Incrementally adding functionality
------------------------------------------------

The last test in the test-suite is called
``_test_start_argument_to_indexed_is_respected()`` (Note the leading
underscore). Because the name of this function does not begin with `test` it
is not being run by the `unittest` test-runner machinery. To make it run,
remove this leading underscore, so the test is called simply
``test_start_argument_to_indexed_is_respected()`` without the underscore.

Run the tests again, with::

  $ python -m unittest test_indexed

and you should find that this addition tests 

Write the module/program ``smart_headline.py``

Try your solution out on the following headlines:

    | Females likelier to test for women's diseases
    | Most earthquake damage is caused by shaking
    | Woman finds a hat in a tree

.. hint::

  * Try ``help(str)`` at the REPL to read about useful methods for
    adjusting the case of strings and joining lists of strings together.

  * Break you solution down into more functions, each of which is quite
    simple

  * On Mac OS X or Linux you can make the module executable, so you can
    run it directly, with this command at the shell prompt::

    $ chmod +x smart_headline.py

.. only:: show_solutions

   .. rubric:: Solution:

   .. literalinclude:: ../../solutions/exercise_2/exercise_2abc/smart_headline.py
      :language: python


Exercise 2b : Testing robustness
--------------------------------

Check that your programs works correctly if given no input - it should
produce an empty headline::

  $ ./smart_headline.py

  $


Exercise 2c : Importing from the REPL
-------------------------------------

Check that your module can be cleanly imported into the REPL::

 $ python3
 >>> import smart_headline

Try to call the individual functions you have defined within it.


Exercise 2d : Documenting your module
-------------------------------------

Ensure your module has a module-docstring. Place usage information for
the module (*i.e.* program) within this string.

Ensure your functions have docstrings which document their interface.
Use Google-style docstrings::

   def some_function(arg1, arg2):
       """One line description.

       Args:
           arg1: Describe first argument.

           arg2: Describe second argument.

       Returns:
           Describe return value.
       """

Try using ``help()`` on your module by importing it into the REPL::

  >>> import smart_headlines
  >>> help(smart_headlines)

.. hint::

    You will need to restart the REPL session after every change
    to your module.

.. only:: show_solutions

   .. rubric:: Solution:

   .. literalinclude:: ../../solutions/exercise_2/exercise_2d/smart_headline.py
      :language: python
      :linenos:
      :emphasize-lines: 3-6, 10-17, 26-35, 52-58

Exercise 2e (Optional) : Printing usage information
---------------------------------------------------

Modify your program, so that if no headline words are passed it prints
the usage information in your module docstring to the standard-error
stream.  You can access the module docstring through a special variable
called ``__doc__`` and you can print to standard-error by passing the
``file`` argument to print::

  print(__doc__, file=sys.stderr)

Now, running the program with no input should print the usage
information::

  $ ./smart_headline.py

  Usage:
      smart_headline.py text to be converted to headline case

.. only:: show_solutions

   .. rubric:: Solution:

   .. literalinclude:: ../../solutions/exercise_2/exercise_2e/smart_headline.py
      :language: python
      :linenos:
      :emphasize-lines: 68-73
