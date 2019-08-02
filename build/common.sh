#!/bin/bash
# common.sh
#
#指定 目标发布仓库路径
REMOTE_PUBLISH
function set_remote_publish () {
  if [ ! -d "$dir/.git" ]; then
    git init
  # else
  #   remote_origin=$(git remote -v | grep origin | head -1 | awk '{print $2}')
  #   [ -n "$remote_origin" ] && git remote remove origin
    git remote add origin $REMOTE_PUBLISH
  fi
}
export -f set_remote_publish
function checked_git_status () {
  local dir=. msg branch_name repo commit_msg_status
  if [ -d "$dir/.git" ]; then
    msg=$(git status | grep 'Changes not staged for commit' | awk '{print $3}')
    branch_name=$(git branch -v | grep '*' | awk '{print $2}')
    REMOTE_PUBLISH=$(git remote -v | grep publish | head -1 | awk '{print $2}')
    if [ -z "$REMOTE_PUBLISH" ]; then
      #未指定目标发布仓库
      repo=$(git remote -v | grep origin | head -1 | awk '{print $2}' | sed 's/.*\///g' | awk -F "." '{print $1}' )
      REMOTE_PUBLISH="git@gitlab.317hu.com:dev-web/$repo.git"
    fi
    if [ "$msg" = 'staged' ]; then
      commit_msg_status="...请暂存本地修改？"
    else
      #之前，使用 tmp 临时发布资源目录：1）清除自动merge的可能性冲突  2）保持发布记录
      [ -d "pub" ] && rm -rf pub
      mkdir -m 776 pub
      git clone ./ ./pub
      rm -rf pub/.git
      #将一直没有.git
      cd ./pub
      cur_dateTime=$(date "+%Y%m%d%H%M%s")
      FILE="pub.json"
      echo -e "{" > $FILE
      echo -e "\t\"branchEnv\":\"$branch_name\"," >> $FILE
      echo -e "\t\"tamp\":\"$cur_dateTime\"" >> $FILE
      echo -e "}" >> $FILE
      set_remote_publish
      git add .
      git commit -m "${env_list}taro_h5@$commit_msg_action $commit_msg"
      # echo $(git remote -v)
      git push -f origin "HEAD:pub-$branch_name"
      commit_msg_status="...构建完成，将发送【前端服务组】钉钉消息。"
    fi
    echo -e "$commit_msg_status"
  fi
}
export -f checked_git_status
exec ./build/build.sh