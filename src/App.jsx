import { useState } from "react";
import Home from "./components/Home";
import ComplaintForm from "./components/ComplaintForm";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      {page === "home" && (
        <Home
          onComplaint={() => setPage("complaint")}
          onExit={() => alert("Exit flow coming next")}
          onAdmin={() => setPage("admin")}
        />
      )}

      {page === "complaint" && (
        <ComplaintForm onBack={() => setPage("home")} />
      )}

      {page === "admin" && (
        <AdminDashboard onBack={() => setPage("home")} />
      )}
    </>
  );
}

export default App;
