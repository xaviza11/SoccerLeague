import Fastify from 'fastify'

import { userRoutes } from './routes/index.js'
import { configService } from './helpers/envConfig.js'

const fastify = Fastify({
  logger: true
})

fastify.register(userRoutes, {prefix: 'api'})

try {
  await fastify.listen({ port: configService.PORT})
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}