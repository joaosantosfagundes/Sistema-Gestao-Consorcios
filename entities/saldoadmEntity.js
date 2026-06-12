import Entity from "./entity.js";

export default class SaldoAdministradorEntity extends Entity{
    
    #id;
    #usuarioId;
    #valor;
    #dataAtualizacao;

    get id(){
        return this.#id;
    }

    set id(value){
        this.#id = value;
    }

    get usuarioId(){
        return this.#usuarioId;
    }

    set usuarioId(value){
        this.#usuarioId = value;
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

    constructor(id, usuarioId, valor, dataAtualizacao){
        super();
        this.#id = id;
        this.#usuarioId = usuarioId;
        this.#valor = valor;
        this.#dataAtualizacao = dataAtualizacao;
    }

    static toMap(row){
        return new SaldoAdministradorEntity(
            row["sad_id"],
            row["usu_id"],
            row["sad_valor"],
            row["sad_dataatualizacao"]
        );
    }
}