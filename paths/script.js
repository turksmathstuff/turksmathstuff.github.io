const courseOptions = {
    "Algebra2Honors": ["Math Analysis", "Precalc E"],
    "MathAnalysis": ["Calc AB", "Calc H", "AP Stat"],
    "CalcAB": ["Calc CD", "AP Stat"],
    "CalcH": ["AP Stat", "CS Principles"]
};

function selectCourse(selectedCourse) {
    // Hide all initial options
    document.querySelectorAll('.course-bubble').forEach(bubble => {
        bubble.classList.add('hidden');
    });

    // Show selected course
    document.getElementById(selectedCourse).classList.remove('hidden');

    // Show next options
    const nextOptions = courseOptions[selectedCourse];
    nextOptions.forEach(option => {
        const optionId = option.replace(/\s+/g, '');
        if (!document.getElementById(optionId)) {
            const bubble = document.createElement('div');
            bubble.textContent = option;
            bubble.classList.add('course-bubble');
            bubble.id = optionId;
            bubble.onclick = function() {
                selectCourse(optionId);
            };
            document.getElementById('tree-container').appendChild(bubble);
        } else {
            document.getElementById(optionId).classList.remove('hidden');
        }
    });
}
