import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import api from "../utils/api.utils";

const HomePage = (
  checkPixStatus,
  calculateExpirationDate,
  formatCPF,
  formatCurrency
) => {
  const [pixData, setPixData] = useState({});
  const [selectedBrcode, setSelectedBrcode] = useState(null);

  const fetchPixList = async () => {
    try {
      const listaPix = await api.consultaCobranca();
      setPixData(listaPix);
      checkPixStatus(listaPix);
    } catch (error) {
      console.log(error);
    }
  };
  const generateQRCode = (brcode) => {
    if (brcode) {
      setSelectedBrcode(brcode);
    }
  };

  const gerarPix = async () => {
    try {
      await api.gerarCobranca();
      fetchPixList();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPixList();
      console.log("Checking!");
    }, 6000); // 60000 milissegundos = 1 minuto

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>Lista de PIX</h1>
      <button className="btn btn-primary" onClick={() => fetchPixList()}>
        Atualizar Lista
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>Criaçao</th>
            <th>Vencimento</th>
            <th>Devedor</th>
            <th>CPF/CNPJ</th>
            <th>Valor</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pixData.cobs &&
            pixData.cobs.map((pix, index) => {
              return (
                <tr key={index} style={{ verticalAlign: "middle" }}>
                  <td>
                    {new Date(pix.calendario.criacao).toLocaleDateString(
                      "pt-br",
                      {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      }
                    )}
                    h
                  </td>
                  <td>
                    {calculateExpirationDate(
                      pix.calendario.criacao,
                      pix.calendario.expiracao
                    ).toLocaleString("pt-br", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                    h
                  </td>
                  <td>{pix.devedor.nome}</td>
                  <td>{formatCPF(pix.devedor.cpf)}</td>
                  <td>{formatCurrency(pix.valor.original)}</td>
                  <td>{pix.vencido}</td>
                  <td>
                    {pix.vencido !== "Vencido" && (
                      <i
                        className="bi bi-qr-code btn btn-outline-success fs-5"
                        onClick={() => {
                          // Lógica para gerar QRCode com base no atributo brcode do item
                          generateQRCode(pix && pix.brcode);
                        }}
                      ></i>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <button className="btn btn-success" onClick={() => gerarPix()}>
        Gerar PIX
      </button>
      <div>
        {selectedBrcode && (
          <>
            <h2>QRCode Gerado</h2>
            <QRCode value={selectedBrcode} />
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
