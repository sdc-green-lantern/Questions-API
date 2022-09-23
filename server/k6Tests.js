import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  stages: [
    { duration: '10s', target: 100 },
    { duration: '20s', target: 200 },
    { duration: '30s', target: 300 },
    { duration: '20s', target: 500 },
    { duration: '10s', target: 400},
    { duration: '10s', target: 200},
    { duration: '10s', target: 0},
  ]
};

let randomId = Math.floor(Math.random() * 1000011 );

export default function () {
  const baseUrl = 'http://localhost:3000'

  const responses = http.batch([
    ['GET', `${baseUrl}/qa/questions?product_id=${randomId}`],
    ['GET', `${baseUrl}/qa/questions/${randomId}/answers`]
  ]);
  sleep(1);
};
