import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import JobList from "./assets/components/JobList";
import JobDetail from "./assets/components/JobDetail";
import JobForm from "./assets/components/JobForm";
//import UpdateJob from "./assets/components/UpdateJob";
import JobListWithAdminControls from "./assets/components/JobListWithAdminControls";
import ProtectedRoute from "./assets/components/ProtectedRoute";
import Login from "./assets/components/Login";

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route
          path="/post-job"
          element={
            <ProtectedRoute>
              <JobForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-job/:id"
          element={
            <ProtectedRoute>
              <JobForm />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <JobListWithAdminControls />
            </ProtectedRoute>
          } // Use element prop here
        />
      </Routes>
    </Router>
  );
}

export default App;
