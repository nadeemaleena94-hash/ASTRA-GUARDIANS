
/*
 ASTRA GUARDIANS
 Space Game Design - 2026

 AI-assisted code development acknowledged.
 NASA data source: NASA/JPL NeoWs.
*/

// ==========================================
// 1. GAME VARIABLES
// ==========================================

let score = 0;
let missionIndex = 0;
let answered = false;

let completedMissions = new Set();


// ==========================================
// 2. NASA API CONFIGURATION
// ==========================================

// DEMO_KEY is a public NASA demonstration key.
// For regular use, obtain your own key from:
// https://api.nasa.gov/

const NASA_API_KEY = "DEMO_KEY";

const NASA_API_URL =
    "https://api.nasa.gov/neo/rest/v1/feed";


// ==========================================
// 3. GAME MISSIONS
// ==========================================

const scenarios = [

    {
        title: "MISSION 01 - EARLY DETECTION",

        question:
            "Mission control has detected an asteroid, but its orbit is still uncertain. What should you do first?",

        best: "track",

        explanation:
            "Excellent decision! Tracking and collecting observations helps scientists improve orbital estimates. Understanding an object's movement is essential before considering any response."
    },

    {
        title: "MISSION 02 - DEFLECTION STRATEGY",

        question:
            "A fictional asteroid has been carefully studied and there is substantial warning time. Which demonstrated concept could scientists evaluate for changing its trajectory?",

        best: "kinetic",

        explanation:
            "Great work! A kinetic impactor is a demonstrated deflection concept. NASA's DART mission changed the orbital motion of Dimorphos through a spacecraft impact."
    },

    {
        title: "MISSION 03 - LONG-TERM PROTECTION",

        question:
            "An asteroid has been detected many years in advance. Which proposed method uses the gravitational attraction of a nearby spacecraft to gradually alter its trajectory?",

        best: "tractor",

        explanation:
            "Outstanding! A gravity tractor is a proposed concept that uses a spacecraft's gravitational pull to gradually influence an asteroid's trajectory. It would require extensive planning and a long lead time."
    }

];


// ==========================================
// 4. TRAINING DATA
// ==========================================

function createTrainingData() {

    return [

        {
            name: "Training Asteroid A-01",
            diameter: 85,
            velocity: 18400,
            distance: 4200000,
            hazardous: false
        },

        {
            name: "Training Asteroid B-02",
            diameter: 310,
            velocity: 26500,
            distance: 6800000,
            hazardous: true
        },

        {
            name: "Training Asteroid C-03",
            diameter: 42,
            velocity: 12200,
            distance: 9100000,
            hazardous: false
        }

    ];

}


let asteroids = createTrainingData();


// ==========================================
// 5. HELPER FUNCTIONS
// ==========================================

function getElement(id) {

    return document.getElementById(id);

}


function formatNumber(number) {

    return Number(number).toLocaleString("en-US", {
        maximumFractionDigits: 0
    });

}


function formatDistance(number) {

    const km = Number(number);

    if (km >= 1000000) {

        return (km / 1000000).toFixed(2)
            + " million km";

    }

    return formatNumber(km) + " km";

}


function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];

    });

}


// ==========================================
// 6. DISPLAY MISSION
// ==========================================

function displayMission() {

    answered = false;

    const mission = scenarios[missionIndex];

    const asteroid = asteroids[missionIndex];

    getElement("mission-title").textContent =
        mission.title;

    getElement("object-name").textContent =
        asteroid.name;

    getElement("object-description").textContent =
        mission.question;

    getElement("diameter").textContent =
        formatNumber(asteroid.diameter) + " m";

    getElement("velocity").textContent =
        formatNumber(asteroid.velocity) + " km/h";

    getElement("distance").textContent =
        formatDistance(asteroid.distance);

    getElement("score").textContent = score;

    getElement("progress").textContent =
        completedMissions.size + "/3";

    getElement("feedback").classList.remove("show");

    getElement("next-btn").disabled = true;

    getElement("next-btn").textContent =
        "NEXT MISSION →";

    document.querySelectorAll(".choice").forEach(button => {

        button.disabled = false;

        button.classList.remove("selected");

    });

}


