# 

## Tools / Frameworks Used
 - Angular 1.4.0-rc.1
 - TypeScript 1.5.0-alpha
 - Angular2 Router / UI-Router 
 - Gulp
 - Jspm for package management (Node modules are only used for gulp plugins)
 - Express.js - Used as a development server with proxy

## Getting started
 
 Assuming you already have NodeJS and npm installed...
 
  ```bash
  # Install gulp, jspm globally
  npm install gulp jspm tsd -g
  
  # cd into the project root and install node dependencies
  npm install
  
  # then install jspm dependencies
  jspm install
  
  # then install type definitions
  tsd reinstall or tsd install whichever works 

  #Running first time (To generate System.Js files and dist files)
  gulp build

  # Run actual app
  gulp dev-proxy

  
  Open a browser window at http://localhost:8080

  #WCF Service

  Is the Web Service for fetching data from database (Healthy humans) and serving the website.

  a)It has "Allow cross origin requests so if it is hosted on IIS (localhost) and website is run on localhost:8080 it can cater requests"

  #Database Healthy Humans
  SQL DB with following tables
  When you are restoring the DB. You might face access issues.
  Make sure you right click the Default Application Pool in (Security ---> Logins)
  and make sure User Mapping for Healthy Humans has db_owner checkboxed

  a)Users (User related information)
