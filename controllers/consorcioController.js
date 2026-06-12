import ConsorcioRepository from "../repositories/consorcioRepository.js";
import ConsorcioService from "../service/consorcioService.js";
import PagamentoService from "../service/pagamentoService.js";

export default class ConsorcioController {

    #repoConsorcio;
    #servConsorcio;

    constructor() {
        this.#repoConsorcio = new ConsorcioRepository();
        this.#servConsorcio = new ConsorcioService();
    }

    async listar(req, res) {
        try {
            const lista = await this.#repoConsorcio.listar();
            if (lista.length === 0)
                return res.status(404).json({ msg: "Nenhum consórcio encontrado" });

            return res.status(200).json(lista);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Erro ao processar requisição" });
        }
    }

    async listarPorUsuarioLogado(req, res) {
        try{
            const usuarioId = req.usuarioLogado.id;
            var lista = await this.#repoConsorcio.listarPorUsuarioLogado(usuarioId);
            if(lista.length == 0)
                return res.status(404).json({msg: "Nenhum consórcio encontrado"});

            return res.status(200).json(lista);
        }
        catch(error) {
            console.error(error);
            return res.status(500).json({msg: "Erro ao processar requisição"});
        }
    }

    async cadastrar(req, res) {
        const {
            nome,
            quantidadeCotas,
            valorPremio,
            taxaAdministracao,
            fundoReserva,
            diaAssembleia
        } = req.body;

        try {
          
            const usuarioId = req.usuarioLogado.id;

            const resultado = await this.#servConsorcio.cadastrarConsorcio({
                nome,
                quantidadeCotas,
                valorPremio,
                taxaAdministracao,
                fundoReserva,
                diaAssembleia,
                usuarioId  
            });

            return res.status(200).json({
                msg: "Consórcio cadastrado com sucesso!",
                ...resultado
            });

        } catch (erro) {
            console.log(erro);
            return res.status(500).json({
                msg: erro.message || "Erro durante o processo de cadastrar consórcio"
            });
        }
    }


    async listarPagamentosConsorcio(req,res){
        try{

            const { con_id } = req.params;

            const lista =
                await this.#servConsorcio.listarPagamentosConsorcio(con_id);

            res.json(lista);

        }catch(erro){

            console.log(erro);
            res.json({
                ok: false,
                msg: erro.message
            });
        }
    }
}
