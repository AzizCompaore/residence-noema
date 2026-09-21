import json
import logging
import os
import secrets
import time
from urllib.parse import urlencode
from urllib.error import HTTPError
from urllib.request import Request as UrlRequest, urlopen

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.db import IntegrityError, transaction
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.cache import cache
from django.core.mail import send_mail
from django.core.signing import BadSignature, SignatureExpired, dumps, loads
from django.core.validators import validate_email
from django.http import JsonResponse
from django.shortcuts import redirect
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

User = get_user_model()
logger = logging.getLogger(__name__)
MAX_LOGIN_ATTEMPTS = 5
LOGIN_WINDOW_SECONDS = 15 * 60


def _json_body(request):
    try:
        return json.loads(request.body or '{}')
    except (TypeError, ValueError):
        return None


def _user_payload(user):
    return {
        'id': user.pk,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_staff': user.is_staff,
    }


def _client_key(request, email=''):
    address = request.META.get('REMOTE_ADDR', 'unknown')
    return f'login-attempts:{address}:{email.lower().strip()}'


def _too_many_attempts(request, email):
    return int(cache.get(_client_key(request, email), 0)) >= MAX_LOGIN_ATTEMPTS


def _record_failed_attempt(request, email):
    key = _client_key(request, email)
    cache.set(key, int(cache.get(key, 0)) + 1, LOGIN_WINDOW_SECONDS)


def _clear_failed_attempts(request, email):
    cache.delete(_client_key(request, email))


@require_GET
@ensure_csrf_cookie
def csrf_token(request):
    return JsonResponse({'success': True})


@require_GET
def current_user(request):
    if not request.user.is_authenticated:
        return JsonResponse({'authenticated': False, 'user': None})
    return JsonResponse({'authenticated': True, 'user': _user_payload(request.user)})


@require_POST
def register(request):
    data = _json_body(request)
    if not isinstance(data, dict):
        return JsonResponse({'error': 'Données invalides.'}, status=400)

    email = str(data.get('email', '')).strip().lower()
    first_name = str(data.get('first_name', '')).strip()
    last_name = str(data.get('last_name', '')).strip()
    password = str(data.get('password', ''))

    if not first_name or not last_name or not email or not password:
        return JsonResponse({'error': 'Tous les champs obligatoires doivent être remplis.'}, status=400)
    try:
        validate_email(email)
        validate_password(password)
    except Exception as error:
        return JsonResponse({'error': str(error)}, status=400)
    if User.objects.filter(email__iexact=email).exists() or User.objects.filter(username__iexact=email).exists():
        return JsonResponse({'error': 'Cette adresse e-mail est déjà associée à un compte. Connectez-vous ou utilisez « Mot de passe oublié ? ».'}, status=400)

    try:
        with transaction.atomic():
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )
    except IntegrityError:
        return JsonResponse({'error': 'Cette adresse e-mail est déjà associée à un compte. Connectez-vous ou utilisez « Mot de passe oublié ? ».'}, status=400)
    login(request, user)
    return JsonResponse({'success': True, 'user': _user_payload(user)}, status=201)


@require_POST
def login_view(request):
    data = _json_body(request)
    if not isinstance(data, dict):
        return JsonResponse({'error': 'Données invalides.'}, status=400)

    email = str(data.get('email', '')).strip().lower()
    password = str(data.get('password', ''))
    remember_me = bool(data.get('remember_me', True))
    if not email or not password:
        return JsonResponse({'error': 'Adresse e-mail et mot de passe requis.'}, status=400)
    if _too_many_attempts(request, email):
        return JsonResponse({'error': 'Trop de tentatives. Réessayez dans quelques minutes.'}, status=429)

    account = User.objects.filter(email__iexact=email).first()
    user = authenticate(request, username=account.get_username() if account else email, password=password)
    if user is None or not user.is_active:
        _record_failed_attempt(request, email)
        return JsonResponse({'error': 'Adresse e-mail ou mot de passe incorrect.'}, status=401)

    _clear_failed_attempts(request, email)
    login(request, user)
    request.session.set_expiry(None if remember_me else 0)
    return JsonResponse({'success': True, 'user': _user_payload(user)})


@require_POST
def logout_view(request):
    logout(request)
    return JsonResponse({'success': True})


@require_POST
def password_reset_request(request):
    data = _json_body(request)
    email = str((data or {}).get('email', '')).strip().lower()
    if email:
        user = User.objects.filter(email__iexact=email, is_active=True).first()
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000').rstrip('/')
            reset_url = f'{frontend_url}/?reset_uid={uid}&reset_token={token}'
            send_mail(
                'Réinitialisation de votre mot de passe NOEMA',
                f'Utilisez ce lien pour réinitialiser votre mot de passe : {reset_url}',
                os.getenv('DEFAULT_FROM_EMAIL', 'no-reply@laresidencenoema.com'),
                [user.email],
                fail_silently=True,
            )
    return JsonResponse({'success': True, 'message': 'Si cette adresse existe, un lien de réinitialisation sera envoyé.'})


