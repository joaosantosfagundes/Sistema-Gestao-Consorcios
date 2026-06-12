import Entity from "./entity.js";

export default class AssembleiaEntity extends Entity{
    
    #id;
    #numero;
    #consorcioId;
    #data;
    #cotaId;

    get id(){
        return this.#id;
    }

    set id(value){
        this.#id = value;
    }

    get numero(){
        return this.#numero;
    }

    set numero(value){
        this.#numero = value;
    }

    get consorcioId(){
        return this.#consorcioId;
    }

    set consorcioId(value){
        this.#consorcioId = value;
    }

    get data(){
        return this.#data;
    }

    set data(value){
        this.#data = value;
    }

    get cotaId(){
        return this.#cotaId;
    }

    set cotaId(value){
        this.#cotaId = value;
    }

    constructor(id, numero, consorcioId, data, cotaId){
        super();
        this.#id = id;
        this.#numero = numero;
        this.#consorcioId = consorcioId;
        this.#data = data;
        this.#cotaId = cotaId;
    }

    static toMap(row){
        return new AssembleiaEntity(
            row["ass_id"],
            row["ass_numero"],
            row["con_id"],
            row["ass_data"],
            row["cot_id"]
        );
    }
}