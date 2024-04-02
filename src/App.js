import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Engine from "./Engine";
import ErrorPage from "./Error";

const router = createBrowserRouter([
  { path: "/", element: <Engine />,  errorElement: <ErrorPage />,
  children: [
    // { index: true, element: <Index /> },
    {
      path: "/search",
      element: <Engine />,
  },
  ]
},  

  
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