@require_POST
def password_reset_confirm(request):
    data = _json_body(request)
    uid = str((data or {}).get('uid', ''))
    token = str((data or {}).get('token', ''))
    password = str((data or {}).get('password', ''))
    try:
        user = User.objects.get(pk=force_str(urlsafe_base64_decode(uid)))
        validate_password(password, user)
    except Exception as error:
        return JsonResponse({'error': str(error)}, status=400)
    if not default_token_generator.check_token(user, token):
        return JsonResponse({'error': 'Ce lien de réinitialisation est invalide ou expiré.'}, status=400)
    user.set_password(password)
    user.save(update_fields=['password'])
    return JsonResponse({'success': True})


def _google_configured():
    return all(os.getenv(key) for key in ('GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'))


def _frontend_url(request):
    configured_url = os.getenv('FRONTEND_URL')
    if configured_url:
        return configured_url.rstrip('/')
    forwarded_host = request.META.get('HTTP_X_FORWARDED_HOST')
    host = forwarded_host or request.get_host()
    forwarded_proto = request.META.get('HTTP_X_FORWARDED_PROTO')
    scheme = forwarded_proto or request.scheme
    return f'{scheme}://{host}'.rstrip('/')


def _google_redirect_uri(request):
    configured_uri = os.getenv('GOOGLE_REDIRECT_URI')
    if configured_uri:
        return configured_uri.rstrip('/') + '/'
    return f'{_frontend_url(request)}/api/auth/google/callback/'


@require_GET
def google_start(request):
    if not _google_configured():
        missing = [key for key in ('GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET') if not os.getenv(key)]
        return JsonResponse({'error': f"La connexion Google n’est pas configurée. Variable(s) manquante(s) : {', '.join(missing)}."}, status=503)
    state = dumps({'nonce': secrets.token_urlsafe(32)}, salt='noema-google-oauth')
    params = {
        'client_id': os.environ['GOOGLE_CLIENT_ID'],
        'redirect_uri': _google_redirect_uri(request),
        'response_type': 'code',
        'scope': 'openid email profile',
        'state': state,
        'access_type': 'online',
        'prompt': 'select_account',
    }
    return JsonResponse({'url': 'https://accounts.google.com/o/oauth2/v2/auth?' + urlencode(params)})


def _google_json_request(url, payload):
    request = UrlRequest(url, data=urlencode(payload).encode(), headers={'Content-Type': 'application/x-www-form-urlencoded'})
    try:
        with urlopen(request, timeout=10) as response:
            return json.loads(response.read().decode())
    except HTTPError as error:
        details = error.read().decode('utf-8', errors='replace')
        logger.error('Google OAuth token exchange failed with status %s: %s', error.code, details)
        raise


@require_GET
def google_callback(request):
    frontend_url = _frontend_url(request)
    state = request.GET.get('state', '')
    try:
        loads(state, salt='noema-google-oauth', max_age=600)
    except (BadSignature, SignatureExpired):
        return redirect(f'{frontend_url}/?auth_error=google')
    if not _google_configured() or request.GET.get('error') or not request.GET.get('code'):
        return redirect(f'{frontend_url}/?auth_error=google')
    try:
        token_data = _google_json_request('https://oauth2.googleapis.com/token', {
            'code': request.GET.get('code', ''),
            'client_id': os.environ['GOOGLE_CLIENT_ID'],
            'client_secret': os.environ['GOOGLE_CLIENT_SECRET'],
            'redirect_uri': _google_redirect_uri(request),
            'grant_type': 'authorization_code',
        })
        access_token = token_data.get('access_token')
        if not access_token:
            raise ValueError('Google token response did not contain an access token')
        user_request = UrlRequest('https://www.googleapis.com/oauth2/v3/userinfo', headers={'Authorization': f"Bearer {token_data['access_token']}"})
        with urlopen(user_request, timeout=10) as response:
            profile = json.loads(response.read().decode())
        if not profile.get('email') or not profile.get('email_verified'):
            raise ValueError('Google email is not verified')
        user = User.objects.filter(email__iexact=profile['email']).first()
        if user is None:
            username = f"google_{secrets.token_hex(12)}"
            user = User.objects.create(username=username, email=profile['email'], first_name=profile.get('given_name', ''), last_name=profile.get('family_name', ''), is_active=True)
            user.set_unusable_password()
            user.save(update_fields=['password'])
        login(request, user)
        return redirect(f'{frontend_url}/?auth=success')
    except HTTPError as error:
        if error.code == 401:
            return redirect(f'{frontend_url}/?auth_error=google_credentials')
        logger.exception('Google OAuth callback failed')
        return redirect(f'{frontend_url}/?auth_error=google')
    except Exception:
        logger.exception('Google OAuth callback failed')
        return redirect(f'{frontend_url}/?auth_error=google')