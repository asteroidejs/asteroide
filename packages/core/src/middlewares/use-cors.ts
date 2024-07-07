import { RouteMiddleware } from '../types';
import { CorsOptions } from 'cors';

type Optiosn = CorsOptions & {
  origin: string[];
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
  maxAge: number;
};

export function useCors(cors: Optiosn): RouteMiddleware {
  return (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', cors.origin.join(', '));
    res.setHeader(
      'Access-Control-Allow-Methods',
      cors.methods?.join(', ') || '*',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      cors.allowedHeaders?.join(', ') || '*',
    );
    res.setHeader(
      'Access-Control-Allow-Credentials',
      cors.credentials ? 'true' : 'false',
    );
    res.setHeader('Access-Control-Max-Age', cors.maxAge?.toString() || '0');

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    next();
  };
}
