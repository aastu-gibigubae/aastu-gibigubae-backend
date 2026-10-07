import express from 'express';
import request from 'supertest';
import Joi from 'joi';
import { validate } from '../../src/middlewares/validate.middleware.js';
import { errorHandler } from '../../src/middlewares/errorHandler.middleware.js';

describe('validate middleware', () => {
  it('validates and replaces req.query without throwing getter-only error in Express 5', async () => {
    const app = express();
    const querySchema = Joi.object({
      page: Joi.number().integer().min(1).default(1),
      search: Joi.string().optional(),
    });

    app.get('/test-query', validate(querySchema, 'query'), (req, res) => {
      res.json({ query: req.query });
    });
    app.use(errorHandler);

    const res = await request(app).get('/test-query?search=hello');
    expect(res.status).toBe(200);
    expect(res.body.query).toEqual({ page: 1, search: 'hello' });
  });

  it('rejects invalid query parameters with 400', async () => {
    const app = express();
    const querySchema = Joi.object({
      page: Joi.number().integer().min(1).required(),
    });

    app.get('/test-query', validate(querySchema, 'query'), (req, res) => {
      res.json({ query: req.query });
    });
    app.use(errorHandler);

    const res = await request(app).get('/test-query?page=invalid');
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('must be a number');
  });

  it('validates and replaces req.body', async () => {
    const app = express();
    app.use(express.json());
    const bodySchema = Joi.object({
      title: Joi.string().required(),
    });

    app.post('/test-body', validate(bodySchema, 'body'), (req, res) => {
      res.json({ body: req.body });
    });
    app.use(errorHandler);

    const res = await request(app).post('/test-body').send({ title: 'Sample' });
    expect(res.status).toBe(200);
    expect(res.body.body).toEqual({ title: 'Sample' });
  });

  it('validates and replaces req.params', async () => {
    const app = express();
    const paramsSchema = Joi.object({
      id: Joi.string().uuid().required(),
    });

    app.get('/test-params/:id', validate(paramsSchema, 'params'), (req, res) => {
      res.json({ params: req.params });
    });
    app.use(errorHandler);

    const validId = '550e8400-e29b-41d4-a716-446655440000';
    const res = await request(app).get(`/test-params/${validId}`);
    expect(res.status).toBe(200);
    expect(res.body.params).toEqual({ id: validId });
  });
});
