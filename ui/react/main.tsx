import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import store from "./app/store"
import App from "./App"
import Home from "./features/home/Home"
import Excerpts from "./features/excerpts/Excerpts"
import About from "./features/about/About"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />
      },
      {
        path: "/excerpts",
        element: <Excerpts />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ]
  }
]);

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
