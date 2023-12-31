import React from "react";
import logoIury from "../imgs/iury.png";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer>
      <div>
        © 2022 - 2023 | 1º Registro de Imóveis de Goiânia-Go | Desenvolvido por{" "}
        <Link to="https://iuryflores.com.br/" target="_blank" rel="noreferrer">
          Iury Flores
        </Link>
      </div>
      <div>
        <img src={logoIury} alt="" />
      </div>
    </footer>
  );
};
