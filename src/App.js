import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./views/HomePage";
import Consulta from "./views/Consulta";
import { useState } from "react";

function App() {
  const [pixData, setPixData] = useState({});
  const calculateExpirationDate = (creationDate, expirationInSeconds) => {
    const creationTimestamp = new Date(creationDate).getTime();
    const expirationTimestamp = creationTimestamp + expirationInSeconds * 1000; // Convertendo segundos para milissegundos
    return new Date(expirationTimestamp);
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  const formatCPF = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const checkPixStatus = (pixData) => {
    const currentDate = new Date();
    if (pixData && pixData.cobs) {
      const updatedPixList = pixData.cobs.map((pix) => {
        const expirationDate = calculateExpirationDate(
          pix.calendario.criacao,
          pix.calendario.expiracao
        );

        if (currentDate > expirationDate) {
          // PIX vencido
          return { ...pix, vencido: "Vencido" };
        } else {
          // PIX não vencido
          return { ...pix, vencido: "Ativo" };
        }
      });
      setPixData((prevPixData) => ({ ...prevPixData, cobs: updatedPixList }));
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              calculateExpirationDate={calculateExpirationDate}
              formatCurrency={formatCurrency}
              formatCPF={formatCPF}
            />
          }
        />
        <Route
          path="/consulta/"
          element={
            <Consulta
              calculateExpirationDate={calculateExpirationDate}
              formatCurrency={formatCurrency}
              formatCPF={formatCPF}
              pixData={pixData}
              checkPixStatus={checkPixStatus}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
