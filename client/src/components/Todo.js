import React from "react";
// import Button from "react-bootstrap/Button";
import TodoFormat from "./Todoformat";
import Moment from "react-moment";
import { Col, Container, Row } from "react-bootstrap";
import Axios from "axios";

class Todo extends React.Component {
  constructor() {
    super();
    this.state = {
      inputValue: "",
      data: [],
      idCount: 1,
      month: "Jan",
      compData: [],
      dateToFormat: "2022-06-18T17:35:00",
      isComplete: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateList = this.updateList.bind(this);
    this.onDeleteHandler = this.onDeleteHandler.bind(this);
    this.onCompleteHandler = this.onCompleteHandler.bind(this);
  }

  // handleChange will simply update the inputValue
  handleChange(e) {
    this.setState({ inputValue: e.target.value });
  }

  updateList(e) {
    // e.preventDefault();
    //sanitize
    let newData = {
      id: this.state.idCount,
      task: this.state.inputValue,
      idCount: this.state.idCount,
      isComplete: this.state.isComplete,
    };

    this.setState({
      inputValue: "",
      data: [...this.state.data, newData],
      idCount: this.state.idCount + 1,
      dueDate: this.state.dueDate + 1,
    });

    let toDoItems = {
      ID: this.state.idCount,
      Task: this.state.inputValue,
      isComplete: this.state.isComplete,
    };
    //////////////mysql insert below/////////////////////////
    Axios.post("http://localhost:3001/api/insert", toDoItems).then(() => {
      console.log("successful");
    });
  }

  onDeleteHandler(index) {
    // index.preventDefault();
    //find target ID and then locate the index of that ID

    let targetData = "";
    let parentID = index.target.parentNode.parentNode.parentNode.id;
    // console.log(targetData);

    if (parentID === "todoID") {
      targetData = this.state.data;
    } else {
      targetData = this.state.compData;
    }

    let targetID = index.target.id;
    console.log(targetData);

    let findIndex = targetData
      .map((elem) => {
        return elem.ID;
      })
      .indexOf(Number(targetID)); //returns index

    console.log(findIndex);
    Axios.delete(`http://localhost:3001/api/delete/` + targetID).then(() => {
      console.log("deleted");
    });

    let deleteTask = [...targetData];
    deleteTask.splice(findIndex, 1);

    if (parentID === "todoID") {
      this.setState({
        data: deleteTask,
      });
    } else {
      this.setState({
        compData: deleteTask,
      });
    }
  }

  onCompleteHandler(e) {
    // e.preventDefault();

    let findIndex = this.state.data
      .map((elem) => {
        return elem.ID;
      })
      .indexOf(Number(e.target.id));

    // console.log(findIndex);
    let compTask = [...this.state.data];
    let newObj = compTask.slice(findIndex, findIndex + 1);

    newObj[0].isComplete = 1; //toggle true after completion
    // console.log(newObj[0]);
    console.log(e.target.classList[1]);
    Axios.put("http://localhost:3001/api/updateComp", newObj[0]).then(() => {
      console.log("successful");
    });
    //destructure slice(takes target object out of the array)
    let [destructuredObj] = newObj;
    //complete task after click
    let deleteTask = [...this.state.data];
    deleteTask.splice(findIndex, 1);
    this.setState({
      compData: [...this.state.compData, destructuredObj],
      data: deleteTask,
    });

    //   let hideBtn = document.getElementsByClassName(e.target.classList[1]);
  }

  componentDidMount() {
    //fetch from DB
    Axios.get("http://localhost:3001/api/getAll").then((response) => {
      console.log(response.data.length);
      let currentLength = response.data.length;
      this.setState({
        data: response.data,
        idCount: currentLength + 1,
      });
    });

    Axios.get("http://localhost:3001/api/getComp").then((response) => {
      this.setState({
        compData: response.data,
      });
    });
  }

  render() {
    let formattedData = this.state.data.map(
      (elem) => {
        if (elem.isComplete === 0) {
          return (
            <TodoFormat
              propID={elem.ID}
              propTask={elem.Task}
              // propDuedate={elem.dueDate}
              // propMonth={elem.month}
              deleteTask={this.onDeleteHandler}
              compTask={this.onCompleteHandler}
              propComplete={elem.isComplete}
            />
          );
        }
      }
      // console.log(elem.isComplete)
    );

    let completedSide = this.state.compData.map((elem) => (
      <TodoFormat
        propID={elem.ID}
        propTask={elem.Task}
        // propComplete={elem.isComplete}
        deleteTask={this.onDeleteHandler}

        // propDuedate={elem.dueDate}
        // propMonth={elem.month}
        // propComplete={elem.isComplete}
      />
    ));

    return (
      <Container id="containerID">
        <Row>
          <Col>
            <div id="todoID">
              <h1>To Do App</h1>
              {/* <Button variant="primary">Button #1</Button> */}
              {/* moment in progress */}
              {/* <Moment format="YYYY/MM/DD HH:mm:ss">
                {this.state.dateToFormat}
              </Moment> */}
              <form class="row formContainer">
                <input
                  className="col-9"
                  type="text"
                  placeholder="Enter task"
                  value={this.state.inputValue}
                  onChange={this.handleChange}
                ></input>
                <button
                  class="col-3 btn btn-primary submitBTN"
                  onClick={this.updateList}
                >
                  Add
                </button>
              </form>
              {formattedData}
            </div>
          </Col>
          <Col>
            <div id="completedSide">
              <h1>Completed Tasks</h1>
              {completedSide}
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Todo;
