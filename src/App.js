import React, { useState, useEffect, useReducer, useContext } from "react";
import appContext from "./appContext";
import { getUsers } from "./api";

import "./App.css";

export function useWindowWidth() {
  const { window } = useContext(appContext);
  const [windowWidth, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => {
      console.debug("--- called handler", window);
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handler);
    console.debug("--- subscribed to event", window);
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);
  return windowWidth;
}

export function useUsers() {
  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [reloadTrigger, reloadUsers] = useReducer(() => ({}));
  useEffect(
    () => {
      console.debug("--- effect triggerred");
      (async () => {
        setLoading(true);
        setUsers([]);
        try {
          setUsers(await getUsers());
        } finally {
          console.debug("--- effect completed");
          setLoading(false);
        }
      })();
    },
    [reloadTrigger],
  );

  return { isLoading, users, reloadUsers };
}

function App() {
  const windowWidth = useWindowWidth();
  const { isLoading, users, reloadUsers } = useUsers();
  return (
    <div>
      <h1>Window width {windowWidth} </h1>
      <button onClick={reloadUsers}>Reload users</button>
      {isLoading ? (
        <p>loading...</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
