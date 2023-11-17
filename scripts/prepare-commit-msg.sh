#!/bin/sh
# .git/hooks/prepare-commit-msg
#
# Automatically add branch name and branch description to every commit message except merge commit.
# https://stackoverflow.com/a/18739064
#

COMMIT_EDITMSG=$1

setMessage() {
  BRANCH=$(git branch | grep '*' | sed 's/* //')
  IFS="/" read -r BRANCH_TYPE ISSUE_NUMBER BRANCH_DESCRIPTION <<< "$BRANCH"

  ORIGIN_MESSAGE=$(cat $COMMIT_EDITMSG)
  IFS=":" read -r COMMIT_TYPE COMMIT_DESCRIPTION <<< "${ORIGIN_MESSAGE}"
  COMMIT_TYPE=$(echo "$COMMIT_TYPE" | awk '{$1=$1};1')
  COMMIT_DESCRIPTION=$(echo "$COMMIT_DESCRIPTION" | awk '{$1=$1};1')

  DESCRIPTION=$(git config branch."$BRANCH".description)

  echo "$COMMIT_TYPE/$ISSUE_NUMBER: $COMMIT_DESCRIPTION" > $COMMIT_EDITMSG
  if [ -n "$DESCRIPTION" ] 
  then
     echo "" >> $COMMIT_EDITMSG
     echo $DESCRIPTION >> $COMMIT_EDITMSG
  fi 
}

MERGE=$(cat $COMMIT_EDITMSG|grep -i 'merge'|wc -l)

if [ $MERGE -eq 0 ] ; then
  if [ ! -s "$COMMIT_EDITMSG" ]; then
    setMessage
  fi
fi