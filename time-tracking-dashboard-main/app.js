let taskData = [];
window.onload = function () {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      taskData = data;

      updateUI("weekly");

      document
        .getElementById("daily-btn")
        .addEventListener("click", function () {
          updateUI("daily");
        });
      document
        .getElementById("weekly-btn")
        .addEventListener("click", function () {
          updateUI("weekly");
        });
      document
        .getElementById("monthly-btn")
        .addEventListener("click", function () {
          updateUI("monthly");
        });

      document.querySelectorAll(".task-name").forEach((taskElement) => {
        taskElement.addEventListener("click", function (event) {
          editTaskName(event.target);
        });
      });

      document.querySelectorAll(".box4").forEach((box) => {
        box.addEventListener("click", function () {
          const taskName = box.querySelector(".task-name").textContent;
          editTaskHours(taskName);
        });
      });
    })
    .catch((err) => {
      console.error("Error loading JSON data:", err);
    });
};

function updateUI(timeframe) {
  document.querySelectorAll(".duration p").forEach((p) => {
    p.classList.remove("active");
  });

  document.getElementById(`${timeframe}-btn`).classList.add("active");

  taskData.forEach((task) => {
    const taskNameId = task.title.toLowerCase().replace(" ", "-");

    document.getElementById(`${taskNameId}-task-name`).textContent = task.title;

    const currentHours = task.timeframes[timeframe].current;
    const previousHours = task.timeframes[timeframe].previous;

    document.getElementById(
      `${taskNameId}-hours-today`
    ).textContent = `${currentHours}hrs`;
    document.getElementById(
      `${taskNameId}-hours-last-week`
    ).textContent = `Last week: ${previousHours}hrs`;
  });
}

function editTaskName(taskElement) {
  const newTaskName = prompt("Enter a new task name:", taskElement.textContent);

  if (newTaskName && newTaskName !== taskElement.textContent) {
    taskElement.textContent = newTaskName;
    updateTaskNameInData(taskElement, newTaskName);
  }
}
function updateTaskNameInData(taskElement, newTaskName) {
  const taskName = taskElement.textContent;
  const task = taskData.find((task) => task.title === taskName);

  if (task) {
    task.title = newTaskName;
  }
}

function editTaskHours(taskName) {
  const newHoursToday = prompt(
    `Enter the new hours spent today for ${taskName}:`
  );
  const newHoursLastWeek = prompt(
    `Enter the hours spent last week for ${taskName}:`
  );

  if (
    newHoursToday &&
    newHoursLastWeek &&
    !isNaN(newHoursToday) &&
    !isNaN(newHoursLastWeek)
  ) {
    updateTaskData(
      taskName,
      parseInt(newHoursToday),
      parseInt(newHoursLastWeek)
    );

    const taskNameId = taskName.toLowerCase().replace(" ", "-");
    document.getElementById(
      `${taskNameId}-hours-today`
    ).textContent = `${newHoursToday}hrs`;
    document.getElementById(
      `${taskNameId}-hours-last-week`
    ).textContent = `Last week: ${newHoursLastWeek}hrs`;

    saveData();
  } else {
    alert("Please enter valid numbers for hours.");
  }
}

function updateTaskData(taskName, newHoursToday, newHoursLastWeek) {
  const task = taskData.find((task) => task.title === taskName);
  if (task) {
    task.timeframes.daily.current = newHoursToday;
    task.timeframes.daily.previous = newHoursLastWeek;
    task.timeframes.weekly.current = newHoursToday;
    task.timeframes.weekly.previous = newHoursLastWeek;
    task.timeframes.monthly.current = newHoursToday;
    task.timeframes.monthly.previous = newHoursLastWeek;
  }
}

function saveData() {
  console.log("Saving task data:", taskData);
}
