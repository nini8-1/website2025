import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// 不要在這裡 import 任何不存在的 css 檔案
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);