const goalElement = document.querySelector("[data-goal]");
const proportionalElement = document.querySelector("[data-proportional]");
const soldElement = document.querySelector("[data-sold]");
const daysElement = document.querySelector("[data-days]");
const dailyElement = document.querySelector("[data-daily]");
const date = new Date();

class GoalData {
    constructor(goal, sold) {
        this.goal = goal;
        this.proportional = proportionalWorkingDays(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            goal,
        );
        this.sold = sold;
        this.days = getRemainingBusinessDays(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
        );
        this.daily = (goal - sold) / this.days;
    }
}

function fetchGoal() {
    const data = JSON.parse(localStorage.getItem("DATA_OF_GOAL") || "[]");

    goalElement.innerHTML = data.goal;
    proportionalElement.innerHTML = Math.round(data.proportional);
    soldElement.innerHTML = Math.round(data.sold);
    daysElement.innerHTML = Math.round(data.days);
    dailyElement.innerHTML = Math.round(data.daily);
}

function switchMonth() {
    const data = JSON.parse(localStorage.getItem("DATA_OF_GOAL") || "[]");

    if (data.daily == 0) {
        data.goal = 0;
        data.proportional = 0;
        data.sold = 0;
        data.days = 0;
        data.daily = 0;
    }
}

addEventListener("DOMContentLoaded", async () => {
    await fetchGoal();
    await switchMonth();
    await updateRemainingDays();
    await updateProportional();
});

function showFormCreateGoal() {
    document.querySelector(".shadow-section").style.display = "flex";
}

function updateProportional() {
    const data = JSON.parse(localStorage.getItem("DATA_OF_GOAL") || "[]");

    let proportionalValue = proportionalWorkingDays(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        data.goal,
    );

    data.proportional = proportionalValue;

    localStorage.setItem("DATA_OF_GOAL", JSON.stringify(data));

    updateDaily();

    fetchGoal();
}

function updateRemainingDays() {
    const data = JSON.parse(localStorage.getItem("DATA_OF_GOAL") || "[]");

    let missingDays = getRemainingBusinessDays(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    );

    data.days = missingDays;

    localStorage.setItem("DATA_OF_GOAL", JSON.stringify(data));

    updateDaily();

    fetchGoal();
}

function proportionalWorkingDays(year, month, currentDay, goal) {
    const today = new Date(year, month, currentDay);
    let lastDay = new Date(year, month + 1, 0);

    let proportional;
    let proportionalDays = [];

    for (let day = today; day <= lastDay; day.setDate(day.getDate() + 1)) {
        let dayOfTheWeek = day.getDay();
        if (dayOfTheWeek !== 0) {
            proportionalDays.push(new Date(day));
        }
    }

    proportionalDays.map((proportionalDay) => {
        if (currentDay === proportionalDay.getDate()) {
            proportional = (currentDay / lastDay.getDate()) * goal;
        }
    });

    return Math.round(proportional);
}

function getRemainingBusinessDays(year, month, currentDay) {
    const today = new Date(year, month, currentDay);
    let lastDay = new Date(year, month + 1, 0);
    const nationalHolidays = [
        new Date(year, "0", "1"),
        new Date(year, "1", "12"),
        new Date(year, "1", "13"),
        new Date(year, "2", "29"),
        new Date(year, "3", "21"),
        new Date(year, "4", "1"),
        new Date(year, "4", "30"),
        new Date(year, "8", "7"),
        new Date(year, "9", "12"),
        new Date(year, "10", "2"),
        new Date(year, "10", "15"),
        new Date(year, "11", "25"),
    ];

    let businessDaysRemaining = [];

    for (let day = today; day <= lastDay; day.setDate(day.getDate() + 1)) {
        let dayOfTheWeek = day.getDay();
        let isHoliday = nationalHolidays.some(
            (holiday) => holiday.getTime() === day.getTime(),
        );

        if (dayOfTheWeek !== 0 && !isHoliday) {
            businessDaysRemaining.push(new Date(day));
        }
    }

    return businessDaysRemaining.length;
}

function getBusinessDays(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let businessDays = [];

    for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
        let dayOfTheWeek = day.getDay();

        if (dayOfTheWeek !== 0) {
            businessDays.push(new Date(day));
        }
    }

    return businessDays.length;
}

function createGoal() {
    const inputGoal = document.getElementById("input-goal");

    const data = new GoalData(inputGoal.value);

    data.sold = "";
    data.daily = "";

    localStorage.setItem("DATA_OF_GOAL", JSON.stringify(data));

    fetchGoal();

    inputGoal.value = "";

    document.querySelector(".shadow-section").style.display = "none";
}

function showFormSoldValue() {
    document.querySelector(".shadow-section-2").style.display = "flex";
}

function handleSoldValue() {
    const data = JSON.parse(localStorage.getItem("DATA_OF_GOAL") || "[]");
    let soldValue = "";
    const inputValue = document.querySelector("#input-sold");

    soldValue = data.sold + parseFloat(inputValue.value);

    data.sold = parseFloat(soldValue);

    localStorage.setItem("DATA_OF_GOAL", JSON.stringify(data));

    fetchGoal();

    inputValue.value = "";

    document.querySelector(".shadow-section-2").style.display = "none";
}

function updateDaily() {
    const data = JSON.parse(localStorage.getItem("DATA_OF_GOAL") || "[]");

    data.daily = (data.goal - data.sold) / data.days;

    localStorage.setItem("DATA_OF_GOAL", JSON.stringify(data));
}

function showFormRemoveSold() {
    document.querySelector(".shadow-section-3").style.display = "flex";
}

function handleRemoveSold() {
    const data = JSON.parse(localStorage.getItem("DATA_OF_GOAL") || "[]");

    const inputRemove = document.querySelector("#input-remove-sold");

    data.sold = data.sold - parseFloat(inputRemove.value);

    localStorage.setItem("DATA_OF_GOAL", JSON.stringify(data));

    updateDaily();

    fetchGoal();

    inputRemove.value = "";

    document.querySelector(".shadow-section-3").style.display = "none";
}

function showFormDeleteGoal() {
    document.querySelector(".shadow-section-4").style.display = "flex";
}

function handleDeleteGoal() {
    localStorage.removeItem("DATA_OF_GOAL");

    fetchGoal();

    document.querySelector(".shadow-section-4").style.display = "none";
}
