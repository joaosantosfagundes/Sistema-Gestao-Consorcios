import Entity from "./entity.js";

export default class PagamentoEntity extends Entity{
    
    #id;
    #cotaId;
    #assembleiaId;
    #status;
    #dataGeracao;
    #dataPagamento;
    #valor;

    get id(){
        return this.#id;
    }

    set id(value){
        this.#id = value;
    }

    get cotaId(){
        return this.#cotaId;
    }

    set cotaId(value){
        this.#cotaId = value;
    }

    get assembleiaId(){
        return this.#assembleiaId;
    }

    set assembleiaId(value){
        this.#assembleiaId = value;
    }

    get status(){
        return this.#status;
    }

    set status(value){
        this.#status = value;
    }

    get dataGeracao(){
        return this.#dataGeracao;
    }

    set dataGeracao(value){
        this.#dataGeracao = value;
    }

    get dataPagamento(){
        return this.#dataPagamento;
    }

    set dataPagamento(value){
        this.#dataPagamento = value;
    }

    get valor(){
        return this.#valor;
    }

    set valor(value){
        this.#valor = value;
    }

    constructor(id, cotaId, assembleiaId, status, dataGeracao, dataPagamento, valor){
        super();
        this.#id = id;
        this.#cotaId = cotaId;
        this.#assembleiaId = assembleiaId;
        this.#status = status;
        this.#dataGeracao = dataGeracao;
        this.#dataPagamento = dataPagamento;
        this.#valor = valor;
    }

    static toMap(row){
        return new PagamentoEntity(
            row["pag_id"],
            row["cot_id"],
            row["ass_id"],
            row["pag_status"],
            row["pag_datageracao"],
            row["pag_datapagamento"],
            row["pag_valor"]
        );
    }
}