# This attempts to build a distribution directory for Intermediate Python.
#
# This creates a directory and populates it with code, exercises, solutions, and
# presentations drawn from two locations:
#
#  1. The git repo for intermediate python
#  2. The google-drive directory of presentations
#
# Before you run this, make sure the PDFs have been generated for the
# presentations.
#
# To run it:
#
#   ./build_dist.sh <git-repo> <gdrive directory> <output directory>
#
# NB: Make sure that shell running the script has mkvirtualenv since we use that
# to build the sphinx stuff.

GIT_REPO=$1
PRESENTATION_DIR=$2
OUT_DIR=$3

# Make a venv to work from
#source `which virtualenvwrapper.sh`
mktmpenv --python=python3.5

set -e

# First, build HTML from sphinx
pushd "$GIT_REPO"/exercises
pip install sphinx_rtd_theme
make html
popd

# Copy stuff from git repo
mkdir -p "$OUT_DIR"/exercises
cp -R "$GIT_REPO"/code "$OUT_DIR"/exercises
cp -R "$GIT_REPO"/exercises/build/html "$OUT_DIR"/exercises
cp -R "$GIT_REPO"/solutions "$OUT_DIR"/exercises

# Copy presentations
mkdir -p "$OUT_DIR"/presentations
cp -R "$PRESENTATION_DIR"/[0-9][0-9]-* "$OUT_DIR"/presentations
pushd "$OUT_DIR"/presentations
find . -name "*key" | xargs rm
find . -name "Icon*" | xargs rm
popd

# Copy README into directory
cp "$GIT_REPO"/distribution-readme.txt "$OUT_DIR"/readme.txt

# TODO: It would be best if we always did this last step, irrespective of whether previous steps failed.
# Cleanup the virtualenv
deactivate
