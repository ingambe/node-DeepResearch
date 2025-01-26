import https from 'https';

interface ReadResponse {
  code: number;
  status: number;
  data: {
    title: string;
    description: string;
    url: string;
    content: string;
    usage: { tokens: number; };
  };
}

export function readUrl(url: string, token: string): Promise<ReadResponse> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({url});

    const options = {
      hostname: 'r.jina.ai',
      port: 443,
      path: '/',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'X-Retain-Images': 'none'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => resolve(JSON.parse(responseData)));
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}
