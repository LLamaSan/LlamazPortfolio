document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.getElementById('about-section');
    const projectsGrid = document.getElementById('projects-grid');
    
    const API_BASE_URL = 'https://llamazportfoliobackend.onrender.com/api';

    // --- Fetch and Display About Information (Reverted to Grid Layout) ---
    const fetchAboutInfo = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/about`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            aboutSection.innerHTML = ''; 

            // Create and append the profile picture directly
            const profilePic = document.createElement('img');
            profilePic.src = data.profilePicUrl;
            profilePic.alt = 'Profile Picture';
            profilePic.className = 'profile-pic';
            aboutSection.appendChild(profilePic);

            // Create a container for the text info (name, education)
            const infoContainer = document.createElement('div');
            infoContainer.className = 'about-section-info';

            const name = document.createElement('h1');
            name.textContent = data.name;
            infoContainer.appendChild(name);
            
            

            const educationList = document.createElement('ul');
            educationList.className = 'education-list';

            data.education.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            educationList.appendChild(listItem);
            });

            infoContainer.appendChild(educationList); // Add the whole list
            aboutSection.appendChild(infoContainer);

            // Create a container for the skill icons that spans the grid
            const skillsContainer = document.createElement('div');
            skillsContainer.className = 'skills-icons';
            data.skills.forEach(skill => {
                const icon = document.createElement('i');
                icon.className = `${skill.iconClass} skill-icon`;
                icon.title = skill.name;
                skillsContainer.appendChild(icon);
            });
            aboutSection.appendChild(skillsContainer);

        } catch (error) {
            aboutSection.innerHTML = '<p>Error loading about information. Please try again later.</p>';
            console.error('Fetch error for about info:', error);
        }
    };

    // --- Fetch and Display Projects ---
    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects`);
            if (!response.ok) throw new Error('Network response was not ok');
            const projects = await response.json();

            projectsGrid.innerHTML = '';

            if (projects.length === 0) {
                projectsGrid.innerHTML = '<p>No projects to display at the moment.</p>';
                return;
            }

            projects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'project-card';
                
                card.innerHTML = `
                    <img src="${project.imageUrl}" alt="${project.title}" class="project-image">
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="project-links">
                            ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>` : ''}
                            ${project.deployedLink ? `<a href="${project.deployedLink.startsWith('http') ? project.deployedLink : 'https://' + project.deployedLink}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> </a>`: ''}

                        </div>
                    </div>
                `;
                projectsGrid.appendChild(card);
            });

        } catch (error) {
            projectsGrid.innerHTML = '<p>Error loading projects. Please try again later.</p>';
            console.error('Fetch error for projects:', error);
        }
    };

    fetchAboutInfo();
    fetchProjects();
});

