if [ -f ~/.bashrc ]; then
   source ~/.bashrc
fi

export LC_ALL="en_GB.UTF-8"
export LANG="en_GB.UTF-8"

export PATH=$HOME/bin:$PATH

# Set git autocompletion and PS1 integration
if [ -f $HOME/bin/git-completion.bash ]; then
  . $HOME/bin/git-completion.bash
fi

if [ -f /usr/local/etc/bash_completion ]; then
  . /usr/local/etc/bash_completion
fi

if [ -f /opt/local/etc/bash_completion ]; then
    . /opt/local/etc/bash_completion
fi

if [ -f $HOME/bin/git-prompt.sh ]; then
    . $HOME/bin/git-prompt.sh
fi

GIT_PS1_SHOWDIRTYSTATE=true


BOLD="\[\033[1m\]"
RED="\[\033[0;31m\]"
GREEN="\[\e[0;32m\]"
GOLD="\[\e[0;33m\]"
BLUE="\[\e[34m\]"
PURPLE="\[\033[1;35m\]"
OFF="\[\033[m\]"

function exitstatus {
    local EXITSTATUS="$?"
    local HOST="\h"
    local USER="\u"
    local DIR="\w"
    local NEWLINE="\n"
    local DATE="\d"
    local TIME="\t"

    # Virtual Env
    if [[ $VIRTUAL_ENV != "" ]]
       then
           local VENV=" ${GOLD}(${VIRTUAL_ENV##*/})"
    else
       local VENV=''
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

# pyenv setup
export PYENV_ROOT=/usr/local/var/pyenv
if which pyenv > /dev/null; then eval "$(pyenv init -)"; fi

# Setup for virtualenvwrapper
if [[ $HOSTNAME == Suilven* ]]; then
    export WORKON_HOME=$HOME/dev/virtualenvs
else
    export WORKON_HOME=$HOME/.virtualenvs
fi

export PROJECT_HOME=$HOME/dev
export VIRTUALENVWRAPPER_PYTHON=/usr/local/var/pyenv/shims/python3
if which pyenv > /dev/null; then
    pyenv virtualenvwrapper
fi

export PATH="$HOME/.npm-packages/bin:$PATH"

export GOPATH="$HOME/dev/go"
export GOROOT="$(brew --prefix golang)/libexec"
export PATH="$PATH:${GOPATH}/bin:${GOROOT}/bin"
test -d "${GOPATH}" || mkdir "${GOPATH}"
test -d "${GOPATH}/src/github.com" || mkdir -p "${GOPATH}/src/github.com"
