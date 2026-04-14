// Placeholder for future JWT / Clerk / NextAuth token validation
// For now it just checks that user_id is present in the request body

const requireUserId = (req, res, next) => {
    const userId =
      req.body?.user_id || req.params?.user_id || req.query?.user_id;
  
    if (!userId) {
      return res.status(400).json({ error: "user_id is required" });
    }
  
    req.userId = userId;
    next();
  };
  
  module.exports = { requireUserId };