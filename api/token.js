export default async function handler(req, res) {
  // Allow POST only
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Vercel sometimes does NOT auto-parse body
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    const { code, code_verifier, client_id, redirect_uri } = body || {};

    if (!code || !code_verifier || !client_id || !redirect_uri) {
      return res.status(400).json({
        error: "Missing OAuth parameters",
        received: body
      });
    }

    const response = await fetch("https://oauth.deriv.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        code_verifier,
        client_id,
        redirect_uri
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: "Token exchange failed",
        details: data
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}
