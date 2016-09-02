if [ -f ~/.bashrc ]; then
   source ~/.bashrc
fi

export LC_ALL="en_GB.UTF-8"
export LANG="en_GB.UTF-8"

##
# Your previous /Users/rjs/.bash_profile file was backed up as /Users/rjs/.bash_profile.macports-saved_2012-11-12_at_17:26:57
##

export PATH=$HOME/bin:$PATH

# Set git autocompletion and PS1 integration
if [ -f $HOME/bin/git-completion.bash ]; then
  . $HOME/bin/git-completion.bash
fi
if [ -f $HOME/bin/git-prompt.sh ]; then
    . $HOME/bin/git-prompt.sh
fi
GIT_PS1_SHOWDIRTYSTATE=true

if [ -f /opt/local/etc/bash_completion ]; then
    . /opt/local/etc/bash_completion
fi


BOLD="\[\033[1m\]"
RED="\[\033[0;31m\]"
GREEN="\[\e[0;32m\]"
GOLD="\[\e[0;33m\]"
BLUE="\[\e[34m\]"
PURPLE="\[\033[1;35m\]"
OFF="\[\033[m\]"

function exitstatus {
    EXITSTATUS="$?"
    HOST="\h"
    USER="\u"
    DIR="\w"
    NEWLINE="\n"
    DATE="\d"
    TIME="\t"

    # Virtual Env
    if [[ $VIRTUAL_ENV != "" ]]
       then
           VENV=" ${GOLD}(${VIRTUAL_ENV##*/})"
    else
       VENV=''
    fi

    # Basic Prompt
    PROMPT="${GREEN}${USER}@${HOST}${OFF}:${BLUE}${DIR}${VENV}${PURPLE}$(__git_ps1)${OFF}"
    #PROMPT="\[${green}\]\u\[${off}\]"

    # Exit status
    if [ "${EXITSTATUS}" -eq 0 ]
        then
            PS1="${PROMPT}\n$ "
    else
        PS1="${PROMPT} ${RED}${BOLD}[${EXITSTATUS}]${OFF}\n$ "
    fi

    PS2="${BOLD}>${OFF} "
}

PROMPT_COMMAND=exitstatus

# Perforce
export P4CONFIG=.p4config

PATH="/opt/pypy3-2.3.1-osx64/bin:${PATH}"
export PATH

# Setup for virtualenvwrapper
export WORKON_HOME=$HOME/dev/virtualenvs
export PROJECT_HOME=$HOME/dev
VIRTUALENVWRAPPER_PYTHON=/Library/Frameworks/Python.framework/Versions/3.5/bin/python3
source /Library/Frameworks/Python.framework/Versions/3.5/bin/virtualenvwrapper.sh

# Setting PATH for Python 3.5
# The orginal version is saved in .bash_profile.pysave
PATH="/Library/Frameworks/Python.framework/Versions/3.5/bin:${PATH}"
export PATH
