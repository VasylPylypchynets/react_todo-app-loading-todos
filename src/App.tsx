/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [newTask, setNewTask] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoadingChange, setIsLoadingChange] = useState(false);
  const [itemsLeft, setItemsLeft] = useState<number>(0);
  const [sortBy, setSortBy] = useState('all');
  const [errorMessage, setErrorMessage] = useState<
    string | null | boolean
  >(null);

  // if (!USER_ID) {
  //   return <UserWarning />;
  // }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNewTask(query);
  }

  useEffect(() => {
    async function getTodosFromServer() {
      try {
        const todosFromServer = await getTodos();

        const numbersOfItemsLeft: number = todosFromServer.filter(
          todo => !todo.completed,
        ).length;

        setItemsLeft(numbersOfItemsLeft);
        setErrorMessage(null);

        switch (sortBy) {
          case 'all':
            setTodos(todosFromServer);
            break;
          case 'active':
            const sortedByActive: Todo[] = todosFromServer.filter(
              todo => !todo.completed,
            );

            setTodos(sortedByActive);
            break;
          case 'completed':
            const sortedByCompleted: Todo[] = todosFromServer.filter(
              todo => todo.completed,
            );

            setTodos(sortedByCompleted);
            break;
        }
      } catch {
        setErrorMessage('Unable to load todos');
        const timer = setTimeout(() => setErrorMessage(null), 3000);

        return () => clearTimeout(timer);
      }
    }

    getTodosFromServer();
  }, [sortBy]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              value={query}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={e => setQuery(e.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todos.map(todo => (
            <div
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''}`}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              {/* Remove button appears only on hover */}

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              {/* Overlay will cover the todo while it is being deleted or updated */}
              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {itemsLeft} items left
            </span>
            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${sortBy === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={e => {
                  e.preventDefault();
                  setSortBy('all');
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${sortBy === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={e => {
                  e.preventDefault();
                  setSortBy('active');
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${sortBy === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={e => {
                  e.preventDefault();
                  setSortBy('completed');
                }}
              >
                Completed
              </a>
            </nav>
            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.length !== itemsLeft ? false : true}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage === null && 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {/* show only one message at a time */}
        {errorMessage}
        {/* <br />
          Title should not be empty
          <br />
          Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}
      </div>
    </div>
  );
};
