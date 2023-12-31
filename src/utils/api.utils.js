import axios from "axios";

class Api {
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:9002",
    });
  }
  consultaCobranca = async () => {
    try {
      const { data } = await this.api.get("/v1/consultar-todos-pix/");
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  gerarCobranca = async (protocolo, valorPix) => {
    try {
      const { data } = await this.api.put(
        "/v1/gerar-pix/",
        protocolo,
        valorPix
      );
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
}
export default new Api();
