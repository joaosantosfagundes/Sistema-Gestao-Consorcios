import Entity from "./entity.js";
import ConsorcioEntity from "./consorcioEntity.js";

export default class CotaEntity extends Entity{
    
    #id;
    #consorcioId;
    #usuarioId;
    #numero;
    #status;

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

    get usuarioId(){
        return this.#usuarioId;
    }

    set usuarioId(value){
        this.#usuarioId = value;
    }

    get numero(){
        return this.#numero;
    }

    set numero(value){
        this.#numero = value;
    }

    get status(){
        return this.#status;
    }

    set status(value){
        this.#status = value;
    }

    constructor(id, consorcioId, usuarioId, numero, status){
        super();
        this.#id = id;
        this.#consorcioId = consorcioId;
        this.#usuarioId = usuarioId;
        this.#numero = numero;
        this.#status = status;
    }

    static toMap(row) {
        let cota = new CotaEntity(
            row["cot_id"],
            new ConsorcioEntity(row["con_id"]),
            row["usu_id"],
            row["cot_numero"],
            row["cot_status"]
        );

        if (row["con_nome"] != null) {
            cota.consorcioId.nome = row["con_nome"];
        }

        return cota;
    }
}