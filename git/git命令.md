## 初始化git
1. 设置用户名
	- git config --global user.name "nickwilling"
2. 设用户名邮箱
	- git config --global user.email "why1234me@163.com
3. 查看设置
	- git config --list
### 初始化创建git仓库（把文件变成git仓库）
- git init
## 本地git的三个区域

### Working Directory(工作区) 
git add [文件名]: 将工作区的文件添加到缓存区

### Stage（暂存区）
git commit -m "提交描述"：将暂存区的文件提交到仓库

### Git Repository（Git仓库）

- git status 查看文件的状态

## 将本地仓库同步到远程仓库（github Repository）
- git push -u origin master（第一次上传）
- git push（以后上传）

### git branch -a
查看所有分支（包括本地分支和远程分支）
### git remote -v
查看远程分支

### git pull --rebase origin master

## Github上创建的Git仓库与本地仓库关联
- git remote add origin https://github.com/Jay778/Night.git

##  git branch --set-upstream-to=origin/<branch> master

If you wish to set tracking information for this branch you can do so with:


## 远程仓库更改，本地仓库保持更新
- git pull origin master

 

```shell
echo "# Document" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin git@github.com:nickwilling/Document.git
git push -u origin master
```

