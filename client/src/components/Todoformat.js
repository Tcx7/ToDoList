import React from "react";
// import Todo from "./Todo";

function TodoFormat(props) {
  // console.log(props.propID);
  return (
    <div>
      <ul class="card-header ">
        <li>ID: {props.propID}</li>
        <li>Task To Complete: {props.propTask}</li>
        <li>In progress</li>
        <li>Is complete : {props.propComplete}</li>
        {/* <li>
          Start Date:
          {props.propMonth}
          {props.propID}
        </li>
        <li>
          Due Date:{props.propMonth}
          {props.propDuedate}
        </li> */}
        <div class="btn-group">
          <button
            class="btn btn-success"
            type="button"
            id={props.propID}
            onClick={props.compTask}
          >
            Mark Complete
          </button>
          <button
            class="btn btn-danger"
            type="button"
            id={props.propID}
            onClick={props.deleteTask}
          >
            Delete this task
          </button>
        </div>
      </ul>
    </div>
  );
}

export default TodoFormat;
