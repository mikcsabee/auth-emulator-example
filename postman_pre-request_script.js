const apiKey = pm.collectionVariables.get("apiKey");

function randomProviderRawId() {
    let str = "";
    for (let i = 0; i < 40; i++) {
       str += Math.floor(Math.random() * 10).toString();
    }
    return str;
}

const claims = encodeURIComponent(JSON.stringify({
    sub: randomProviderRawId(),
    iss: "",
    aud: "",
    exp: 0,
    iat: 0,
    name: pm.collectionVariables.get("authName"),
    email: pm.collectionVariables.get("authEmail"),
    email_verified: true,
    picture: "",
}));

const payload = JSON.stringify({
    requestUri: `http://localhost:9099/emulator/auth/handler?providerId=google.com&id_token=${claims}`,
    returnIdpCredential: true,
    returnSecureToken: true,
    sessionId: "ValueNotUsedByAuthEmulator",
});

const options = {
    url: `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${apiKey}`,
    method: 'POST',
    header: { 'content-type': 'application/json' },
    body: {
        mode: 'raw',
        raw: payload
    }
};

pm.sendRequest(options, function (err, res) {
    if (err) {
        console.error(err)
        throw new Error("Unable to authenticate!");
    }
    else {
        pm.collectionVariables.set("token", res.json().idToken);
    }
});
