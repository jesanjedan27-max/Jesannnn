export default async function handler(req, res) {
  try {
    const { code, code_verifier, client_id, redirect_uri } = req.body;

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
