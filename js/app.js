const todo = new Todo(document.querySelector('.todos_container'),
    document.querySelector('.edit-container'))
const titleEl = document.querySelector('.title')
const bodyEl = document.querySelector('.body')

document.querySelector('.create_btn')
    .addEventListener('click', () => // когда дойдет addEventListener в WEB API слушать click, пойдет вызов стрелочной функции которая из себя вызовет метод createTodo.
        todo.createTodo(titleEl.value, bodyEl.value))



function cleaning(){
    titleEl.value = ''
    bodyEl.value = ''
}
