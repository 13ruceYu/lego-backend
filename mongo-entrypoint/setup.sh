#!/bin/bash

# shell 脚本中发生错误，即命令返回值不等于 0，则停止执行并推出 shell
set -e

mongosh <<EOF
use admin
db.auth({'$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD'})
use lego
db.createUser({
  user: '$MONGO_DB_USERNAME',
  pwd: '$MONGO_DB_PASSWORD',
  roles: [{
    role: 'readWrite',
    db: 'lego'
  }]
})
db.createCollection('works')
db.works.insertMany([
  {
    id: 19,
    title: 'title-1',
    isTemplate: true
  }
])
EOF