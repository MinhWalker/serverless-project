import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic
const todoAccess = new TodosAccess();

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string
): Promise<TodoItem> {

    const todoId = uuid.v4()
    const userId = 'user' //getUserId(jwtToken)

    return await todoAccess.createTodo({
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.name,
        done: false
    })
}

export async function getTodos(
  jwtToken: string
): Promise<TodoItem[]> {
  const userId = 'user' //getUserId(jwtToken)

  return todoAccess.getTodos(userId)
}

export async function updateTodo(
  todoId: string,
  updateTodoRequest: UpdateTodoRequest,
  jwtToken: string
): Promise<TodoUpdate> {

  const userId = 'user' //getUserId(jwtToken)

  return await todoAccess.updateTodo(
      userId,
      todoId,
      {
          name: updateTodoRequest.name,
          dueDate: updateTodoRequest.dueDate,
          done: updateTodoRequest.done
      }
  )
}

export async function todoExists (
  todoId: string,
  jwtToken: string
): Promise<boolean> {
  const userId = 'user' //getUserId(jwtToken)
  return await todoAccess.todoExists(
      userId,
      todoId
  )
}