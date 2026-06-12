import Entity from "./entity.js";

export default class UsuarioEntity extends Entity{
    
    #id;
    #nome;
    #email;
    #senha;
    #ativo;

    get id(){
        return this.#id;
    }

    set id(value){
        this.#id = value;
    }

    get nome(){
        return this.#nome;
    }

    set nome(value){
        this.#nome = value;
    }

    get email(){
        return this.#email;
    }

    set email(value){
        this.#email = value;
    }

    get senha(){
        return this.#senha;
    }

    set senha(value){
        this.#senha = value;
    }

    get ativo(){
        return this.#ativo;
    }

    set ativo(value){
        this.#ativo = value;
    }

    constructor(id, nome, email, senha, ativo){
        super();
        this.#id = id;
        this.#nome = nome;
        this.#email = email;
        this.#senha = senha;
        this.#ativo = ativo;
    }

    static toMap(row){
        return new UsuarioEntity(
            row["usu_id"],
            row["usu_nome"],
            row["usu_email"],
            row["usu_senha"],
            row["usu_ativo"]
        );
    }

    validar() {
        if(this.#nome != null && this.#email != null && this.#email.includes("@")) {
            return true;
        }

        return false;
    }
}