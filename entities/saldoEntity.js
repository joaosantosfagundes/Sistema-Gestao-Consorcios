import Entity from "./entity.js";

export default class SaldoConsorcioEntity extends Entity{
    
    #id;
    #consorcioId;
    #valor;
    #dataAtualizacao;

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

    get valor(){
        return this.#valor;
    }

    set valor(value){
        this.#valor = value;
    }

    get dataAtualizacao(){
        return this.#dataAtualizacao;
    }

    set dataAtualizacao(value){
        this.#dataAtualizacao = value;
    }

    constructor(id, consorcioId, valor, dataAtualizacao){
        super();
        this.#id = id;
        this.#consorcioId = consorcioId;
        this.#valor = valor;
        this.#dataAtualizacao = dataAtualizacao;
    }

    static toMap(row){
        return new SaldoConsorcioEntity(
            row["sal_id"],
            row["con_id"],
            row["sal_valor"],
            row["sal_dataatualizacao"]
        );
    }
}