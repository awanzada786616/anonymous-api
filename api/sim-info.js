// api/sim-info.js
export default async function handler(req, res) {
    const { search } = req.query;
    
    // Validation
    if (!search || !search.match(/^03\d{9}$/)) {
        return res.status(400).json({ 
            success: false, 
            error: "Invalid Pakistani mobile number format (03xxxxxxxxx)",
            developer: "anonymous_db"  // ✅ Added here
        });
    }
    
    const REAL_API = `https://sim-info-api.wasif-ali.workers.dev/?search=${search}`;
    
    try {
        const response = await fetch(REAL_API);
        const data = await response.json();
        
        // 🎨 CUSTOMIZE RESPONSE - Add developer credit
        const customResponse = {
            success: data.success || false,
            count: data.count || 0,
            records: data.records || [],
            // ✅ Yahan add karo developer credit
            developer: "anonymous_db",
            message: "Powered by Anonymous DB | Secure SIM Information System",
            timestamp: new Date().toISOString()
        };
        
        // ❌ Remove original developer/telegram/channel if they exist
        // (already not included because we're building fresh object)
        
        res.status(200).json(customResponse);
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: "Service unavailable",
            developer: "anonymous_db"  // ✅ Error response mein bhi
        });
    }
}
