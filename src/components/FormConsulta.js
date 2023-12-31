import React from "react";

const FormConsulta = ({
  handleClick,
  protocolo,
  setProtocolo,
  senha,
  setSenha,
  message,
}) => {
  setProtocolo(892511);
  setSenha(96999870);
  return (
    <div className="col">
      <div className="title-form">PROTOCOLO/CERTIDÃO/ORÇAMENTO</div>
      <form
        className="container form-servicos"
        autoComplete="nope"
        onSubmit={handleClick}
      >
        <div className="form-group mt-3">
          <label htmlFor="numero">Número</label>
          <input
            type="number"
            className="form-control"
            id="numero"
            aria-describedby="Numero"
            placeholder=""
            value={protocolo}
            onChange={(e) => setProtocolo(e.target.value)}
          />
        </div>

        <div className="form-group mt-3">
          <label>Senha</label>
          <input
            type="password"
            className="form-control"
            id="senha"
            autoComplete="false"
            aria-describedby="Senha"
            placeholder=""
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        {message ? (
          <div className="alert alert-danger mt-3 ">{message}</div>
        ) : null}
        <div className="d-flex w-100 justify-content-around mt-3">
          <button type="submit" className="btn btn-info m-1">
            GERAR QRCODE <i className="fa fa-spinner fa-spin"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormConsulta;
