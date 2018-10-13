Exercise 3: Working with 
======================================

Background: Headline case style
-------------------------------

.. image:: _static/attorney.jpg
   :align: center

In this exercise we'll build a program to adjust the case of newspaper
headlines according to a simple style guide which gives us the following
rules:

* All words in the headline will be in title case (with first letter
  uppercase)

* Except the following prepositions: a, an, the, and, or, for, of, in,
  to, by

* Except the first word, which is always in title case

* Headline words will be separated by a single space

Our goal is to build a program, which given an unquoted headline on the
command line prints a version in what is called 'Headline Case', like
this on Linux or Mac OS X::

  $ ./smart_headline.py Man accused of killing lawyer receives a new attorney
  Man Accused of Killing Lawyer Receives a New Attorney

or this, on Windows::

  > smart_headline.py Man accused of killing lawyer receives a new attorney
  Man Accused of Killing Lawyer Receives a New Attorney


Exercise 2a : A program for typography
--------------------------------------

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
