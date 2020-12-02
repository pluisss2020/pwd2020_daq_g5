// useState es un hook para poder utilizar y cambiar states en un componente funcional
// useEffect es un hook que realiza un callback cuando un State cambia de valor o es modificado
import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
import userContext from "./context/userContext";
import Header from "./components/layouts/header.component";
import Home from "./components/pages/home.component";
import Login from "./components/auth/login.component";
import Register from "./components/auth/register.component";

import "./style.css";

export default function App() {
  // [userData] representa el nombre de la variable, y [setUserData] es el valor de inicializacion
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });


  useEffect(() => {
    // Utilizaremos una funcion async ya que llamar a la API para datos es un proceso asincrono
    const checkLoggedIn = async () => {
      // Obtiene el token guardado en el localStorage, se puede ver en inspeccionar elemento y en la pestania application.
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        // Si no existe el token solicitado arriba, crea una instancia vacia para no crear errores.
        localStorage.setItem("auth-token", "");
        token = "";
      }

      const tokenRes = await Axios.post(
        "http://localhost:5000/users/tokenIsValid", // url donde realizar la peticion
        null, // body a enviar, en este caso no se envia nada asi que es null
        {
          headers: { "x-auth-token": token }, // envia el header con el token del localStorage
        }
      );

      // si existe tokenRes.data(data es el json de respuesta de axios), ejecuta el siguiente bloque
      if (tokenRes.data) {
        const userRes = await Axios.get("http://localhost:5000/users/", {
          headers: {
            "x-auth-token": token,
          },
        });
        // Modifica los valores de token y user para otorgar los nuevos valores de login
        setUserData({
          token,
          user: userRes.data,
        });
      } else {
        localStorage.setItem("auth-token", "");
        token = "";
      }
    };

    checkLoggedIn();
  }, []); // Al tener un array vacio, se ejecuta una vez al inicio. Quiere decir que esta funcion se ejecuta una vez al inicar la aplicaicon

  return (
    <>
      <BrowserRouter>
        {/* 
            userContext permite otorgarle variables globales a los componentes dentro de userContext.
            En este caso otorga un objeto { userData, setUserData }.
        */}
        <userContext.Provider value={{ userData, setUserData }}>
          <Header />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              {/* La ruta de 404 se mostrara solamente cuando ingresemos una ruta no establecida o erronea */}
              <Route render={() => <h1>404: page not found</h1>} />
            </Switch>
          </div>
        </userContext.Provider>
      </BrowserRouter>
    </>
  );
}
