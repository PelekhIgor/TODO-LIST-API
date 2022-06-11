class Http{
    #endpoint = 'http://nestapi-env.eba-9kgvuxij.eu-central-1.elasticbeanstalk.com/'
    constructor(entity) {
        this.#endpoint += `${entity}/`
    }
    getAll(){
        return fetch(this.#endpoint).then((response) => response.json() ) // получить все сущности (массив всех тудушек)
    }
    getById(id){
        return fetch(this.#endpoint + id)  // получаем 1 сущность (по id получаем 1 тудушку)
    }
    update(id,item){
        return fetch(this.#endpoint + id, {  // изменяем тудушку
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(item),
        }).then((response) => response.json())
    }

    delete(id){
        return fetch(this.#endpoint + id, {  // удаляем тудушку
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json'
            },
        }).then((response) => response.json())
    }

    create(item){
        return fetch(this.#endpoint, {    // создаем тудушку
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(item),
        }).then((response) => response.json())
    }

}