import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import userContext from "../../context/userContext";
import ErrorNotice from "../misc/ErrorNotice.component";
import SuccessNotice from "../misc/SuccessNotice.component";

export default function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordCheck, setPasswordCheck] = useState();
  const [displayName, setDisplayName] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const { userData } = useContext(userContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();

    try {
      // Guarda los campos ingresados en los inputs dentro de un nuevo objeto llamado newUser
      const newUser = { email, password, passwordCheck, displayName };
      await Axios.post("http://localhost:5000/users/register", newUser); // Registra al usuario

      setSuccess("User succesfully registered!!");

      // // Logea al usuario si es que el registro no fallo
      // const loginRes = await Axios.post("http://localhost:5000/users/login", {
      //   email,
      //   password,
      // });

      // setUserData({
      //   token: loginRes.data.token,
      //   user: loginRes.data.user,
      // });

      // localStorage.setItem("auth-token", loginRes.data.token);
      // history.push("/");
    } catch (err) {
      // Si existe algun error en la HTTP request, guarda el mensaje de respuesta en la variable error, instanciada con setError()
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  function checkRole() {
    if (!userData.user || !userData.user.role === "ADMIN" ) {
      history.push("/");
    }
  }

  return (
    <div className="page">
      {checkRole()}
      <h2>Register</h2>
      {/* Mensaje de error */}
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      {success && (
        <SuccessNotice
          message={success}
          clearError={() => setSuccess(undefined)}
        />
      )}
      <form className="form" onSubmit={submit}>
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Verify Password"
          onChange={(e) => setPasswordCheck(e.target.value)}
        />

        <label htmlFor="register-display-name">Display name</label>
        <input
          id="register-display-name"
          type="text"
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <input type="submit" value="Register" />
      </form>
      {/* <div>
        <ListUsers />
      </div> */}
    </div>
  );
}
