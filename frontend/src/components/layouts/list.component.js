import React, { Component } from "react";
import axios from "axios";

// FUNCTIONAL REACT COMPONENT
const Values = (props) => (
  <tr>
    <td>{props.value.temperature}</td>
    <td>{props.value.humidity}</td>
    <td>{props.value.createdAt.substring(0, 10)}</td>
    <td>
      <button
        className="btn btn-danger"
        onClick={() => {
          props.deleteValue(props.value._id);
        }}
      >
        delete
      </button>
    </td>
    {/* Crea un boton que redirecciona a la ruta edit */}{" "}
    {/* Crea un boton que ejecuta el metodo deleteExercise que elimina el ejercicio */}
  </tr>
);

// CLASS COMPONENT
export default class ValuesList extends Component {
  constructor(props) {
    super(props);

    this.deleteValue = this.deleteValue.bind(this);

    // Contiene todos los ejercicios en un array
    this.state = { values: [] };
  }

  componentDidMount() {
    const token = localStorage.getItem("auth-token");

    setInterval(() => {
      // Obtiene la lista de valores
      axios
        .get("http://localhost:5000/values/last", {
          headers: {
            "x-auth-token": token,
          },
        })
        .then((response) => {
          this.setState({ values: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    }, 2000);
  }

  deleteValue(id) {
    // Elimina un valor por id
    axios
      .delete("http://localhost:5000/values/" + id)
      .then((res) => console.log(res.data));

    // Elimina el ejercicio/exercise del front end
    this.setState({
      values: this.state.values.filter((el) => el._id !== id), // Si el _id de la bd, es distinto al id ingresado
    });
  }

  valuesList() {
    return this.state.values.map((currentvalue) => {
      return (
        <Values
          value={currentvalue}
          deleteValue={this.deleteValue}
          key={currentvalue._id}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <h3>Last Values</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Temperature</th>
              <th>Humidity</th>
              <th>CreatedAt</th>
            </tr>
          </thead>
          <tbody>{this.valuesList()}</tbody>
        </table>
      </div>
    );
  }
}
