#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { summarizeText } = require("./src/lib/tfidf-summarizer");

function printUsage() {
  console.log("Usage: node summarize-tfidf.js <input-file> [sentence-count]");
}

function main() {
  const [, , inputFile, sentenceCountArg] = process.argv;

  if (!inputFile) {
    printUsage();
    process.exit(1);
  }

  const filePath = path.resolve(process.cwd(), inputFile);
  const sentenceCount = Number.parseInt(sentenceCountArg || "3", 10);

  if (Number.isNaN(sentenceCount) || sentenceCount < 1) {
    console.error("Sentence count must be a positive integer.");
    process.exit(1);
  }

  let text;
  try {
    text = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error(`Could not read file: ${filePath}`);
    console.error(error.message);
    process.exit(1);
  }

  const summary = summarizeText(text, sentenceCount);

  if (!summary.extractedSentences.length) {
    console.log("No summary could be generated.");
    return;
  }

  console.log(summary.summary);
}

main();
