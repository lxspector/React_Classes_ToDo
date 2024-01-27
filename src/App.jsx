import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, deleteTodo, updateTodo } from './todosActions'; // Импортируем actions для задач

const App = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos); // Получаем задачи из Redux store
  const [newTodoText, setNewTodoText] = useState('');
  const [editing, setEditing] = useState(null);
  const [editingText, setEditingText] = useState('');

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      dispatch(addTodo({ id: Date.now(), title: newTodoText }));
      setNewTodoText('');
    }
  };

  const handleUpdateTodo = (id, title) => {
    dispatch(updateTodo({ id, title }));
    setEditing(null);
  };
  return (
    <div className="app">
      <h1>Todo List</h1>
      {/* Блок добавления новой задачи */}
      <input
        type="text"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
        placeholder="Add new todo"
      />
      <button onClick={handleAddTodo}>Add</button>

      {/* Здесь могут быть компоненты для поиска и сортировки, которые будут работать с Redux */}

      {/* Список задач */}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {editing === todo.id ? (
              <>
                {/* Редактирование задачи */}
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => handleUpdateTodo(todo.id, editingText)}>
                  Save
                </button>
              </>
            ) : (
              <>
                {/* Отображение задачи */}
                <span>{todo.title} </span>
                <button
                  onClick={() => {
                    setEditing(todo.id);
                    setEditingText(todo.title);
                  }}
                >
                  Edit
                </button>
              </>
            )}
            {/* Удаление задачи */}
            <button onClick={() => dispatch(deleteTodo(todo.id))}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default App;
