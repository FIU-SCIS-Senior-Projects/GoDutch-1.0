# GoDutch

GoDutch 1.0 is a web application that assists a group of travellers with the distribution of payments that happen during their trip. It firstly computes the share a user needs to pay individually for their trip based on their own purchase and consumption activities. Then it generates a list of transactions among the participants, so that each user can end up paying their part by following the list, while the total number of transactions within the group is minimized. GoDutch can be found very helpful for different kinds of trip groups, especially those where multiple purchasers each pays for a subgroup of participants, i.e. payments cannot be simply evenly divided.

# Code Structure

The GoDutch source code is contained in public folder and server folder for frontend and backend assests, respectively.
  /public
    /html
    /js
      /controller
      /model
      /service
    /less
  /server
    /config
    /controllers
    /models
    /routes
    /services
GoDutch uses Gulp.js to pipe the source code to generate the distributable folder dist:
  /dist
    /public
      /css
      /html
      /js
        app.js
      index.html
When we run "node server", the server.js file will look for index.html and app.js in dist folder to host the site.

# Installation Guide

Installation

For this application the software that was used was NodeJS, MongoDB, and GitHub. In the next sections there will be a tutorial on how to install each of the essential software and Windows, Mac, and Linux.

Windows
We will begin by installing GitHub for windows because it is required to use both NodeJS and  MongoDB.

Begin by installing GitHub for windows from the official github site https://desktop.github.com/. After you have installed it use Windows PowerShell, which can be accessed by pressing the Windows key or Windows search bar and typing PowerShell.

To ensure it installed correctly open up PowerShell and type git.

Now we are going to install NodeJS. Download the NodeJS installer from the official NodeJS site https://nodejs.org/en/ and download the build which is recommended for most users. 

After downloading the installer, run the installer and keep all the default settings it suggest. NodeJS will require a restart to complete its installation.

Once the computer is restarted, open PowerShell and type node -v followed by npm -v. If both of these return without error than NodeJS has successfully been installed on the computer.

Finally we are going to install MongoDB. Download the MongoDB installer from the official site https://www.mongodb.com/download-center#community any community server version will work.

Once MongoDB is installed, open PowerShell and move to where MongoDB was installed
When you open powershell the default directory is C:\Users\Username
Change directory back twice, type cd .. twice
Create a directory called data, and then a directory called db by typing mkdir ‘data\db’
Now change directory in Program Files, cd ‘Program Files’
Change directory into MongoDB’s bin folder, cd ‘MongoDB\Server\<server version>\bin’
Execute ‘mongodb --install --logpath=”C:\data\db\log.txt” dbpath=”C:\data\db” ‘ in the directory
Once you have executed in this manner, the next time you want to start the MongoDB server all you will need to type is net start mongodb, of course if this doesn’t work you could always start mongodb using the final step but only typing mongod.exe

Now you have all the required software for this project.

Mac
We will begin by installing GitHub for windows because it is required to use both NodeJS and  MongoDB.

Before beginning we will need to install XCode which can be found in the App store. After you have installed XCode, open up the terminal and type in 

/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

This will install Homebrew to your terminal.


Begin by installing GitHub for Mac from the official github site https://desktop.github.com/. After you have installed it open the application and click on the advance tab>Install Command Line Tools.

To ensure it installed correctly open up the terminal and type git, it should return options

Now we are going to install NodeJS. Simply type brew install node. Type node -v followed by npm -v. If both of these return without error than NodeJS has successfully been installed on the computer.

Finally we are going to install MongoDB. Simply type brew install mongodb. You will need to create a /data/db folder in your default directory, do this by typing mkdir ~/data/db. You will also need to give mongodb permission to use this folder, do so by typing sudo chown -R `id -un` /data/db. Your terminal will prompt you for your password.

To ensure MongoDB is install type mongod, to keep the server on type mongod &.

Now you have all the required software for this project.

Linux
We will begin by installing GitHub for windows because it is required to use both NodeJS and  MongoDB. Open up the terminal on ubuntu and do the following:

To install GitHub type sudo apt-get install git

To install NodeJS type 
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential

To install MongoDB type
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
(this will install the mongo directory)
sudo apt-get update

sudo apt-get install -y mongodb-org

Now you have all the required software for this project.

Installing GoDutch

Go to your terminal (Powershell, Mac shell, etc.) and clone our repository:
Git clone https://github.com/FIU-SCIS-Senior-Projects/GoDutch-1.0

Next execute npm install or npm update, this will install the dependencies from the package.json file. If you wish to install any new add-ons/libraries type npm install <library> --save and it will automatically be saved into package.json.

You will need to set up a config.js file in the server/config/ directory before you can run this application. The config.js file should look like this (Figure 18).

You will also need to execute npm install gulp -g to install the gulp command globally.

Under server/config/ create a file named config.js that has the following content:
//setup for mongoDB
var config = {
    port: 27017,
    db: 'mongodb://localhost/default',//replace default for db name
    host: '<computer name>:8080',
    jwtSecret: 'devSechsecret',
    sessionSecret: 'devSech',
    expire: 60*60*24*60
};
module.exports = config;
Note: Replace <computer name> with the DNS name for the server (if you are testing in a LAN, you can use your own computer name instead). 

Now open three terminals, one to run the node server, one to run the gulp server, and finally one to run the mongo server.

In the first terminal type gulp quick. This is a setting that is written in the gulp file in the repository. Gulp will watch the server files for any changes to front-end code.

In the second terminal type mongod and leave the server running.

In the third terminal type node server, the server will begin on localhost:8080, if you go to http://localhost:8080 you will find the webpage. 

# User Manual

For detailed user manual, please refer to the final documentation under Documents folder.
