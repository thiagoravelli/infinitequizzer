// apiHandler.js

function validateThemeWithGPT(themeInput) {
    console.log('Sending validateTheme request with:', themeInput);
    return fetch('/api/validateTheme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themeInput })
    })
    .then(response => response.json())
    .then(data => data.isValid);
}

function generateQuestionWithGPT(theme, difficulty) {
    return fetch('/api/generateQuestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: theme, difficulty: difficulty })
    })
    .then(response => response.json())
    .then(data => data.questionData);
}
