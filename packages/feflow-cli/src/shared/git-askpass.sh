#!/bin/sh
# git-askpass.sh — feflow 安全凭证助手
# 通过环境变量传递 Git 认证凭证，避免凭证出现在 URL 或命令行参数中
case "$1" in
  Username*) echo "${FEFLOW_GIT_USERNAME}" ;;
  Password*) echo "${FEFLOW_GIT_PASSWORD}" ;;
esac
