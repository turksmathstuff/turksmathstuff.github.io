const coursePathways = {
    "Algebra 2 Honors": ["Math Analysis", "Precalculus Honors", "AP Statistics"],
    "Math Analysis": ["AP Calculus AB", "Calculus Honors", "AP Statistics"],
    // Add more pathways as needed
};

function showNextCourses(selectedCourse) {
    // Clear previous levels
    const pathway = document.getElementById('pathway');
    while (pathway.childElementCount > 1) {
        pathway.removeChild(pathway.lastChild);
    }

    // Add next level courses if they exist
    if (coursePathways[selectedCourse]) {
        const nextLevel = document.createElement('div');
        nextLevel.className = 'level';
        coursePathways[selectedCourse].forEach(course => {
            const courseDiv = document.createElement('div');
            courseDiv.className = 'course';
            courseDiv.textContent = course;
            // Enable clicking on next level courses too
            courseDiv.onclick = function() { showNextCourses(course); };
            nextLevel.appendChild(courseDiv);
        });
        pathway.appendChild(nextLevel);
    }
}
