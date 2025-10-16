// backend/seed.js
const mongoose = require('mongoose');

// --- Replace with your MongoDB URI ---
 const mongoURI = process.env.MONGO_URI;;
// --- Define Schemas and Models (must match server.js) ---
const aboutSchema = new mongoose.Schema({
    name: String,
    education: [String],
    profilePicUrl: String,
    skills: [{ name: String, iconClass: String }]
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

// --- Data to be inserted ---
const aboutData = {
    name: 'NoDramaLLama',
    education: ['B.Sc. in Computer Science and Technology',],
    profilePicUrl: 'backend/images/CatPfpSauce.jpeg',
    skills: [
        { name: 'HTML5', iconClass: 'fab fa-html5' },
        { name: 'CSS3', iconClass: 'fab fa-css3-alt' },
        { name: 'JavaScript', iconClass: 'fab fa-js-square' },
        { name: 'React', iconClass: 'fab fa-react' },
        { name: 'Node.js', iconClass: 'fab fa-node-js' },
        { name: 'C++', iconClass: 'fab fa-cuttlefish' } // Using a placeholder icon for C++
    ]
};

const projectsData = [
    {
        title: 'Project Cyberscape',
        description: 'A futuristic web application built with the MERN stack, visualizing complex data streams in real-time.',
        imageUrl: 'https://placehold.co/600x400/1a1a1a/00f7ff?text=Project+1',
        githubLink: 'https://github.com/',
        deployedLink: 'https://github.com/'
    },
    {
        title: 'Project Neon Grid',
        description: 'An interactive browser-based game with dynamic visuals and a persistent high-score system using MongoDB.',
        imageUrl: 'https://placehold.co/600x400/1a1a1a/ff00ff?text=Project+2',
        githubLink: 'https://github.com/',
        deployedLink: 'https://github.com/'
    }
];

// --- Seeding Function ---
const seedDatabase = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected for seeding...');

        // Clear existing data
        await About.deleteMany({});
        await Project.deleteMany({});
        console.log('Cleared existing data.');

        // Insert new data
        await About.create(aboutData);
        await Project.insertMany(projectsData);
        console.log('Database seeded successfully!');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
};

seedDatabase();
