// backend/server.js

require('dotenv').config(); // This must be at the top

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use('/images', express.static('images')); 
const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => { // Listen on 0.0.0.0
    console.log(`Server is running on port: ${port}`);
});

// Middleware
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
// IMPORTANT: Replace <YOUR_MONGODB_URI> with your actual MongoDB connection string.
// You can get a free one from MongoDB Atlas.
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));


// --- Mongoose Schemas & Models ---
const aboutSchema = new mongoose.Schema({
    name: String,
    education: [String],
    profilePicUrl: String,
    skills: [{
        name: String,
        iconClass: String // e.g., 'fab fa-html5'
    }]
});

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageUrl: String,
    githubLink: String,
    deployedLink: String
});

const About = mongoose.model('About', aboutSchema);
const Project = mongoose.model('Project', projectSchema);


// --- API Routes ---
// GET About Information
app.get('/api/about', async (req, res) => {
    try {
        const aboutInfo = await About.findOne(); // We only have one 'about' document
        res.json(aboutInfo);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching about info', error });
    }
});
// POST a new 'About' document
app.post('/api/about', async (req, res) => {
    // This check prevents creating more than one 'about' document
    const existingAbout = await About.findOne();
    if (existingAbout) {
        return res.status(400).json({ message: 'About document already exists. Use PUT to update.' });
    }

    const aboutInfo = new About({
        name: req.body.name,
        education: req.body.education,
        profilePicUrl: req.body.profilePicUrl,
        skills: req.body.skills
    });

    try {
        const savedAbout = await aboutInfo.save();
        res.status(201).json(savedAbout);
    } catch (error) {
        res.status(400).json({ message: 'Error creating about document', error });
    }
});
// GET All Projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error });
    }
});

// UPDATE a project by its ID
app.put('/api/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id;
        const updatedData = req.body;

        // Find the project by its ID and update it with the new data
        // { new: true } ensures the updated document is returned
        const updatedProject = await Project.findByIdAndUpdate(projectId, updatedData, { new: true });

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project updated successfully!', updatedProject });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a project by its ID
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id;
        const deletedProject = await Project.findByIdAndDelete(projectId);

        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully', deletedProject });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// POST a new project (for backend management)
app.post('/api/projects', async (req, res) => {
    const { title, description, imageUrl, githubLink, deployedLink } = req.body;

    const newProject = new Project({
        title,
        description,
        imageUrl,
        githubLink,
        deployedLink
    });

    try {
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(400).json({ message: 'Error adding project', error });
    }
});

// Add these two new routes in your server.js

// UPDATE the 'About' information
app.put('/api/about/:id', async (req, res) => {
    try {
        const docId = req.params.id;
        const updatedData = req.body;

        // Find the document by its ID and update it with the new data
        // { new: true } ensures the updated document is returned
        const updatedInfo = await About.findByIdAndUpdate(docId, updatedData, { new: true });

        if (!updatedInfo) {
            return res.status(404).json({ message: 'About document not found' });
        }

        res.json({ message: 'About information updated successfully!', updatedInfo });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE the 'About' information
app.delete('/api/about/:id', async (req, res) => {
    try {
        const docId = req.params.id;
        const deletedInfo = await About.findByIdAndDelete(docId);

        if (!deletedInfo) {
            return res.status(404).json({ message: 'About document not found' });
        }

        res.json({ message: 'About information deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Start the server ---
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
