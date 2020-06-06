Pipeline:

cf zones list --perPage=5 --fields=id --format=string | xargs -n1 -I % cf zones get %
