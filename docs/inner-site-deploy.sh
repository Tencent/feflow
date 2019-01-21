./node_modules/.bin/hexo clean
./node_modules/.bin/hexo generate
scp -r ./public root@10.125.54.125:/data/sites/feflow-inner-site
