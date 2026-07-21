// const express = require("express");
// const {loggerServerRun} = require("./loggerServerRun");
// import express from 'express';

// import loggerServerRun from "./loggerServerRun.js";

// const app = express();

// app.listen(3000, loggerServerRun);

// const user = "Bohdan";
// import fs from "node:fs";

// fs.readFile("./src/text.txt", (error, data)=> {
//   console.log(error);
//   console.log(data);
// })
import {readFile, appendFile, writeFile, unlink} from "node:fs/promises";
import {join, resolve} from "node:path";
import DetectFileEncodingAndLanguage from "detect-file-encoding-and-language";

// readFile("./src/text.txt")
//   .then(data => console.log(data))
//   .catch(error => console.log(error));

// const filePath = join("src", "text.txt");
// const filePath = join(process.cwd(), "src", "text.txt");
const filePath = resolve("src", "text.txt");
const filePath2 = resolve("src", "text2.txt");
const filePath3 = resolve("src", "text3.txt");
// console.log(filePath)

// const buffer = await readFile(filePath);
// const text = buffer.toString();
// console.log(text);
// const text = await readFile(filePath, "utf-8");
// console.log(text);
// await appendFile(filePath, "\nPHP better");
// await writeFile(filePath, "Mojo forever");
// await appendFile(filePath2, "\nPHP better");
// await writeFile(filePath3, "Mojo forever");
// await unlink(filePath3);
const {encoding} = await DetectFileEncodingAndLanguage(filePath);
const text = await readFile(filePath, encoding);
console.log(text);
