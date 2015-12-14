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

  #App(Client side)
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

  
  Open a browser window at http://localhost:8080/#/

  #WCFService(Server Side)

  Is the Web Service for fetching data from database (Healthy humans) and serving the website.

  a)Host the webservice on IIS : http://localhost/finalservice/Service.svc/
   (Better to keep same name so that you do not have to change reference in services folder for each service)

  b)It has "Allow cross origin requests so if it is hosted on IIS (localhost) and website is run on localhost:8080 it can cater requests".Global asax and Web Config are important files


  #Web Application Service(Server Side)

  Is the Web Service for sending emails daily to users at 9am

  a)Installing/Starting the service 
  (InstallUtil /i E:\CS651-Final-Proj\WindowsServiceToSendMails\WindowsServiceToSendMails\bin\Debug\WindowsServiceToSendMails.exe)
  b)Reference
    http://www.aspsnippets.com/Articles/Simple-Windows-Service-that-runs-periodically-and-once-a-day-at-specific-time-using-C-and-VBNet.aspx


  #Database Healthy Humans
  SQL DB with following tables
  When you are restoring the DB. You might face access issues.
  Make sure you right click the Default Application Pool in (Security ---> Logins)
  and make sure User Mapping for Healthy Humans has db_owner checkboxed

  a)Users (User related information)
   
   UserName :nehaabro@bu.edu
   Password :a