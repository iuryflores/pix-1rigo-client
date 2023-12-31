import React, { useState } from "react";
import logo1RIGO2 from "../imgs/logo.png";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import QRCode from "qrcode.react";

import api from "../utils/api.utils";
import FormConsulta from "../components/FormConsulta";

const Consulta = ({
  calculateExpirationDate,
  formatCPF,
  formatCurrency,
  checkPixStatus,
}) => {
  const [show, setShow] = useState(true);
  const [dataAPI, setDataAPI] = useState();
  const [fullPIX, setFullPIX] = useState("");
  const [copied, setCopied] = useState(false);

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

  const [temPix, setTemPix] = useState(false);

  const [protocolo, setProtocolo] = useState("");
  const [senha, setSenha] = useState("");

  const [message, setMessage] = useState();

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPIX);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const handlePrint = () => {
    window.print();
  };

  const handleClick = (e) => {
    e.preventDefault();
    let urlConsulta = [
      `https://api-1rigoiania-go.sistemaasgard.com.br/api/public/site/acompanhamento/protocolo/${protocolo}/${senha}`,
      `https://api-1rigoiania-go.sistemaasgard.com.br/api/public/site/acompanhamento/certidao/${protocolo}/${senha}`,
      `https://api-1rigoiania-go.sistemaasgard.com.br/api/public/site/acompanhamento/orcamento/${protocolo}/${senha}`,
      `https://api-1rigoiania-go.sistemaasgard.com.br/api/public/site/acompanhamento/orcamento-certidao/${protocolo}/${senha}`,
    ];
    function fetchData() {
      return new Promise((resolve, reject) => {
        const fetchNextUrl = (index) => {
          if (index >= urlConsulta.length) {
            reject(new Error("All URLs failed"));
            return;
          }

          fetch(urlConsulta[index])
            .then((response) => {
              if (response.ok) {
                resolve(response.json());
              } else {
                fetchNextUrl(index + 1); // Try next URL
              }
            })
            .catch(() => {
              fetchNextUrl(index + 1); // Try next URL
            });
        };

        fetchNextUrl(0);
      });
    }
    try {
      if (protocolo !== "" || senha !== "") {
        fetchData()
          .then((data) => {
            setShow(false);
            setDataAPI(data);
          })
          .catch((error) => {
            setMessage("Protocolo ou senha inválidos!");
            console.error(error);
          });
      }
    } catch (error) {
      setDataAPI("Error");
    }
  };

  const gerarPix = async () => {
    try {
      await api.gerarCobranca();
      setTemPix(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {show && (
        <>
          <Navbar show={show} setShow={setShow} />
          <Footer show={show} setShow={setShow} />
        </>
      )}
      <section>
        <div className="container col-lg-12 col-md-12 col-sm-12">
          <div className="row">
            {show && (
              <FormConsulta
                handleClick={handleClick}
                protocolo={protocolo}
                setProtocolo={setProtocolo}
                senha={senha}
                setSenha={setSenha}
                message={message}
              />
            )}
          </div>
        </div>
        {dataAPI !== "Error" && dataAPI !== "" && dataAPI ? (
          <>
            <div id="referencia-consulta" className="mt-3">
              <div id="retorno-consulta" className="mb-3">
                <div id="dados-consulta">
                  <div className="row">
                    <div
                      id="print"
                      className=" col-lg-12 col-md-12 col-sm-12 d-flex flex-column align-items-center"
                    >
                      {show && (
                        <div className="title-form p-1 w-100">
                          {dataAPI?.titulo?.toUpperCase().trim()} n.{" "}
                          {dataAPI.codigo}{" "}
                          {dataAPI.tipoCadastro === "ARISP" ? (
                            <span
                              style={{
                                fontSize: "0.8rem",
                                backgroundColor: "white",
                              }}
                              className="btn btn1 btn-\info"
                            >
                              E-PROTOCOLO ONR
                            </span>
                          ) : null}
                        </div>
                      )}
                      <div className="p-3 w-100">
                        <img
                          src={logo1RIGO2}
                          alt="Logo"
                          className="logo_print"
                        />
                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                          }}
                        >
                          <strong>IGOR FRANÇA GUEDES</strong>
                          <span className="chavePix">
                            CHAVE PIX (CPF): 03435703431
                          </span>
                        </p>

                        <div
                          style={{
                            backgroundColor: "black",
                            color: "white",
                            borderRadius: "5px",
                            padding: "5px",
                          }}
                        >
                          <strong className="upper">
                            {dataAPI?.titulo?.toUpperCase().trim()}:{" "}
                            <span className="cap">{dataAPI.codigo}</span>
                          </strong>
                        </div>
                        <div>
                          <strong className="upper">Solicitante: </strong>
                          <span className="cap">
                            {dataAPI?.solicitante?.toLowerCase().trim()}
                          </span>
                        </div>
                        <div>
                          <strong className="upper">Interessado: </strong>
                          <span className="cap">
                            {dataAPI?.interessado?.toLowerCase().trim()}
                          </span>
                        </div>

                        <div>
                          <strong className="upper">
                            Valor total do protocolo:{" "}
                          </strong>
                          <span className="cap">R$ {dataAPI.total}</span>
                        </div>
                        {dataAPI.saldo <= 0 ? (
                          <div className="d-flex flex-column align-items-center">
                            <p>
                              <strong className="upper">
                                Valor a ser pago via PIX:{" "}
                              </strong>
                              <span className="cap">
                                R$ {dataAPI.saldo * -1}
                              </span>
                            </p>
                            <button
                              onClick={gerarPix}
                              className="btn btn-primary"
                            >
                              Gerar PIX
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
                                      <tr
                                        key={index}
                                        style={{ verticalAlign: "middle" }}
                                      >
                                        <td>
                                          {new Date(
                                            pix.calendario.criacao
                                          ).toLocaleDateString("pt-br", {
                                            day: "numeric",
                                            month: "numeric",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                          })}
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
                                        <td>
                                          {formatCurrency(pix.valor.original)}
                                        </td>
                                        <td>{pix.vencido}</td>
                                        <td>
                                          {pix.vencido !== "Vencido" && (
                                            <i
                                              className="bi bi-qr-code btn btn-outline-success fs-5"
                                              onClick={() => {
                                                // Lógica para gerar QRCode com base no atributo brcode do item
                                                generateQRCode(
                                                  pix && pix.brcode
                                                );
                                              }}
                                            ></i>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                            {temPix && (
                              <>
                                <div>
                                  {selectedBrcode && (
                                    <>
                                      <h2>QRCode Gerado</h2>
                                      <QRCode value={selectedBrcode} />
                                    </>
                                  )}
                                </div>

                                <>
                                  <button
                                    className="btn btn-outline-info"
                                    onClick={handleCopy}
                                  >
                                    <i className="bi bi-clipboard"></i> Copiar
                                    QRCode
                                  </button>

                                  {copied && <p>QRCode copiado!</p>}
                                </>

                                <div className="d-flex">
                                  <button
                                    type="submit"
                                    className="btn btn-warning mt-3  mb-5"
                                    onClick={handlePrint}
                                  >
                                    IMPRIMIR{" "}
                                    <i className="fa fa-spinner fa-spin"></i>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="d-flex w-100 justify-content-center">
                            <span className="btn btn-outline-danger">
                              Nada a receber
                            </span>
                          </div>
                        )}
                      </div>
                      <div style={{ marginBottom: "150px" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </>
  );
};

export default Consulta;
