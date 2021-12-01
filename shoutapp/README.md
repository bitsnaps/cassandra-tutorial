# Cassandra ShoutApp

A simple ExpressJS demo app using cassandra database driver.

We'll use `express-generator` to quickly create a new app:
```
sudo npm install express-generator -g
```

Generate a new app:
```
express shoutapp
cd shoutapp
```

Install required packages:
```
npm install cassandra-driver --save
npm install time-uuid --save
npm install
npm audit fix --force
```
Run the app at port `http://localhost:3000` using:
```
run start
```
