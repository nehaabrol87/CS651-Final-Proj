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

  # Run actual app
  gulp dev-proxy

  
  Open a browser window at http://localhost:8080
