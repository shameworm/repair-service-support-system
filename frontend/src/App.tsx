import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RootLayout } from "~/shared/pages/Root";
import { ErrorPage } from "~/shared/pages/Error";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
