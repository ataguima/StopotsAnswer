// ==UserScript==
// @name         Your Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Script description
// @match        https://stopots.com/*
// @grant        GM_xmlhttpRequest
// @connect      generativelanguage.googleapis.com
// ==/UserScript==

(function() {
    'use strict';

    function waitForAnswerContainer() {
        return new Promise((resolve, reject) => {
            const observer = new MutationObserver((mutations, obs) => {
                const container = document.querySelector("div.ct.answers");
                if (container) {
                    obs.disconnect();
                    resolve(container);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    function getAnswerFromGemini(category, letter) {
        return new Promise((resolve, reject) => {
            const apiKey = 'YOUR_API_KEY_HERE';
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    model: "gemini-2.0-flash",
                    contents: [
                        {
                            role: "user",
                            parts: [
                                { text: `I am playing Stopots. The category is "${category}" and the letter is "${letter}". Provide only one English word that fits the category and starts with the given letter. Do not provide explanations, just the word.` }
                            ]
                        }
                    ]
                }),
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data?.candidates?.[0]?.content) {
                                const candidate = data.candidates[0].content;
                                const text = candidate.parts?.[0]?.text;
                                resolve(text ? text.trim() : "");
                            } else {
                                reject("No response from API.");
                            }
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(new Error("Gemini API error: " + response.status));
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    async function fillFields(letter) {
        const labels = document.querySelectorAll("div.ct.answers label");
        for (const label of labels) {
            const span = label.querySelector("span");
            if (!span) continue;
            const category = span.textContent.trim();
            const input = label.querySelector("input");
            if (!input) continue;
            try {
                const answer = await getAnswerFromGemini(category, letter);
                input.focus();
                const success = document.execCommand('insertText', false, answer);
                if (!success) {
                    input.value = answer;
                }
                input.dispatchEvent(new Event('input', { bubbles: true }));
            } catch (err) {
                console.error(`Error for "${category}":`, err);
            }
        }
    }

    function autoSubmit() {
        const submitButton = document.querySelector("div.ct.answers button.bt-yellow");
        if (submitButton) {
            submitButton.click();
        } else {
            console.error("Submit button not found.");
        }
    }

    async function main() {
        try {
            await waitForAnswerContainer();
            const letterElement = document.querySelector("#letter span");
            if (!letterElement) {
                console.error("Letter element not found.");
                return;
            }
            const letter = letterElement.textContent.trim().toUpperCase();
            await fillFields(letter);
            // autoSubmit(); // Uncomment for auto submission.
        } catch (e) {
            console.error("Script error:", e);
        }
    }

    main();
})();
