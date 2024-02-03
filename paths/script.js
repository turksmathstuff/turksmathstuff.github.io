const courseOptions = {
    "Algebra2Honors": ["Math Analysis", "Precalc E"],
    "MathAnalysis": ["Calc AB", "Calc H", "AP Stat"],
    "CalcAB": ["Calc CD", "AP Stat"],
    "CalcH": ["AP Stat", "CS Principles"]
};

// Function to create a course bubble
function createCourseBubble(courseId, courseName) {
    const bubble = document.createElement('div');
    bubble.textContent = courseName;
    bubble.classList.add('course-bubble');
    bubble.id = courseId;
    bubble.onclick = function() {
        selectCourse(courseId);
    };
    return bubble;
}

// Function to handle the course selection
function selectCourse(selectedCourse) {
    const container = document.getElementById('tree-container');

    // Hide all bubbles except the selected one
    Array.from(container.children).forEach(bubble => {
        if (bubble.id !== selectedCourse) {
            bubble.classList.add('hidden');
        }
    });

    // Show next options if any
    if (courseOptions[selectedCourse]) {
        courseOptions[selectedCourse].forEach(option => {
            const optionId = option.replace(/\s+/g, '');
            // Only create the bubble if it does not exist
            if (!document.getElementById(optionId)) {
                const bubble = createCourseBubble(optionId, option);
                container.appendChild(bubble);
            } else {
                // If it exists but is hidden, show it
                document.getElementById(optionId).classList.remove('hidden');
            }
        });
    }
}

// Initial event listeners
window.onload = function() {
    document.getElementById('Algebra2Honors').onclick = function() {
        selectCourse('Algebra2Honors');
    };
    document.getElementById('MathAnalysis').onclick = function() {
        selectCourse('MathAnalysis');
    };
    document.getElementById('CalcAB').onclick = function() {
        selectCourse('CalcAB');
    };
    document.getElementById('CalcH').onclick = function() {
        selectCourse('CalcH');
    };
};
