const BASE_URL = "http://localhost:5000/";
import toast from 'react-hot-toast';

export default class ApiClient {


    static async get(endpoint) {
        let response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "GET",
            credentials: "include"
        })
        //chama a checagem da resposta;
        return await this.checarResposta(response);
    }

    static async post(endpoint, body) {
        let response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        //faz a checagem da resposta
        //response.ok ?
        //desseraliza o corpo da resposta.
        return await this.checarResposta(response);
    }

    static async put(endpoint, body) {
        let response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "PUT",
            credentials: 'include',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(body)
        })

        return await this.checarResposta(response);
    }

     static async delete(endpoint) {
        let response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "DELETE",
            credentials: 'include'
        })

        return await this.checarResposta(response);
    }

    static async postFormData(endpoint, formData) {
        let response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            credentials: "include",
            body: formData
        })
        return await this.checarResposta(response);
    }

    static async putFormData(endpoint, formData) {
        let response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "PUT",
            credentials: "include",
            body: formData
        })
        return await this.checarResposta(response);
    }

    static async checarResposta(response) {
        if(response.ok) {
            let json = await response.json();

            return json;
        }
        else {
            if(response.status != 404 && response.status != 401) {
                let json = await response.json();
                toast.error(json.msg);
            }
        }
    }
    
}