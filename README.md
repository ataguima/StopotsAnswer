# StopotsAnswer

A Tampermonkey userscript for automatically filling answers on Stopots using the Gemini API.

## Description
This script waits for the answer container to load on [Stopots](https://stopots.com/), retrieves a single Portuguese word based on the given category and letter, and fills the input fields automatically. It also supports an optional auto-submit feature.

## Features
- Detects the answer container dynamically.
- Requests answers from the Gemini API.
- Fills the game fields with the received answer.
- Optionally auto-submits the form.

## Installation
1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. Create a new script and paste the provided code.
3. Replace `YOUR_API_KEY_HERE` with your actual Gemini API key.
4. Save and enable the script.

## Usage
- Visit [Stopots](https://stopots.com/).
- The script will automatically detect the game interface.
- Answers will be filled in based on the current letter and category.
- Uncomment the `autoSubmit()` call in the code if you want the script to submit the answers automatically.

## License
MIT License
