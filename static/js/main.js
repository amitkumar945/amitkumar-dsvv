document.addEventListener('DOMContentLoaded', () => {
    const jobForm = document.getElementById('job-form');
    const jobList = document.getElementById('job-list');

    // Load jobs from MongoDB
    fetchJobs();

    // Submit Job to MongoDB
    jobForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const jobData = {
            company: document.getElementById('company').value,
            title: document.getElementById('title').value,
            salary: document.getElementById('salary').value,
            location: document.getElementById('location').value,
            skills: document.getElementById('skills').value,
            description: document.getElementById('description').value
        };

        const response = await fetch('/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobData)
        });

        if (response.ok) {
            jobForm.reset();
            fetchJobs();
        }
    });

    async function fetchJobs() {
        const response = await fetch('/api/jobs');
        const jobs = await response.json();
        
        jobList.innerHTML = jobs.length === 0 ? '<p class="text-center text-slate-400 py-10">No jobs listed yet.</p>' : '';
        
        jobs.forEach(job => {
            const card = document.createElement('div');
            card.className = 'job-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4';
            card.innerHTML = `
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-xl font-bold text-slate-800">${job.title}</h3>
                        <span class="text-xs font-bold bg-green-100 text-green-600 px-2 py-1 rounded">${job.salary}</span>
                    </div>
                    <p class="text-indigo-600 font-semibold mb-2"><i class="fa-solid fa-building mr-1"></i>${job.company}</p>
                    <div class="flex gap-4 text-sm text-slate-500 mb-3">
                        <span><i class="fa-solid fa-location-dot mr-1"></i>${job.location}</span>
                        <span><i class="fa-solid fa-code mr-1"></i>${job.skills}</span>
                    </div>
                    <p class="text-slate-600 text-sm line-clamp-2">${job.description}</p>
                </div>
                <button onclick="deleteJob('${job._id}')" class="bg-red-50 text-red-500 p-3 rounded-full hover:bg-red-500 hover:text-white transition-all">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            jobList.appendChild(card);
        });
    }

    window.deleteJob = async (id) => {
        if(confirm("Bhai, pakka delete karna hai?")) {
            await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
            fetchJobs();
        }
    }
});