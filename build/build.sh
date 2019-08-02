#!/bin/bash
# build.sh
#
# chmod +x  build/*.sh
# fe-pub.317hu.com  resources.317hu.com
#
Pub=$1
echo "----------------------------------"

if [ ! "$Pub" = "local" ];then
  echo -e "please enter your will build env version, \n split with one space (eg, dev sit or uat):"
  read env_list

  sleep 1

  echo "please enter action for commit:"
  read commit_msg_action

  echo "please enter message for commit:"
  read commit_msg
  env_list=$(echo $env_list | awk '{for(i=1;i<100;i=i+1){if($i=="dev"||$i=="sit"||$i=="uat") printf $i" "}}')
  echo -e "\nYou will publish env version: $env_list, commit message: $commit_msg_action $commit_msg ?"
  # echo -e "\nYou will publish commit message: $commit_msg_action $commit_msg ?"

  echo "(0) Y"
  echo "(1) N"
  echo "(2) Exit"
  read comfirm_build
  case $comfirm_build in
    0|Y|y)
    echo "run build at $env_list..."
    sleep 1;;
    1|N|n)
    echo "it will abort..."
    sleep 1
    exit;;
    *)
    exit;;
  esac

  checked_git_status
else
  ./node_modules/.bin/cross-env VERSION_ENV="$Pub" RUN_ENV="$Pub" node build/build.js "$Pub"
  echo -e "...本地构建成功"
fi
