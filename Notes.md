Pipeline:

cf zones list --perPage=5 --fields=id --format=string | xargs -n1 -I % cf zones get %
cf zones list --zoneName=<zone1> <zone2> <zone 3> --fields=id | xargs -n1 -I % cf firewall list  %
