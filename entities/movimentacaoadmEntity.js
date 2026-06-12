import Entity from "./entity.js";

export default class MovimentacaoAdministradorEntity extends Entity{
    
    #id;
    #usuarioId;
    #consorcioId;
    #pagamentoId;
    #tipo;
    #valor;
    #data;

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

    constructor(id, usuarioId, consorcioId, pagamentoId, tipo, valor, data){
        super();
        this.#id = id;
        this.#usuarioId = usuarioId;
        this.#consorcioId = consorcioId;
        this.#pagamentoId = pagamentoId;
        this.#tipo = tipo;
        this.#valor = valor;
        this.#data = data;
    }

    static toMap(row){
        return new MovimentacaoAdministradorEntity(
            row["mva_id"],
            row["usu_id"],
            row["con_id"],
            row["pag_id"],
            row["mva_tipo"],
            row["mva_valor"],
            row["mva_data"]
        );
    }
}