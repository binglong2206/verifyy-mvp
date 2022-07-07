export function googleSignIn() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  var form = document.createElement("form");
  form.setAttribute("method", "GET");
  form.setAttribute("action", oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  var params = {
    client_id:
      "284320772177-9it3a6skjshvpeu4nvpeknp6nq8ko8h2.apps.googleusercontent.com",
    redirect_uri: "http://localhost:3000",
    response_type: "token",
    scope: "https://www.googleapis.com/auth/yt-analytics.readonly",
    include_granted_scopes: "true",
    state: "pass-through value",
  };

  for (var p in params) {
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}
