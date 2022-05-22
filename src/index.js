import Fastify from 'fastify';

import { users } from './users';

const fastify = Fastify({
  logger: true,
});
fastify.register(import('@fastify/cors'));
fastify.register(import('@fastify/multipart'), {
  addToBody: true,
});
fastify.register(import('@fastify/cookie'));

fastify.post('/uppercase', (request, reply) => {
  const { body } = request;
  const result = body.toUpperCase();

  const word = 'fuck';

  if (result.includes(word.toUpperCase())) {
    reply.status(403).send('unresolved');
  }

  return reply.send(result);
});

fastify.post('/lowercase', (request, reply) => {
  const { body } = request;
  const result = body.toLowerCase();
  const word = 'fuck';

  if (result.includes(word.toLowerCase())) {
    return reply.status(403).send('unresolved');
  }

  return reply.send(result);
});

fastify.get('/user/:id', (request, reply) => {
  const { id } = request.params;

  if (users[id]) return reply.send(users[id]);

  return reply.status(400).send('User not exist');
});

fastify.get('/users', (request, reply) => {
  const { filter, value } = request.query;
  const result = [...Object.entries(users).map(([, value]) => value)];

  const ifParamsNotExist = result.filter(
    (item) => String(item[filter]) === value
  );

  if (ifParamsNotExist.length) {
    return reply.send(ifParamsNotExist);
  }

  reply.send(result);
});

export default fastify;
