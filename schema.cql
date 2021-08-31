-- Create Schema

CREATE KEYSPACE shoutapp WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 3};

USE shoutapp;
CREATE TABLE users(username text PRIMARY KEY, password text, email text, name text);

USE shoutapp;
DESCRIBE TABLE users;

USE shoutapp;
CREATE TABLE following(username text PRIMARY KEY, followed text);

USE shoutapp;
CREATE TABLE followers(username text PRIMARY KEY, following text);

USE shoutapp;
CREATE TABLE shouts(shout_id uuid PRIMARY KEY, username text, body text);

USE shoutapp;
CREATE TABLE usershouts(username text, shout_id timeuuid, body text, PRIMARY KEY(username, shout_id) );

USE shoutapp;
CREATE TABLE shoutwall(username text, shout_id timeuuid, posted_by text, body text, PRIMARY KEY(username, shout_id) );

-- Inserting data (example)
-- USE shoutapp;
-- INSERT INTO shouts (shout_id, username, body) VALUES (now(), 'Ibrahim.H', 'This is my first shout');
-- SELECT * FROM shouts;

-- Deleting data (example)
--DELETE FROM shouts WHERE shout_id = 511a9460-0a84-11ec-9c31-e74530ab96d3;

-- Inserting data (using batch statments)
BEGIN BATCH
INSERT INTO shouts(shout_id, username, body) VALUES (now(), 'devuser2', 'This is a test shout')
INSERT INTO usershouts(username, shout_id, body) VALUES ('devuser2', now(), 'This is a test shout')
INSERT INTO shoutwall (username, shout_id, posted_by, body) VALUES ('devuser2', now(), 'devuser2', 'This is a test shout')
APPLY BATCH;

-- Simple queries
SELECT * FROM users;
SELECT * FROM shouts;
SELECT * FROM shoutwall;
SELECT * FROM usershouts WHERE username = 'devuser2';

-- Complex query
SELECT dateOf(shout_id), body FROM usershouts WHERE username = 'devuser2' AND shout_id > minTimeuuid('2020-01-01') ORDER BY shout_id DESC;

INSERT INTO users (username, email, name, password) VALUES ('devuser1', 'devuser1@yahoo.com', 'John Doe', 'password1');

-- Alter a table
/*ALTER TABLE users ADD age int;
UPDATE users SET age = 33 WHERE username = 'devuser1';
ALTER TABLE users DROP age;
*/

-- Create an Index
CREATE INDEX ON users(name);
SELECT * FROM users WHERE name = 'John Doe';

-- Perform LIKE search by creating prefix index on Clustering Key (should be used with caution)
CREATE CUSTOM INDEX  fn_prefix ON users (name) USING 'org.apache.cassandra.index.sasi.SASIIndex';
SELECT * FROM users WHERE name LIKE 'John%';

