// api/sim-info.js
export default async function handler(req, res) {
  // Enable CORS for security (optional, but good practice)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Get the search parameter from query string
  const { search } = req.query;
  
  if (!search || !search.match(/^03\d{9}$/)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid Pakistani mobile number format (03xxxxxxxxx)' 
    });
  }
  
  // The REAL API URL (hidden from frontend)
  const REAL_API_URL = `https://sim-info-api.wasif-ali.workers.dev/?search=${encodeURIComponent(search)}`;
  
  try {
    // Fetch data from the actual API
    const response = await fetch(REAL_API_URL, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Vercel-Proxy/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    let data = await response.json();
    
    // MODIFY THE RESPONSE - Remove developer credits
    // Create a clean response object without unwanted fields
    const cleanResponse = {
      success: data.success || false,
      count: data.count || 0,
      records: data.records || []
    };
    
    // Also remove any developer/telegram/channel fields if they exist at root level
    delete data.developer;
    delete data.telegram;
    delete data.channel;
    
    // Return clean data to frontend
    return res.status(200).json(cleanResponse);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Unable to fetch SIM information. Please try again later.' 
    });
  }
}
