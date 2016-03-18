/**
 * Icon Cleaner
 * Description: Moves attribution details from icons to a separate file and makes the icon usable in applications
 * URL: www.github.com/rashanjibowu/icon_cleaner
 * Copyright 2016 Rashan Jibowu
 * License: MIT
 */

// Require necessary modules
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

// set the directory and paths
var directory = "icons/";
var attributionPath = "attribution.txt";

if (process.argv[2]) {
    directory = process.argv[2] + "/" + directory;
    attributionPath = process.argv[2] + "/" + attributionPath;
}

// set up variables
var preserveAspectRatio = 'preserveAspectRatio="xMidYMid meet"';
var viewBox = 'viewBox="0 0 100 100"';

// create the attribution file
var attribution = '';

// out path directory
var out = directory + "dist/";

// create the directory structure
mkdirp.sync(out);

fs.access(out, fs.R_OK | fs.W_OK, function(error) {
    if (error) {
        console.error(error);
        return;
    }

    console.log("%s was created!", out);
});

// Read in the contents
var files = fs.readdirSync(directory);

if (!files || files.length === 0) {
    console.error("No files found!");
    return;
}

// consider only SVG files
var svgFiles = files.filter(function(file) {
    return path.extname(file) === ".svg";
});

// set up regular expressions
var svgRE = /<svg/ig;
var viewBoxRE = /viewBox=".+?"/i;
var parRE = /preserveAspectRatio=".+?"/i;
var textRegex = /<text.*?>(.*?)<\/text>/ig;

console.log("We found %d SVG files", svgFiles.length);

// for each file, pull out the attribution detail, write it to a file, and clean up the image
svgFiles.forEach(function(file) {

    // construct file paths
    var fileName = directory + file;
    var newFileName = out + file;

    var fileContent = fs.readFileSync(fileName, "utf-8");

    if (!fileContent) {
        console.error("Unable to read the file: %s", file);
        return;
    }

    var newFile = '';
    var attributionNote = '';

    // find all text attributes
    // Assumes that attribution details appear in text elements
    // Assumes that all text elements contain attribution details
    var match;

    // initialize array of "edit points" to reconstruct the file later
    var editPoints = [];

    var lowY = 99999;

    var yRE = /y="([\d]+?)"/i;

    // find each match
    while ((match = textRegex.exec(fileContent)) !== null) {

        attributionNote += match[1] + " ";
        yMatches = match[0].match(yRE);

        if (yMatches) {
            if (parseInt(yMatches[1]) < lowY) {
                lowY = parseInt(yMatches[1]);
            }
        }

        // calculate length of match so we know the portions of the string to remove
        var matchLength = match[0].length;

        // Identify the sections of the string to remove
        editPoints.push({
            from: textRegex.lastIndex - matchLength,
            to: textRegex.lastIndex - 1,
        });
    }

    // add the attribution details to the main file
    if (attributionNote === '') {
        attributionNote = file + ": No attribution detail";
    } else {
        attributionNote = file + ": " + attributionNote.trim();
    }

    attributionNote += '\n';
    attribution += attributionNote;

    var startPos = 0;

    // construct new file with removed text elements
    editPoints.forEach(function(point) {
        newFile += fileContent.substr(startPos, point.from - startPos);
        startPos = point.to + 1;
    });

    // add the rest of the file
    newFile += fileContent.substr(startPos);

    // if the viewBox doesn't exist, create it
    // if it does exist, update it!
    if (viewBoxRE.test(newFile)) {
        var heightRE = /viewBox="([\d]+)\s([\d]+)\s([\d]+)\s([\d]+)"/i;
        var dims = newFile.match(heightRE);
        var newHeight = (lowY == 99999) ? dims[4] : lowY - 15;
        var vb = 'viewBox="' + dims[1] + ' ' + dims[2] + ' ' + dims[3] + ' ' + newHeight + '"';
        newFile = newFile.replace(viewBoxRE, vb);
    } else {
        newFile = newFile.replace(svgRE, '<svg ' + viewBox);
    }

    // if the preserveAspectRatio attribute exists, set it properly, otherwise create it
    if (parRE.test(newFile)) {
        newFile = newFile.replace(parRE, preserveAspectRatio);
    } else {
        newFile = newFile.replace(svgRE, '<svg ' + preserveAspectRatio);
    }

    // directory now exists, create the file
    fs.writeFile(newFileName, newFile, "utf-8", function(writeError) {
        if (writeError) {
            console.error("Unable to write %s", newFileName);
            return;
        }

        console.log("%s has been written!", newFileName);
    });
}); 

// Write the attribution details to a file
fs.writeFile(attributionPath, attribution, "utf-8", function(writeError) {
    if (writeError) {
        console.error("Unable to write attribution details");
        return;
    }

    console.log("The attribution details are available: %s", attributionPath);
});

