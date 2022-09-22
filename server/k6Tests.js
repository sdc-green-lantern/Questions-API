import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  // vus: 1,
  stages: [
    { duration: '10s', target: 100 }, // below normal load
    { duration: '20s', target: 200 },
    { duration: '30s', target: 400 }, // normal load
    { duration: '20s', target: 600 },
    { duration: '10s', target: 800}, // beyond the breaking point
    { duration: '10s', target: 400},
    { duration: '10s', target: 300},
    { duration: '10s', target: 200},
    { duration: '10s', target: 0}, // scale down. Recovery stage.
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
