# AI Text Summarizer

This project is a web application that generates short summaries from long text using a TF-IDF based approach. It focuses on simplicity, speed, and clear implementation.

## Features

* Summarizes long text input
* Uses TF-IDF for sentence ranking
* Simple and responsive interface
* API-based processing

## Tech Stack

* Next.js
* React
* Tailwind CSS
* JavaScript

## Project Structure

```
src/
 ├── app/
 │   ├── api/summarize/route.js
 │   ├── summarizer/page.js
 │
 ├── components/
 │   └── summarizer-app.jsx
 │
 ├── lib/
 │   └── tfidf-summarizer.js
```

## How It Works

1. User enters text
2. Text is sent to the backend
3. TF-IDF is applied to score sentences
4. Important sentences are selected
5. Summary is returned

## Setup

Clone the repository:

```
git clone https://github.com/Divyashree-Kumar/DIgital_Heroes.git
```

Install dependencies:

```
npm install
```

Run the project:

```
npm run dev
```

## Future Work

* Add advanced NLP models
* Support multiple languages
* Add file upload support

## Contact

Divya Shree
