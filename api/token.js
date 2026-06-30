export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { code, code_verifier, client_id, redirect_uri } = req.body || {};

    if (!code || !code_verifier || !client_id || !redirect_uri) {
      return res.status(400).json({ error: "Missing OAuth params" });
    }

    const response = await fetch("https://oauth.deriv.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
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
        error: data.error_description || data.error || "Token exchange failed"
      });
    }

    return res.status(200).json({
      access_token: data.access_token || null,
      refresh_token: data.refresh_token || null
    });
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}
