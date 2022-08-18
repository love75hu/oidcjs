/// <reference path="oidc-client.js" />

function log() {
    document.getElementById('results').innerText = '';

    Array.prototype.forEach.call(arguments, function (msg) {
        if (msg instanceof Error) {
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById('results').innerHTML += msg + '\r\n';
    });
}

document.getElementById("login").addEventListener("click", login, false);
document.getElementById("api").addEventListener("click", api, false);
document.getElementById("logout").addEventListener("click", logout, false);

var config = {
    authority: "http://localhost:3000/mediinfo-cyan-authserver/",
    //authority: "http://localhost:5135/mcrp-authserver/",
    client_id: "mcrp",
    redirect_uri: "http://localhost:8080/callback.html",
    response_type: "code",
    scope: "openid",
    post_logout_redirect_uri: "http://localhost:8080/index.html",
};
var mgr = new Oidc.UserManager(config);

mgr.getUser().then(function (user) {
    if (user) {
        log("User logged in", user.profile);
    }
    else {
        log("User not logged in");
    }
});

function login() {
    //{ acr_values: 'idp:JuYiZhiLian', extraQueryParams: { code: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmRleF9hcHBfdHlwZSI6IjEiLCJjbGllbnRfaWQiOiIxNTA1NzE3Nzk1NzQ1NzcxMDA3IiwidXNlcm5hbWUiOiIxMTkyMjAwOSIsInRpbWVzdGFtcCI6IjE2NTEyMTI1NTgxMTcifQ.eV_xHq1FJPigL0DurTUL6aoclye1VaRhDE8D8sIgpf0" } }
    mgr.signinRedirect();
}

function api() {
    mgr.getUser().then(function (user) {
        var url = "http://localhost:5001/identity";

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            log(xhr.status, JSON.parse(xhr.responseText));
        }
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send();
    });
}

function logout() {
    mgr.signoutRedirect();
}