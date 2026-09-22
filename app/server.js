const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({
        message: "Welcome to Jenkins CI + ArgoCD GitOps App",
        status: "Running",
        version: "1.0.0"
    });
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(PORT, () => {
    console.log(`Application started on port ${PORT}`);
});