import React, { Component } from "react";
import axios from "axios";

// FUNCTIONAL REACT COMPONENT
const Users = (props) => (
  <tr>
    <td>{props.user.id}</td>
    <td>{props.user.user}</td>
    <td>{props.user.email}</td>
    <td>{props.user.role}</td>
    <td>{props.user.createdAt.substring(0, 10)}</td>
    <td>
      <button
        className="btn btn-danger"
        onClick={() => {
          props.deleteUser(props.user._id);
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
export default class UsersList extends Component {
  constructor(props) {
    super(props);

    this.deleteUser = this.deleteUser.bind(this);

    // Contiene todos los ejercicios en un array
    this.state = { users: [] };
  }

  componentDidMount() {
    const token = localStorage.getItem("auth-token");

    // Obtiene la lista de valores
    axios
      .get("http://localhost:5000/users/all", {
        headers: {
          "x-auth-token": token,
        },
      })
      .then((response) => {
        this.setState({ users: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteUser(id) {
    // Elimina un valor por id
    axios
      .delete("http://localhost:5000/users/" + id)
      .then((res) => console.log(res.data));

    // Elimina el ejercicio/exercise del front end
    this.setState({
      users: this.state.users.filter((el) => el._id !== id), // Si el _id de la bd, es distinto al id ingresado
    });
  }

  usersList() {
    return this.state.users.map((currentvalue) => {
      return (
        <Users
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
        <h3>List of Users</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Usuario</th>
              <th>Humidity</th>
              <th>CreatedAt</th>
            </tr>
          </thead>
          <tbody>{this.usersList()}</tbody>
        </table>
      </div>
    );
  }
}
