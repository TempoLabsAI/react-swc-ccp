import { Suspense } from "react";
import { Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import Dashboard from "./pages/dashboard";
import DashboardPaid from "./pages/dashboard-paid";
import Form from "./pages/form";
import Home from "./pages/home";
import NotSubscribed from "./pages/not-subscribed";
import Success from "./pages/success";
import ProtectedRoute from "./components/wrappers/ProtectedRoute";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />
          <Route
            path="/dashboard-paid"
            element={
              <ProtectedRoute>
                <DashboardPaid />
              </ProtectedRoute>
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
          <Route
            path="/not-subscribed"
            element={
              <NotSubscribed />
            }
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense >
  );
}

export default App;
