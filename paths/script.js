// script.js
document.addEventListener('DOMContentLoaded', () => {
    const coursesContainer = document.getElementById('coursesContainer');
    const coursesData = {
        'root': ['Algebra 2 Honors', 'Math Analysis'],
        'Algebra 2 Honors': ['Math Analysis', 'Precalculus Honors', 'AP Statistics'],
        'Math Analysis': ['AP Calculus AB', 'Calculus Honors', 'AP Statistics'],
        // Add more courses and their subsequent options here
    };

    function addCourseBubbles(courses) {
        coursesContainer.innerHTML = ''; // Clear the container
        courses.forEach(course => {
            const bubble = document.createElement('div');
            bubble.className = 'course-bubble';
            bubble.textContent = course;
            bubble.onclick = () => {
                const nextCourses = coursesData[course];
                if (nextCourses) {
                    addCourseBubbles(nextCourses);
                }
            };
            coursesContainer.appendChild(bubble);
        });
    }

    addCourseBubbles(coursesData['root']); // Initialize with root courses
});
