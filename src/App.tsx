import { Suspense } from "react";
import { Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/wrappers/ProtectedRoute";
import Success from "./pages/success";
import Home from "./pages/home";
import Form from "./pages/form";
function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute>
              <Dashboard />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/form"
            element={
              <Form />
            }
          />
          <Route
            path="/success"
            element={
              <Success />
            }
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense >
  );
}

export default App;
