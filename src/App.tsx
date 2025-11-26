import { BrowserRouter, Routes, Route } from "react-router-dom";
import DocumentoVehiculo from "./vehicle";
import FormularioVehiculo from "./FormularioVehiculo";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:id/" element={<DocumentoVehiculo />} />
        <Route path="/c/cppp.aspx" element={<DocumentoVehiculo />} />
        <Route path="/" element={<Login />} />
        <Route
          path="/admin/AgregarNuevoVehiculo"
          element={
            <ProtectedRoute>
              <FormularioVehiculo />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
