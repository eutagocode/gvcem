// [x] Criar um objeto para receber os dados da meta
// [x] Criar a tela que aparecerá para adicionar a nova meta
// [x] Adicionar a função de pegar o valor da meta e lançar no objeto
// [x] Guardar os dados da meta no localStorage
// [] Pegar os dados e colocar em tela
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
    proportionalElement.innerHTML = data.proportional;
    soldElement.innerHTML = data.sold;
    daysElement.innerHTML = data.days;
    dailyElement.innerHTML = data.daily;
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

addEventListener("DOMContentLoaded", fetchGoal());
addEventListener("DOMContentLoaded", switchMonth());

function showFormCreateGoal() {
    document.querySelector(".shadow-section").style.display = "flex";
}

function proportionalWorkingDays(year, month, currentDay, goal) {
    const businessDays = getBusinessDays(year, month);

    if (currentDay > businessDays) {
        return goal;
    }

    const proportional = (currentDay / getBusinessDays(year, month)) * goal;

    return Math.round(proportional);
}

function getRemainingBusinessDays(year, month, currentDay) {
    const today = new Date(year, month, currentDay);
    let lastDay = new Date(year, month + 1, 0);

    let businessDaysRemaining = [];

    for (let day = today; day <= lastDay--; day.setDate(day.getDate() + 1)) {
        const dayOfTheWeek = day.getDate();
        if (dayOfTheWeek !== 0) {
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
        const dayOfTheWeek = day.getDate();

        if (dayOfTheWeek !== 0) {
            businessDays.push(new Date(day));
        }
    }

    return businessDays.length;
}

function createGoal() {
    const inputGoal = document.getElementById("input-goal").value;

    const data = new GoalData(inputGoal);

    data.sold = "";
    data.daily = "";

    localStorage.setItem("DATA_OF_GOAL", JSON.stringify(data));

    fetchGoal();

    inputGoal = "";
    document.querySelector(".shadow-section").style.display = "none";
}

function showFormSoldValue() {
    document.querySelector(".shadow-section-2").style.display = "flex";
}

function handleSoldValue() {
    const data = JSON.parse(localStorage.getItem("DATA_OF_GOAL") || "[]");

    const inputValue = document.querySelector("#input-sold").value;

    data.sold += parseFloat(inputValue);
    data.daily = (parseFloat(data.goal) - parseFloat(data.sold)) / data.days;

    localStorage.setItem("DATA_OF_GOAL", JSON.stringify(data));

    fetchGoal();

    inputValue = "";
    document.querySelector(".shadow-section-2").style.display = "none";
}
