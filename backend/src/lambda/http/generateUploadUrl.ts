import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { generateAndAddUploadUrl, todoExists } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrlhandler')
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // DONE: Return a presigned URL to upload a file for a TODO item with the provided id
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    logger.info('Processing event: ', event)
    const isValidTodoId = await todoExists(todoId, jwtToken)

    if (!isValidTodoId) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          error: 'Todo not found'
        })
      }
    }

    try {
      const uploadUrl = await generateAndAddUploadUrl(todoId, jwtToken)

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          uploadUrl: uploadUrl
        })
      }
    } catch (err) {
      logger.error('Failed to generate url', err);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: 'Failed to generate url',
      }
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
