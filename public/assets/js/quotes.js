// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  $(".deltask").on("click", function(event) {
    var id = $(this).data("id");

    // Send the DELETE request.
    $.ajax("/api/tasks/" + id, {
      type: "DELETE"
    }).then(
      function() {
        console.log("deleted id ", id);
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });

  $(".create-form").on("submit", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var newTask = {
      task_name: $("#tname").val().trim(),
      task_dec: $("#tdesc").val().trim(),
      status: $("#status").val().trim(),
      due_date: $("#ddate").val().trim()
    };

    // Send the POST request.
    $.ajax("/api/tasks", {
      type: "POST",
      data: newTask
    }).then(
      function() {
        console.log("created new quote");
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });

  $(".update-form").on("submit", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var updatedTask = {
      task_name: $("#tname").val().trim(),
      task_dec: $("#tdesc").val().trim(),
      status: $("#status").val().trim(),
      due_date: $("#ddate").val().trim()
    };

    var id = $(this).data("id");

    // Send the POST request.
    $.ajax("/api/quotes/" + id, {
      type: "PUT",
      data: updatedTask
    }).then(
      function() {
        console.log("updated quote");
        // Reload the page to get the updated list
        location.assign("/");
      }
    );
  });
});
