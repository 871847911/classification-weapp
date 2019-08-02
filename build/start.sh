#!/bin/bash
# start.sh
# 
# http://hospital.dev.317hu.com/hospital-admin/
# http://admin.dev.317hu.com/bz-admin/
#

Target=$1
echo "----------------------------------"  

if [ "$Target" = "deploy" ];then
  ssh -p 22 fe@172.16.150.169
  echo "～退出项目化部署环境。"
else
  echo "please select your execute env:" 
  select input in dev  sit uat Exit;  
  do  
    break  
  done  

  echo "You have selected $input"
  sleep 1;
  if [ "$input" = "Exit" ];then
    exit;
  else
    echo "run start at $input..." 
    
    chmod +x ./build/*.sh
    mkdir -p .git/hooks && \cp -a ./build/commit-msg.sh .git/hooks/commit-msg
    
    #配置origin远程分支的代码审核，命令更新为：按分支名推送
    git config remote.origin.push refs/heads/*:refs/for/*
  fi

  ./node_modules/.bin/cross-env VERSION_ENV="$input" RUN_ENV=start node build/dev-server.js
  # env
  # export VERSION_ENV=dev-local

fi
