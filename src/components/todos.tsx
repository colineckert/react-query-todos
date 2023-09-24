import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type Todo = {
  id: number;
  text: string;
  isDone: boolean;
};

let todos: Todo[] = [];

function postTodo(todo: Todo) {
  todos.push(todo);
}

function getTodos(): Todo[] {
  return todos;
}

// function mutateTodo(partialTodo: Todo) {
//   todos[partialTodo.id] = { ...todos[partialTodo.id], ...partialTodo };
// }

export const AddTodo = () => {
  const [label, setLabel] = React.useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation(postTodo, {
    onSuccess: () => {
      setLabel('');
      console.log('success', todos);
      queryClient.invalidateQueries(['todos']);
    },
  });

  return (
    <div className="flex flex-col">
      <input
        className="border-2 border-gray-300 p-2 rounded-lg py-2 my-2"
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          mutation.mutate({ id: todos.length, text: label, isDone: false });
          setLabel('');
        }}
      >
        Add Todo
      </button>
    </div>
  );
};

export const Todo = ({ id, text, isDone }: Todo) => {
  console.log('rendering todo', id);

  return (
    <li key={id} className="flex flex-row items-center">
      <input
        type="checkbox"
        checked={isDone}
        className="w-4 h-4 p-2 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
      />
      <label className="w-full py-3 pl-2 text-lg font-medium text-gray-900 dark:text-gray-300">
        {text}
      </label>
    </li>
  );
};

export const TodoList = () => {
  const { isLoading, isError, data, error } = useQuery(['todos'], getTodos); // a hook provided by react-query, it takes a key(name) and function that returns a promise

  if (isLoading) {
    return (
      <div className="App">
        <h1>isLoading...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="App">
        <h1>{error}</h1>
      </div>
    );
  }

  return (
    <div className="App">
      <h1 className="pb-2 font-mono text-2xl font-semibold">Todos</h1>
      <ul className="py-2">
        {data.map((todo: Todo) => (
          <Todo
            key={todo.id}
            text={todo.text}
            isDone={todo.isDone}
            id={todo.id}
          />
        ))}
      </ul>
      <AddTodo />
    </div>
  );
};
