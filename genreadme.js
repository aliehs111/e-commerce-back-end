const inquirer = require("inquirer");
const fs = require("fs");
const generateMarkdown = require("./genmarkdown.js");
// TODO: Create an array of questions for user input
const questions = [
    {
        type: "input",
        message: "What is your project title?",
        name: "title"
    }, {
        type: "input",
        message: "What is your project description?",
        name: "description"
    }, {
        type: "input",
        message: "What is your project installation instructions?",
        name: "installation"
    }, {
        type: "input",
        message: "What is your project usage information?",
        name: "usage"
    }, {
        type: "input",
        message: "Please list any contributors or resources you'd like to credit?",
        name: "contribution"
    }, {
        type: "input",
        message: "What is your project test instructions?",
        name: "test"
    }, {
        type: "input",
        message: "What is your project email address?",
        name: "email"
    }, {
        type: "input",
        message: "What is your project github username?",
        name: "github"
    }, {
        type: "input",
        message: "What is the link to your deployed app?",
        name: "link"
    }, {
        type: "list",
        message: "What is your project license?",
        name: "license",
        choices: ["MIT", "Apache", "GNU", "None"]
    }
];

// TODO: Create a function to write README file
function writeToFile(fileName, data) {
    fs.writeFile(fileName, generateMarkdown(data), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Successfully wrote to README.md");
    });
}

// TODO: Create a function to initialize app
function init() {
    inquirer.prompt(questions).then(function (data) {
        console.log(data);
        writeToFile("README.md", data);
        console.log("Successfully wrote to README.md");
    });
}

// Function call to initialize app
init();
