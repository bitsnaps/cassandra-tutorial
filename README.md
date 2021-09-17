# Cassandra Example

## Quick intro to Cassandra
After install define a global variable: `CASSANDRA_HOME` pointing to `bin` directory, so you can use `nodetool` globally in your shell and other binaries files (cqlsh...)

Once setup run you'll need to run the `cassandra` daemon:
```
cassandra -f
```
Notes:
- The `-f` Start the cassandra process in foreground. The default is to start as background process.
- In linux machine (e.g. Ubuntu), you'll need to start the cassandra service like so: `sudo service cassandra start`

## KeySpace, Racks

- In order to store data, you'll need to create a `keyspace` which will be used to store data accross multiple nodes.
- Cassandra automatically replicates data to multiple nodes and across multiple data centers to create high fault tolerance, you can configure which racks (`rack1` by default) goes in which data center (`dc1` by default) in `$CASSANDRA_HOME/conf/cassandra-rackdc.properties ` configuration file:
```
...
dc=dc1
rack=rack1
...
```

## Cassandra Query Language & Shell
- Cassandra uses a special query language which very similar to SQL, except some differences (eg. no joins, filters are based on Primary keys columns, orders can only be done on Clustering keys, strict querying mechanism for filtering and sorting, some clauses have different SQL syntax... )
- You can use CASSANDRA Query Language shell tool by tying: `cqlsh` in the command line:
```
#> cqlsh
cqlsh> HELP
```
Here you can write CQL commands to be executed or you can type `exit` or `quit` to leave the cqlsh, write HELP to see the help page.
P.S. cqlsh need to have python 2 to be installed in your machine.

## Create a keyspace
```
cqlsh> CREATE KEYSPACE KeyspaceName WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 3} AND durable_writes = true;
```
Notes:
- Strategy defines the way data is stored on Data Center, usualy `SimpleStrategy` is used in a single data center and does not consider topology, whereas `NetworkTopologyStrategy` is used when you store data across multiple data centers.
- The `durable_writes` is optional, the default value is `true`, you can set it to `false` if you want to bypass the commit log when writing to the keyspace (CAUTION: Never disable durable writes when using SimpleStrategy replication).

## Alter a keyspace
```
ALTER KEYSPACE "KeySpace Name"  
WITH replication = {'class': 'Strategy name', 'replication_factor' : 'No.Of  replicas'};
```

## Delete a keyspace
```
DROP KEYSPACE KeyspaceName ;  
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

## Show tables
Show all tables in a keyspace:
```
USE KeyspaceName;
DESCRIBE TABLES;
```

## Alter table
Similar to RDBMS:
```
ALTER TABLE student ALTER student_name TYPE varchar;
ALTER TABLE student ADD state varchar;
ALTER TABLE student DROP student_fees;
```
P.S. You cannot re-add previously dropped column if the type of the new column is incompatible with previous type.

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
nodetool cleanup
```

## Compound (Composite) Keys
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

Notes:
- If you want to apply a filter (`where` clause) on a column, this one must be indexed or in a `PRIMARY KEY` or you should use append ` ALLOW FILTERING` to the search command (which is not recommended for performance reason).
- You can set, add or remove emails to the collection using the following command:
```
UPDATE emp SET emails = {'12344567890'} WHERE id = d3f50980-09d8-11ec-aafd-31a47b61278e;
UPDATE emp SET emails = emails + {'9876543210'} WHERE id = d3f50980-09d8-11ec-aafd-31a47b61278e;
UPDATE emp SET emails = emails - {'12344567890'} WHERE id = d3f50980-09d8-11ec-aafd-31a47b61278e;
```
You can make the collection empty using:
```
UPDATE emp SET emails = {} WHERE id = d3f50980-09d8-11ec-aafd-31a47b61278e;
```

