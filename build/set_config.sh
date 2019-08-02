#!/bin/bash
# set_config.sh


chmod +x ./build/*.sh
\cp -a ./build/commit-msg.sh .git/hooks/commit-msg

git config remote.origin.push refs/heads/*:refs/for/*
