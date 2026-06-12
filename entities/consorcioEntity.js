import Entity from "./entity.js";

export default class ConsorcioEntity extends Entity{
    
    #id;
    #nome;
    #usuarioId;
    #quantidadeCotas;
    #valorPremio;
    #taxaAdministracao;
    #fundoReserva;
    #valorMensal;
    #diaAssembleia;
    #dataInicio;
    #dataFim;
    #status;

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

    get usuarioId(){
        return this.#usuarioId;
    }

    set usuarioId(value){
        this.#usuarioId = value;
    }

    get quantidadeCotas(){
        return this.#quantidadeCotas;
    }

    set quantidadeCotas(value){
        this.#quantidadeCotas = value;
    }

    get valorPremio(){
        return this.#valorPremio;
    }

    set valorPremio(value){
        this.#valorPremio = value;
    }

    get taxaAdministracao(){
        return this.#taxaAdministracao;
    }

    set taxaAdministracao(value){
        this.#taxaAdministracao = value;
    }

    get fundoReserva(){
        return this.#fundoReserva;
    }

    set fundoReserva(value){
        this.#fundoReserva = value;
    }

    get valorMensal(){
        return this.#valorMensal;
    }

    set valorMensal(value){
        this.#valorMensal = value;
    }

    get diaAssembleia(){
        return this.#diaAssembleia;
    }

    set diaAssembleia(value){
        this.#diaAssembleia = value;
    }

    get dataInicio(){
        return this.#dataInicio;
    }

    set dataInicio(value){
        this.#dataInicio = value;
    }

    get dataFim(){
        return this.#dataFim;
    }

    set dataFim(value){
        this.#dataFim = value;
    }

    get status(){
        return this.#status;
    }

    set status(value){
        this.#status = value;
    }

    constructor(id, nome, usuarioId, quantidadeCotas, valorPremio,
        taxaAdministracao, fundoReserva, valorMensal,
        diaAssembleia, dataInicio, dataFim, status){

        super();
        this.#id = id;
        this.#nome = nome;
        this.#usuarioId = usuarioId;
        this.#quantidadeCotas = quantidadeCotas;
        this.#valorPremio = valorPremio;
        this.#taxaAdministracao = taxaAdministracao;
        this.#fundoReserva = fundoReserva;
        this.#valorMensal = valorMensal;
        this.#diaAssembleia = diaAssembleia;
        this.#dataInicio = dataInicio;
        this.#dataFim = dataFim;
        this.#status = status;
    }

    static toMap(row){
        return new ConsorcioEntity(
            row["con_id"],
            row["con_nome"],
            row["usu_id"],
            row["con_quantidadecotas"],
            row["con_valorpremio"],
            row["con_taxaadministracao"],
            row["con_fundoreserva"],
            row["con_valormensal"],
            row["con_diaassembleia"],
            row["con_datainicio"],
            row["con_datafim"],
            row["con_status"]
        );
    }

    validar() {
        const diaAtual = new Date().getDate();
        if (this.#nome != null && this.#nome.trim() !== "" && this.#quantidadeCotas > 0 && this.#valorPremio > 0 && 
        this.#taxaAdministracao > 0 && this.#fundoReserva > 0 && this.#diaAssembleia > 0 && this.#diaAssembleia <= diaAtual) {
            return true;
        }

        return false;
    }

}