import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import fetch from 'node-fetch';
dotenv.config()

function generateJsonWebToken() {
    const issueAt = Math.round(new Date().getTime() / 1000);
    const expirationAt = issueAt + 300;

    const payload = {
        "aud": process.env.TOKEN_PROD_URL + "?realm=aolcorporate/aolexternals",
        "iat": issueAt,
        "exp": expirationAt,
        "sub": process.env.CLIENT_ID,
        "iss": process.env.CLIENT_ID,
        "jti": uuid()
    };

    const token = jwt.sign(payload, process.env.CLIENT_SECRET, { algorithm: 'HS256' });
    return token;
}

async function getOauthToken() {
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
    };
    const payload = {
        "grant_type": "client_credentials",
        "scope": "one",
        "realm": "aolcorporate/aolexternals",
        "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        "client_assertion": generateJsonWebToken()
    };
    const request = {
        "method": "post",
        "headers": headers,
        "body": new URLSearchParams(payload)
    };

    const tokenRequest = await fetch(process.env.TOKEN_PROD_URL, request)
    const token = await tokenRequest.json()

    return token
}

const token = await getOauthToken();
console.log(token)
