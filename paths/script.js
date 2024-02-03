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

function showNextCourses(selectedCourse) {
    // Clear existing next level courses before displaying new ones
    const nextCoursesContainer = document.getElementById('next-courses');
    if (nextCoursesContainer) {
        nextCoursesContainer.remove();
    }

    // Mapping of courses to their next options
    const courseOptions = {
        'algebra2Honors': ['Math Analysis', 'Precalculus Honors', 'AP Statistics'],
        'mathAnalysis': ['AP Calculus AB', 'Calculus Honors', 'AP Statistics'],
        // Add other mappings as necessary
    };

    // Create a container for the next level courses
    const nextCoursesDiv = document.createElement('div');
    nextCoursesDiv.id = 'next-courses';
    document.getElementById('course-container').appendChild(nextCoursesDiv);

    // Add the next level courses based on the selected course
    if (courseOptions[selectedCourse]) {
        courseOptions[selectedCourse].forEach(function(course) {
            const courseDiv = document.createElement('div');
            courseDiv.className = 'course';
            courseDiv.textContent = course;
            courseDiv.onclick = function() { showNextCourses(course.toLowerCase().replace(/ /g, '')); }; // Convert course name to a suitable format and call showNextCourses
            nextCoursesDiv.appendChild(courseDiv);
        });
    }
}

