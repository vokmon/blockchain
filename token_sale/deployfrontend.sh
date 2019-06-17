rm -rf docs/*
cp -r src/* docs/
cp build/contracts/* docs/
git add .
git commit -m "Compile assets for github"
git push
