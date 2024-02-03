document.addEventListener('DOMContentLoaded', function() {
    const courses = {
        'Algebra 2 Honors': ['Math Analysis', 'Precalculus Honors', 'AP Statistics'],
        'Math Analysis': ['AP Calculus AB', 'Calculus Honors', 'AP Statistics'],
        'AP Calculus AB': [] // Assume no subsequent courses for simplicity
        // Add more courses and their next options as needed
    };

    const coursePathway = document.getElementById('coursePathway');

    function addCourseLevel(coursesToAdd, level) {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'course-level';
        levelDiv.dataset.level = level;
        coursesToAdd.forEach(course => {
            const bubble = document.createElement('div');
            bubble.className = 'course-bubble';
            bubble.textContent = course;
            bubble.onclick = function() {
                // Remove subsequent levels
                let nextLevels = document.querySelectorAll(`[data-level="${level + 1}"]`);
                nextLevels.forEach(el => el.remove());
                // Add next level if there are subsequent courses
                if (courses[course].length > 0) {
                    addCourseLevel(courses[course], level + 1);
                }
            };
            levelDiv.appendChild(bubble);
        });
        coursePathway.appendChild(levelDiv);
    }

    // Initialize with the first level of courses
    addCourseLevel(Object.keys(courses), 0);
});
