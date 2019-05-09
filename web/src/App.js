import React from "react";
import Todos from "./Todos";

function App() {
  return (
    <div style={{ margin: "auto", width: 500 }}>
      <h1 style={{ textAlign: "center" }}>Todo app</h1>
      <div style={{ border: "1px solid red", padding: 16 }}>
        <Todos />
      </div>
    </div>
  );
}

export default App;
