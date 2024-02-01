#!/bin/bash

# Get the current branch name
BRANCH_NAME=$(git symbolic-ref --short HEAD 2>/dev/null)
COMMIT_MESSAGE=$(cat "$1")

# Check if the branch is main or develop
if [ "$BRANCH_NAME" == "main" ] || [ "$BRANCH_NAME" == "develop" ]; then
  exit 0
fi

# Extract JIRA ID from the branch name
JIRA_ID=$(echo "$BRANCH_NAME" | grep -oE '[A-Z]+-[0-9]+')

# JIRA ID
if [ -z`` "$JIRA_ID" ]; then
  echo "브랜치명에 jiraID로 보이는게 존재하지 않음"
  exit 0
fi

# Extract origin commit message
originCommitMessage=$(cat "$1")
IFS=":" read -r commitType commitDescription <<< "$originCommitMessage"
commitType=$(echo "$commitType" | awk '{$1=$1};1')
commitDescription=$(echo "$commitDescription" | awk '{$1=$1};1')

footer="https://dongurami.atlassian.net/browse/$JIRA_ID"
customCommitMessage="${commitType}/${JIRA_ID}: ${commitDescription}

${footer}
"

DESCRIPTION=$(git config branch."$BRANCH".description)

if [ -z "$(echo "$originCommitMessage" | head -n 1)" ]; then
  customCommitMessage="commitType${customCommitMessage}${originCommitMessage}"

  echo -e "$customCommitMessage" > "$1"

else
  echo -e "$customCommitMessage" > "$1"
  echo "The hook changed the commit message to the"
  echo "$customCommitMessage"
  echo "--------------------------"
fi
