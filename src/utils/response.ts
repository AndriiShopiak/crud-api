import { ServerResponse } from 'http';

export const sendJson = (res: ServerResponse, status: number, data: unknown) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

export const sendError = (res: ServerResponse, status: number, message: string) => {
  sendJson(res, status, { error: message });
};
