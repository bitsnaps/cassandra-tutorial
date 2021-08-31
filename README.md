# Cassandra Example

## Quick intro to Cassandra
After install define a global variable: `CASSANDRA_HOME` pointing to `bin` directory, so you can use `nodetool` globally in your shell and other binaries files (cqlsh...)

Once setup run you'll need to run the `cassandra` daemon:
```
cassandra -f
```
P.S. The `-f` Start the cassandra process in foreground. The default is to start as background process.

In order to store data, you'll need to create a `keyspace` which will be used to store data accross multiple nodes.

You can use CASSANDRA Query Language shell tool by tying: `cqlsh` in the command line:
```
#> cqlsh
cqlsh> HELP
```
Here you can write CQL commands to be executed or you can type `exit` or `quit` to leave the cqlsh, write HELP to see the help page.
P.S. cqlsh need to have python 2 to be installed in your machine.

## Create a keyspace
```
cqlsh> CREATE KEYSPACE tutorialspoint
WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 3};
```
P.S. Strategy defines the way data is stored on Data Center, usualy `SimpleStrategy` is used in a single data center and does not consider topology, whereas `NetworkTopologyStrategy` is used when you store data across multiple data centers.

## Alter a keyspace
```
ALTER KEYSPACE "KeySpace Name"  
WITH replication = {'class': 'Strategy name', 'replication_factor' : 'No.Of  replicas'};
```

## Delete a keyspace
```
DROP  keyspace KeyspaceName ;  
```
Verify your keyspace:
```
DESCRIBE keyspaces;
```

## Create a table
You can create a table just in a very similar way to RDBMS:
```
CREATE TABLE student (
   student_id int PRIMARY KEY,
   student_name text,
   student_city text,
   student_fees varint,
   student_phone varint
);
```
## Data Types:
You can use either a simple data types:

Numbers: int, decimal, double, float, timestamp, varint, bigint, counter
Strings: varchar, text, ascii, inet, timestamp
uuids: uuid, timeuuid
booleans: Boolean
blob: blob

You can also use one of collection (`set<>`, `list<>`, `map<>`) data type, or you can also create their own custom data types using `CREATE TYPE` clause.

## Alter table
Similar to RDBMS:
```
ALTER TABLE student ALTER student_name TYPE varchar;
ALTER TABLE student ADD state varchar;
ALTER TABLE student DROP student_fees;
```

## Insert data
```
INSERT INTO products (id, name, price) VALUES (1, 'p1', 5.1);
```
Notes:
- If column exists, it is updated
- You can qualify table names by KeySpace.

## Check & Verify
Check to make sure all clusters are working correctly:
```
nodetool status
```

## Cleanup
Cleans up keyspaces and partition keys no longer belonging to a node.
```
nodetool cleaup
```

## Compound Keys
You must have a Compound keys in order to perform sort/filter operations on large dataset:
```
CREATE TABLE emp (
  id uuid,
  empID int,
  deptID int,
  first_name varchar,
  last_name varchar,
  emails set<varchar>,
  PRIMARY KEY (id, empID, deptID)
);
```
Compound key is `(empID, deptID)`.
if you want to apply a filter (`where` clause) on a column, this one must be indexed or in a `PRIMARY KEY`.

## Insert collection:
You can use `set`, `list` or `map` as a data type, then you can insert data collection as an object like so:
```
INSERT INTO emp (id, first_name, last_name, empID, deptID, emails) VALUES (now(), 'Ali', 'Amine', 1, 1, {'ali.a@example.com', 'ali.amine@domaine.com'});
```
## Update data
Just like RDBMS
```
UPDATE emp SET last_name = 'Karim' WHERE id = d3f50980-09d8-11ec-aafd-31a47b61278e and empID = 1 and deptID = 1;
```

## Deleting data
```
DELETE email, phone FROM users WHERE user_name = 'jsmith';
```
