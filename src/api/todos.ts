import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2085;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const DeleteTodo = () => {
  return client.delete(`/todos?userId=${USER_ID}`);
};
