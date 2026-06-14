export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const {
      code,
      code_verifier,
      client_id,
      redirect_uri
    } = req.body || {};

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      code_verifier,
      client_id,
      redirect_uri
    });

    const response = await fetch(
      "https://auth.deriv.com/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body.toString()
      }
    );

    const text = await response.text();

    return res.status(response.ok ? 200 : 400).json({
      status: response.status,
      response: text
    });

  } catch (err) {

    return res.status(500).json({
      error: "Server error",
      details: err.message
    });

  }
}
