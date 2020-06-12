Pipeline:

cf zones list --perPage=5 --fields=id --format=string | xargs -n1 -I % cf zones get %
cf zones list --zoneName=<zone1> <zone2> <zone3> --fields=id | xargs -n1 -I % cf firewall list  %

## Account:

### Get
cf account list

### List
cf accounts get <accountId> --fields=id,name
cf accounts get <accountId>

## DNS:

### Create
cf zones create <zoneName> --accountId=<accountId>
Note: Get account ID from user command

### Delete
cf dns delete <zoneName> <record>

### Export
cf dns export <zone> --output /path/to/file

### Get
cf dns get <zone> <record>
cf dns get <zoneName> <record> --fields=type,name
cf dns get <zoneName> <record> --fields=type,name,content --format=json

### Import
cf dns import <zone> --inputFile /path/to/file

### List
cf dns list <zoneId>
cf dns list <zoneName>
cf dns list <zoneName> --name=sub1.example.com --fields=id
cf dns list <zoneName> --type=A
cf dns list <zoneName> --type=CNAME

## Firewall:

### Create
cf firewall create <zone> --action=allow --expression=<expression> --description=<description>
cf firewall create <zone> --action=block --filterId=<filterId> --description=<description>

### Delete
cf firewall delete <zoneName> <firewallId>

### Get
cf firewall get <zoneName> <firewallId> --fields=id

### List
cf firewall list <zone>
cf firewall list <zone> --description=<description>

## Filters:

### Delete
cf filters delete <zone> <filterId>

### Get
cf filters get <zone> <filterId>
cf filters get <zone> <filterId> --fields=id

### List
cf filters list <zone>

### List
cf filters update <zone> <filterId> --paused=false
cf filters update <zone> <filterId> --expression=<expression>
cf filters update <zone> <filterId> --paused=false

## User:

### Get
cf user get

### Get Organization
cf user organizations

## Zones:

### Create
cf zones create <zoneName> --accountId=<accountId>
Note: Get account ID from user command

### Delete
cf zones delete <zoneName>

### Get
cf zones get <zoneID>
cf zones get <zoneName>
cf zones get <zoneName> --fields=name_servers
cf zones get <zoneName> --fields=name_servers --format=json

### List
cf zones list <zone1>
cf zones list --zoneName=<zone1>
cf zones list --zoneName=<zone1> <zone2>
cf zones list --zoneName=<zone1> <zone2> --fields=id
cf zones list --zoneName=<zone1> <zone2> --fields=id | xargs -n1 -I % cf zones get %
cf zones list --zoneName=<zone1> <zone2> --fields=id | xargs -n1 -I % cf firewall list  %

### Purge
cf zones purge <zone> --all=true
cf zones purge <zone> --hosts subdomain1 subdomdain2
cf zones purge <zone> --tags tag1 tag2 tag3
cf zones purge <zone> --files file1 file2 file3

### Settings:

#### Minify
cf zones settings minify <zone> --value {\"css\":\"on\", \"html\":\"on\", \"js\":\"on\"}
cf zones settings minify <zone>

#### Development Mode
cf zones settings devmode <zone> --value=off
cf zones settings devmode <zone>
