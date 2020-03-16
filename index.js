const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const convertFactory = require('electron-html-to');
const generateHTML = require('./generateHTML');

// prompt user for github username and favorite color
inquirer.prompt([
    {
        type: "input",
        name: "username",
        message: "What is your Github username?"
    },
    {
        type: "list",
        message: "What is your favorite color?",
        name: "color",
        choices: [
            "red",
            "blue",
            "green"
        ]
    }
]).then(function (data) {
    // include username to the github api url
    const queryURL = `http://api.github.com/users/${data.username}`;
    axios.get(queryURL)
    .then(function (res) {
        // Create an HTML page using the template below and data the user input
        var html = generateHTML(res.data,  data.color)
        const conversion = convertFactory({
            converterPath: convertFactory.converters.PDF
          });
        // Convert the html to pdf
          conversion({ html: html, pdf: {
            printBackground: true,
          }}, function(err, result) {
            if (err) {
              return console.error(err);
            }
        
            console.log(result.numberOfPages);
            console.log(result.logs);
            // Write the pdf with current directory
            result.stream.pipe(fs.createWriteStream(path.join(__dirname, "profile.pdf")));
            conversion.kill(); 
          });
    })
})
