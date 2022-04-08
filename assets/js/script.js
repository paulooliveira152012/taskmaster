var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item"); //list-group-item is from bootstrap
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill") //jQuery method
    .text(taskDate); //jQuery method
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

//FUNCTION TO SAVE THE TASKS TO LOCAL STORAGE !!IMPORTANT  //
var saveTasks = function() {                               //
  localStorage.setItem("tasks", JSON.stringify(tasks));    //
};
//---------------------------------------------------------------------------------------------------
// event and callback function when click the p element --> bubble effect on the parent's event listener 
$(".list-group").on("click", "p", function() {
  var text = $(this)
  var textInput = $("<textarea>")
  .addClass("form-control")
  .val(text);
  $(this).replaceWith(textInput);
  //the method "focus" will highlight the box
  textInput.trigger("focus");
});

/*
blur event to trigger as soon as the user interacts with anything other than the textarea elemtn
- collect the current value of the element;
- collect the parent's ID
- collect the element's position in the list
 */

$(".list-group").on("blur", "textarea", function() {
// get the textarea's current value/text
var text = $(this)
  .val()
  .trim();
  tasks[status][index].text = text;
saveTasks();

// get the parent ul's id attribute
var status = $(this)
  .closest(".list-group")
  .attr("id")
  .replace("list-", "");
  tasks[status][index].text = text;
saveTasks();

// get the task's position in the list of other li elements
var index = $(this)
  .closest(".list-group-item")
  .index();
  tasks[status][index].text = text;
saveTasks();
// ___________________________________from loal storage back to element
// recreate p element
var taskP = $("<p>")
  .addClass("m-1")
  .text(text);

// replace textarea with p element
$(this).replaceWith(taskP);
});
// ___________________________________________________________________

//______________________________________________________________________________________________________

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();

//---------------------------------------------------------------------------------------------------
/* Adding ability to Edit Tasks */

//---block of code to edit date
// due date was clicked
$(".list-group").on("click", "span", function() {
  // get current text
  var date = $(this)
    .text()
    .trim();

  // create new input element
  var dateInput = $("<input>")
    .attr("type", "text")
    .addClass("form-control")
    .val(date);

  // swap out elements
  $(this).replaceWith(dateInput);

  // automatically focus on new element
  dateInput.trigger("focus");
});
//--end block of code to make editing possible

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

//--block of code to convert date back when outside click happens  
// value of due date was changed
$(".list-group").on("blur", "input[type='text']", function() {
  // get current text
  var date = $(this)
    .val()
    .trim();

  // get the parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

  // get the task's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    .index();

  // update task in array and re-save to localstorage
  tasks[status][index].date = date;
  saveTasks();

  // recreate span element with bootstrap classes
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);

  // replace input with span element
  $(this).replaceWith(taskSpan);
});
//______________________________________________________________________________________________________
//making tasks draggable
$(".card .list-group").sortable({
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  activate: function(event) {
    console.log("activate", this);
  },
  deactivate: function(event) {
    console.log("deactivate", this);
  },
  over: function(event) {
    console.log("over", event.target);
  },
  out: function(event) {
    console.log("out", event.target);
  },
  update: function(event) {
 // loop over current set of children in sortable list
// array to store the task data in
var tempArr = [];

// loop over current set of children in sortable list
$(this).children().each(function() {
  var text = $(this)
    .find("p")
    .text()
    .trim();

  var date = $(this)
    .find("span")
    .text()
    .trim();

  // add task data to the temp array as an object
  tempArr.push({
    text: text,
    date: date
  });
});

// trim down list's ID to match object property
var arrName = $(this)
  .attr("id")
  .replace("list-", "");

// update array on tasks object and save
tasks[arrName] = tempArr;
saveTasks();

console.log(tempArr);
  }
});

//Adding trash ---------------------------------------------------------------
$("#trash").droppable({
  accept: ".card .list-group-item",
  tolerance: "touch",
  drop: function(event, ui) {
    console.log("drop");
    ui.draggable.remove();

  },
  over: function(event, ui) {
    console.log("over");
  },
  out: function(event, ui) {
    console.log("out");
  }
});
