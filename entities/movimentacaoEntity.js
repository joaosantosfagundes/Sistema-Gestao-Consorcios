import Entity from "./entity.js";

export default class MovimentacaoConsorcioEntity extends Entity{
    
    #id;
    #consorcioId;
    #pagamentoId;
    #assembleiaId;
    #tipo;
    #valor;
    #data;

    get id(){
        return this.#id;
    }

    set id(value){
        this.#id = value;
    }

    get consorcioId(){
        return this.#consorcioId;
    }

    set consorcioId(value){
        this.#consorcioId = value;
    }

    get pagamentoId(){
        return this.#pagamentoId;
    }

    set pagamentoId(value){
        this.#pagamentoId = value;
    }

    get assembleiaId(){
        return this.#assembleiaId;
    }

    set assembleiaId(value){
        this.#assembleiaId = value;
    }

    get tipo(){
        return this.#tipo;
    }

    set tipo(value){
        this.#tipo = value;
    }

    get valor(){
        return this.#valor;
    }

    set valor(value){
        this.#valor = value;
    }

    get data(){
        return this.#data;
    }

    set data(value){
        this.#data = value;
    }

    constructor(id, consorcioId, pagamentoId, assembleiaId, tipo, valor, data){
        super();
        this.#id = id;
        this.#consorcioId = consorcioId;
        this.#pagamentoId = pagamentoId;
        this.#assembleiaId = assembleiaId;
        this.#tipo = tipo;
        this.#valor = valor;
        this.#data = data;
    }

    static toMap(row){
        return new MovimentacaoConsorcioEntity(
            row["mov_id"],
            row["con_id"],
            row["pag_id"],
            row["ass_id"],
            row["mov_tipo"],
            row["mov_valor"],
            row["mov_data"]
        );
    }
}