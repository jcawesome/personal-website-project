const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const PROJECTS = require('./projects');
const PROJECTS_FS = require('./projects-fullstack');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

// Configure mustache
app.set('views', `${__dirname}/pages`);
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

// Render the template
app.get('/', (req, res) => {
    res.render('index', { projects: PROJECTS});
})

app.get('/', (req, res) => {
    res.render('index', { projectsFS: PROJECTS_FS});
})  

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on https://localhost:${port}`)
})