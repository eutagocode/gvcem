// [x] Criar um objeto para receber os dados da meta
// [x] Criar a tela que aparecerá para adicionar a nova meta
// [] Adicionar a função de pegar o valor da meta e lançar no objeto
// [] Guardar os dados da meta no localStorage
// [] Pegar os dados e colocar em tela
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

function showFormCreateGoal() {
    document.querySelector(".shadow-section").style.display = "flex";
}

function proportionalWorkingDays(year, month, currentDay, goal) {
    const businessDays = getBusinessDays(year, month);

    if (currentDay > businessDays) {
        return goal;
    }

    const proportional = (currentDay / getBusinessDays(year, month)) * goal;

    return proportional;
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

    localStorage.setItem("DATA_OF_GOAL", JSON.stringify(data));
}
