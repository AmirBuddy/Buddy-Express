import { amirexpress } from './index.js';
import { queryParser } from './middleware.js';
import { EnhancedRequest } from './request.js';
import { EnhancedResponse } from './response.js';

const app = amirexpress();

// Use query parser middleware
app.use(queryParser);

// Define routes
app.get('/', (req: EnhancedRequest, res: EnhancedResponse) => {
  res.json({ message: 'Hello World' });
});

app.get('/redirect', (req: EnhancedRequest, res: EnhancedResponse) => {
  res.redirect('https://www.example.com');
});

// Start server
app.listen(3000);
