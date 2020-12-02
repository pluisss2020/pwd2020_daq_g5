/*
    useContext permite utilizar las variables globales que tiene asignada el userContext en app.js
*/
import React, { useContext, useState } from "react";
/* useHistory es un React Hook
 * Un hook es una funcion que te permite
 * usar state y mas funciones de React sin necesidad
 * de escribir una clase
 */
import { useHistory } from "react-router-dom";
import userContext from "../../context/userContext";

export default function AuthOptions() {
  // permite la utilizacion de las variables de userContext
  const { userData, setUserData } = useContext(userContext);
  const [value, setValue] = useState();

  const history = useHistory();
  const register = () => history.push("/register"); // Redirecciona hacia la seccion de register
  const login = () => history.push("/login");
  const logout = () => {
    // Esta funcion vacia los valores de las variables que se utiliza para comprobar que hay
    // Un usuario conectado.
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
  };

  const refresh = () => {
    setValue({});
  };

  function checkRole() {
    if (userData.user && userData.user.role === "ADMIN") {
      return (
        <nav className="auth-options">
          {/* Si existe un usuario logeado, muestra el boton logout. Si no existe un usuario logeado muestra otros botones */}
          <>
            {" "}
            <button onClick={refresh}>Refresh SideBar</button>
            <button onClick={register}>Register a user</button>{" "}
            <button onClick={logout}>Log out</button>
          </>
        </nav>
      );
    }
    if (userData.user) {
      return (
        <nav className="auth-options">
          {/* Si existe un usuario logeado, muestra el boton logout. Si no existe un usuario logeado muestra otros botones */}
          <>
            <button onClick={refresh}>Refresh SideBar</button>
            <button onClick={logout}>Log out</button>
          </>
        </nav>
      );
    }
    if (!userData.user) {
      return (
        <nav className="auth-options">
          {/* Si existe un usuario logeado, muestra el boton logout. Si no existe un usuario logeado muestra otros botones */}
          <>
            {" "}
            <button onClick={refresh}>Refresh SideBar</button>
            <button onClick={login}>Log in</button>
          </>
        </nav>
      );
    }
  }

  return <>{checkRole()}</>;
}