// ==========================================
// 7. PLAYER DECISION
// ==========================================

function selectStrategy(choice) {

    if (answered) return;

    answered = true;

    const mission = scenarios[missionIndex];

    const correct = choice === mission.best;

    const feedback = getElement("feedback");

    if (correct) {

        score += 100;

        feedback.innerHTML = `
            <strong>🎉 EXCELLENT DECISION! +100 POINTS</strong>
            <p>${mission.explanation}</p>
        `;

    }

    else {

        score += 25;

        feedback.innerHTML = `
            <strong>🧠 GOOD ATTEMPT! +25 LEARNING POINTS</strong>
            <p>${mission.explanation}</p>
        `;

    }

    completedMissions.add(missionIndex);

    getElement("score").textContent = score;

    getElement("progress").textContent =
        completedMissions.size + "/3";

    feedback.classList.add("show");

    document.querySelectorAll(".choice").forEach(button => {

        button.disabled = true;

        if (button.dataset.choice === choice) {

            button.classList.add("selected");

        }

    });

    getElement("next-btn").disabled = false;

    getElement("next-btn").textContent =
        missionIndex === 2
            ? "COMPLETE MISSION 🏆"
            : "NEXT MISSION →";

}


// ==========================================
// 8. NEXT MISSION
// ==========================================

function nextMission() {

    if (!answered) return;

    if (missionIndex < 2) {

        missionIndex++;

        displayMission();

    }

    else {

        showFinalResults();

    }

}


// ==========================================
// 9. FINAL RESULTS
// ==========================================

function showFinalResults() {

    const gamePanel = document.querySelector(".game-panel");

    const percentage = Math.round((score / 300) * 100);

    let rank;

    if (percentage === 100) {

        rank = "LEGENDARY SPACE GUARDIAN 🏆";

    }

    else if (percentage >= 70) {

        rank = "ELITE PLANETARY DEFENDER 🚀";

    }

    else {

        rank = "RISING SPACE EXPLORER 🌍";

    }

    gamePanel.innerHTML = `

        <div class="mission-box" style="text-align:center">

            <div style="font-size:65px">🏆</div>

            <h2>MISSION ACCOMPLISHED!</h2>

            <h3 style="color:#62e6f5;margin:20px">
                ${rank}
            </h3>

            <p>
                You completed all three planetary
                defense training missions.
            </p>

            <h2 style="margin:20px">
                FINAL SCORE: ${score}/300
            </h2>

            <p>
                You practiced asteroid detection,
                deflection strategies and long-term
                planetary protection.
            </p>

            <button class="primary-btn"
                style="margin-top:25px"
                onclick="restartGame()">

                PLAY AGAIN 🚀

            </button>

        </div>

    `;

}


// ==========================================
// 10. RESTART GAME
// ==========================================

function restartGame() {

    score = 0;

    missionIndex = 0;

    answered = false;

    completedMissions.clear();

    const panel = document.querySelector(".game-panel");

    location.reload();

}


// ==========================================
// 11. NASA DATA FETCHING
// ==========================================

