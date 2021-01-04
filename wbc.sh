check=git branch | grep website
if [ -z '' ]
then
  echo 'Website branch does not exist, creating now'
  git checkout -b website
  git push --set-upstream origin website
else
  echo 'Website branch exists'
if [ -z '$check' ]
