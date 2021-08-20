import json
import time
import uuid
import requests
import jwt

token_stage_url = 'https://id-uat.b2b.verizonmedia.com/identity/oauth2/access_token'
token_prod_url = 'https://id.b2b.verizonmedia.com/identity/oauth2/access_token'
token_url = token_prod_url

def get_jwt_token(client_id, secret):
    issueAt = int(time.time())
    expirationAt = int(time.time()) + 300 # 5 minutes

    payload = {
        'aud': token_url + "?realm=dsp",
        'iat': issueAt,
        'exp': expirationAt,
        'sub': client_id,
        'iss': client_id,
        'jti': str(uuid.uuid4())
    }

    header = {
        "alg": "HS256",
        "typ": "JWT"
    }

    encoded = jwt.encode(payload, secret, algorithm = 'HS256', headers = header)
    return encoded


def get_oauth_token():
    token = get_jwt_token('client_id', 'client_secret')

    payload = "grant_type=client_credentials" \
              "&scope=dsp-api-access" \
              "&realm=aolcorporate/aolexternals" \
              "&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer" \
              "&client_assertion=" + token

    headers = {
        'Content-Type': "application/x-www-form-urlencoded",
        'Accept': "application/json"
    }

    response = requests.post(token_url, data = payload, headers = headers)

    return response.text

print('Response =>', json.loads(get_oauth_token()))