## Partition keys, Clustering Keys
Primary Keys can be complicated to handle different complex situations when storing data in multiple nodes, here is an example of Clustering keys and partition key:
```
create table employee_by_car_and_model (
     car_make text,
     car_model text,
     user_id int,
     user_name text,
     PRIMARY KEY( (car_make, car_model), user_id )
 );
```
Here we call `(car_make, car_model)` the **Partition Key** (which is responsible for data distribution across your nodes), and `user_id` is a **Clustering Key** (which is responsible for data sorting within the partition), to find out checkout this answer at: [stackoverflow](https://stackoverflow.com/questions/24949676/difference-between-partition-key-composite-key-and-clustering-key-in-cassandra).

**CAUTION**: You might overwrite data when inserting new records using the same keys, example:
The second query will overwrite the `user_id` in the table:
```
INSERT INTO employee_by_car_and_model (car_make, car_model, user_name) VALUES ('BMW', 'Sport', 1);
INSERT INTO employee_by_car_and_model (car_make, car_model, user_name) VALUES ('BMW', 'Sport', 2);
```

## Insert collection:
You can use `set`, `list` or `map` as a data type, then you can insert data collection as an object like so:
```
INSERT INTO emp (id, first_name, last_name, empID, deptID, emails) VALUES (now(), 'Ali', 'Amine', 1, 1, {'ali.a@example.com', 'ali.amine@domaine.com'});
```
## Update data
Very similar to SQL:
```
UPDATE emp SET last_name = 'Karim' WHERE id = d3f50980-09d8-11ec-aafd-31a47b61278e and empID = 1 and deptID = 1;
```
You can set a `TTL` (or time to leave), for temporary data update:
```
UPDATE emp USING TTL = 60 SET last_name = 'Ali'  WHERE user_id = 2;
```
Here the modified values will revert back to the original values after 60 seconds.

## Deleting data
```
DELETE email, phone FROM users WHERE user_name = 'jsmith';
```

## Create INDEX
You can create an index as follows:
```
CREATE INDEX ON emp (first_name);
```
This allows you to perform a search on column `first_name` without specifying the primary key.
```
SELECT * FROM emp WHERE first_name='Ali';
```

## Consistency Level
You can configure the Consistency Level for the way cassandra store data, you can use any of these options:
- `any` which defines to tell cassandra to store records in any number nodes according to the `replication_factor`.
- `one`,`two`,`three` which forces a certain number of writes in order to consider a successful write operation.
- `quorum` is used when the majority of the nodes responds with successful write.
More values at the [doc](https://docs.datastax.com/en/cassandra-oss/3.x/cassandra/dml/dmlConfigConsistency.html).

To detect the current level of Consistency you can type in `cqlsh` the command:
```
cqlsh>CONSISTENCY
Current consistency level is ONE.
```
The consistency level `ONE` is the default value.
You can change the current value with this command:
```
cqlsh>CONSISTENCY ALL
Current consistency level is ALL.
```

## writetime function
You can use `writetime` function to get the timestamp of the writing record:
```
SELECT user_name, writetime(user_name) FROM employee_by_car_and_model;
```


## Counter && UUID
You can insert the value of `uuid()` function in `uuid` type, and
you can insert the value of `now()` function in `timeuuid` data type.
```
CREATE TABLE employee_by_uuid (id uuid PRIMRAY KEY, first_name text, last_name text);
INSERT INTO employee_by_uuid (id, first_name, last_name) VALUES (uuid(), 'Ali','Amine');

CREATE TABLE employee_by_timeuuid (id uuid PRIMRAY KEY, first_name text, last_name text);
INSERT INTO employee_by_timeuuid (id, first_name, last_name) VALUES (now(), 'Ali','Amine');
```
The `counter` data type is a integer which can only be incremented or decremented, it comes handy to count entities (e.g. nbr of customers...).
```
CREATE TABLE purchases_by_customer_id (id uuid PRIMRAY KEY, purchases counter);
UPDATE purchases_by_customer_id SET purchases = purchases + 1 WHERE id=uuid();
```

## Import & Export from/to CSV
In order to import the table should already be exists with at least one column, and primary column should be satisfied by the csv:
```
cqlsh> COPY empoyees_csv (car_make, car_model, id, first_name) FROM '/full/path/to/imported/csv' WITH DELIMITER=',' AND HEADER=true;
```
Export data can be done with a similar command with an extra possibility to export only select columns:
```
cqlsh> COPY empoyees_csv TO '/full/path/to/output/csv' WITH DELIMITER=',';
cqlsh> COPY empoyees_csv(id, first_name) TO '/full/path/to/output/csv' WITH DELIMITER=',';
```

## Materialized views
Materialized views are suited for high cardinality data. The data in a materialized view is arranged serially based on the view's primary key, and it's always created based on existing tables:
```
CREATE MATERIALIZED VIEW cyclist_by_age
  AS SELECT age, birthday, name, country
  FROM cyclist_mv
  WHERE age IS NOT NULL AND cid IS NOT NULL
  PRIMARY KEY (age, cid);
```
When the underlying data in the tables changes, the materialized views gets automatically updated.
```
SELECT age, name, birthday FROM cyclist_by_age WHERE age = 33;
```
Notes:
- The `WHERE` clause must include all primary key columns with the IS NOT NULL phrase so that only rows with data for all the primary key columns are copied to the materialized view.
- As with any table, the materialized view must specify the primary key columns. Because cyclist_mv, the source table, uses cid as its primary key, cid must be present in the materialized view's primary key.

# Snitches
A snitch determines which datacenters and racks nodes belong to, some possible values are:
- The **SimpleSnitch** (this is default value) is used only for single-datacenter deployments (not recommended for production).
- **PropertyFileSnitch** Determines the location of nodes by rack and datacenter.
- **GossipingPropertyFileSnitch** Automatically updates all nodes using gossip when adding new nodes and is recommended for production.
- **Dynamic snitching** Monitors the performance of reads from the various replicas and chooses the best replica based on this history.
You can configure Snitches at `$CASSANDRA_HOME/conf/cassandra.yml ` configuration file:
```
# You can use a custom Snitch by setting this to the full class name
# of the snitch, which will be assumed to be on your classpath.
endpoint_snitch: SimpleSnitch
```