async function loadNASAData() {

    const feed = getElement("nasa-feed");

    const status = getElement("data-status");

    feed.innerHTML =
        "<p>🛰️ Connecting to NASA's asteroid database...</p>";

    status.textContent =
        "NASA data status: Connecting...";

    try {

        const today = new Date();

        const startDate =
            today.toISOString().slice(0, 10);

        const future = new Date(
            today.getTime() + 6 * 24 * 60 * 60 * 1000
        );

        const endDate =
            future.toISOString().slice(0, 10);

        const url =
            `${NASA_API_URL}?start_date=${startDate}` +
            `&end_date=${endDate}&api_key=${NASA_API_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {

            throw new Error(
                "NASA API response: " + response.status
            );

        }

        const data = await response.json();

        const allObjects = Object.values(
            data.near_earth_objects || {}
        ).flat();

        if (allObjects.length === 0) {

            throw new Error("No asteroid records available.");

        }

        // Display the first five NASA records.

        const displayedObjects = allObjects.slice(0, 5);

        feed.innerHTML = displayedObjects.map(object => {

            const approach =
                object.close_approach_data?.[0] || {};

            const diameter =
                object.estimated_diameter?.meters
                    ?.estimated_diameter_max || 0;

            const velocity =
                approach.relative_velocity
                    ?.kilometers_per_hour || 0;

            const distance =
                approach.miss_distance?.kilometers || 0;

            const hazardous =
                object.is_potentially_hazardous_asteroid;

            return `

                <div class="neo-item">

                    <div>

                        <strong>
                            ${escapeHTML(object.name)}
                        </strong>

                        <p>
                            Diameter: ${formatNumber(diameter)} m
                        </p>

                        <p>
                            Velocity: ${formatNumber(velocity)} km/h
                        </p>

                        <p>
                            Closest approach:
                            ${escapeHTML(approach.close_approach_date || "N/A")}
                        </p>

                        <p>
                            Distance: ${formatDistance(distance)}
                        </p>

                    </div>

                    <div class="${hazardous ? "hazard" : "safe"}">

                        ${hazardous
                            ? "PHA FLAGGED"
                            : "NOT PHA FLAGGED"}

                    </div>

                </div>

            `;

        }).join("");

        // Prepare three objects for game missions.

        asteroids = allObjects.slice(0, 3).map(object => {

            const approach =
                object.close_approach_data?.[0] || {};

            return {

                name: object.name,

                diameter:
                    object.estimated_diameter?.meters
                        ?.estimated_diameter_max || 0,

                velocity: Number(
                    approach.relative_velocity
                        ?.kilometers_per_hour || 0
                ),

                distance: Number(
                    approach.miss_distance?.kilometers || 0
                ),

                hazardous:
                    object.is_potentially_hazardous_asteroid

            };

        });

        if (asteroids.length < 3) {

            asteroids = createTrainingData();

        }

        missionIndex = 0;

        score = 0;

        completedMissions.clear();

        displayMission();

        status.textContent =
            "NASA data status: Successfully loaded live NeoWs observations.";

    }

    catch (error) {

        console.error("NASA data error:", error);

        asteroids = createTrainingData();

        missionIndex = 0;

        score = 0;

        completedMissions.clear();

        displayMission();

        feed.innerHTML = `

            <div class="notice">

                <strong>NASA live feed unavailable.</strong>

                <p>
                    The game is still playable using
                    fictional training objects.
                    These are not actual NASA observations.
                </p>

                <p>
                    Error: ${escapeHTML(error.message)}
                </p>

            </div>

        `;

        status.textContent =
            "NASA data status: Offline training mode.";

    }

}


// ==========================================
// 12. BUTTON EVENTS
// ==========================================

document.querySelectorAll(".choice").forEach(button => {

    button.addEventListener("click", () => {

        selectStrategy(button.dataset.choice);

    });

});


getElement("next-btn").addEventListener(
    "click",
    nextMission
);


getElement("restart-btn").addEventListener(
    "click",
    restartGame
);


getElement("refresh-btn").addEventListener(
    "click",
    loadNASAData
);


// ==========================================
// 13. NAVIGATION
// ==========================================

function startGame() {

    getElement("game").scrollIntoView({
        behavior: "smooth"
    });

}


function scrollToNASA() {

    getElement("nasa").scrollIntoView({
        behavior: "smooth"
    });

}


// ==========================================
// 14. START THE GAME
// ==========================================

displayMission();

loadNASAData();
