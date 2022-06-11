class Todo{
    static url = 'todos'
    #todos = []
    #currentTodo = null
    #currentTodoE = null
    #todoContainerEl = null
    #editE = null
    #editTitle = null
    #editBody = null
    http = null

    #CLASSES = {
        todoComplete: 'todo-complete',
        itemActive:'item-active',
        showEdit:'show-edit',
        hideCompleteBut:'hide-element',
        close: 'close',
        complete: 'complete_btn',
        todoList: 'todos_container'

    }
    constructor(el,editEl) {
        this.#todoContainerEl = el
        this.#editE = editEl
        this.init()
    }
    init(){
        this.http = new Http(Todo.url) // создаем экземпляр класса Http
        this.#editTitle = this.#editE.querySelector('.edit_title')
        this.#editBody = this.#editE.querySelector('.edit_body')
        this.addListeners()
        this.getTodos()

    }
    addListeners(){
        this.#todoContainerEl.addEventListener('click', this.onTodoClick)
        this.#editE
            .querySelector('.save_btn')
            .addEventListener('click', this.onSaveClick)
    }

    getTodos(){                  // отображать список тудушек
        this.http.getAll().then(data => {
            this.#todos = data
            this.renderTodos(this.#todos)
        })
    }
    // нужно достать контейнер куда будем сетит все тудушки
    renderTodos(todos){
        this.#todoContainerEl.innerHTML = todos
            .map((t) => this.createTodoElement(t))
            .join('') // join - преобразует массив в строку

    }
    createTodoElement(todo){       // метод принимает 1 туду и отображает ее.
        return `<div class="item ${todo.isComplete ? this.#CLASSES.todoComplete : ''}" id="${todo.id}">
            <div class="item_content">
                <div>
                    <div class="item_title">${todo.title}</div>
                    <div class="item_body">${todo.body}</div>
                </div>
                <div>${this.createDate(todo.createDate)}</div>
            </div>
            <div class="item_action">
                <div class="close">x</div>
                <button class="complete_btn ${todo.isComplete ? this.#CLASSES.hideCompleteBut : ''}">Complete</button>
            </div>
        </div>`
    }
    createDate(date){
     const newDate = moment(date).format('DD-MM-YYYY')
        return newDate
    }
    onTodoClick = (el) => {
        const target = el.target
        this.#currentTodoE = el.target.closest('.item')  //Метод Element.closest() возвращает ближайший родительский элемент (или сам элемент), который соответствует заданному CSS-селектору или null, если таковых элементов вообще нет.
        if(this.#currentTodoE){
            this.#currentTodo = this.#todos.find((e) => e.id === this.#currentTodoE.id)
        }

        if (el.target.classList.contains(this.#CLASSES.close)){
            console.log('delete')
            this.removeTodo(this.#currentTodo.id)
            return
        }
        if (el.target.classList.contains(this.#CLASSES.complete)){
            console.log('complete')
            this.completeTodo(this.#currentTodo)
            return
        }
        if (!el.target.classList.contains(this.#CLASSES.todoList)){
            console.log('edit')
            this.editTodo()

        }
    }
    removeTodo(id){  // метод удаление тудухи
        this.http.delete(id).then(response =>{
            if(response.deletedCount >= 1){   //возможность удалить несколько тудушек
                this.#todos = this.#todos.filter(t => t.id !== id) // возвращаем те тудухи у которых id не равен id удаленных
                this.#currentTodoE.remove()
                this.clearData()
            }
        })
    }
    editTodo(){
        this.#editE.classList.add(this.#CLASSES.showEdit)
        this.#currentTodoE.classList.add(this.#CLASSES.itemActive)
        this.#editTitle.value = this.#currentTodo.title
        this.#editBody.value = this.#currentTodo.body


    }
    completeTodo(todo){
        todo.isComplete = true
        this.http.update(todo.id,todo).then((r) =>{
            this.#currentTodoE.classList.add(this.#CLASSES.todoComplete)
            this.clearData()
        })

    }
    createTodo (title,body){
        const todo = {
            title,
            body,
            isComplete: false,
                   }
        this.http.create(todo).then(response =>{
            if(response && response.id){
                this.#todos.unshift(response) //Метод unshift() добавляет один или более элементов в начало массива и возвращает новую длину массива.
                const content = this.createTodoElement(response)
                this.#todoContainerEl.insertAdjacentHTML('afterbegin',content) // метод встаки строки с HTML тегами, сразу после открывающего тега
            }
        })
        cleaning()
    }
        clearData(){
            this.#currentTodoE = null
            this.#currentTodo = null
        }
        onSaveClick = () => {
        this.#currentTodo.title = this.#editTitle.value
        this.#currentTodo.body = this.#editBody.value
        this.http.update(this.#currentTodo.id,this.#currentTodo)
                .then((r) => {
                    if(r &&r.id){
                        this.#currentTodoE.querySelector('.item_title').innerHTML = r.title
                        this.#currentTodoE.querySelector('.item_body').innerHTML = r.body
                        this.#editE.classList.remove(this.#CLASSES.showEdit)
                        this.#currentTodoE.classList.remove(this.#CLASSES.itemActive)
                        this.clearData()
                    }
                })

        }
}