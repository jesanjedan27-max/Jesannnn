export default async function handler(req, res) {
  // ================= METHOD GUARD =================
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { code, code_verifier, client_id, redirect_uri } = req.body || {};

    // ================= VALIDATION =================
    if (!code || !code_verifier || !client_id || !redirect_uri) {
      return res.status(400).json({
        error: "Missing OAuth params",
        received: { code, code_verifier, client_id, redirect_uri }
      });
    }

    // ================= DERIV TOKEN REQUEST =================
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

    let data;

    try {
      data = await response.json();
    } catch (e) {
      return res.status(500).json({
        error: "Invalid JSON from Deriv",
        details: e.message
      });
    }

    // ================= ERROR FROM DERIV =================
    if (!response.ok) {
      return res.status(response.status).json({
        error: "Token exchange failed",
        details: data
      });
    }

    // ================= SUCCESS =================
    return res.status(200).json({
      access_token: data.access_token,
      expires_in: data.expires_in,
      refresh_token: data.refresh_token || null,
      scope: data.scope || null
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server crash",
      details: err.message
    });
  }
}
