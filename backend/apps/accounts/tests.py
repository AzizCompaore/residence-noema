from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import Client, TestCase, override_settings


User = get_user_model()


@override_settings(ROOT_URLCONF='noema_project.urls')
class AuthenticationTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = Client(enforce_csrf_checks=True)
        self.password = 'NoemaSecurePassword!2026'

    def _csrf_headers(self):
        self.client.get('/api/auth/csrf/')
        return {'HTTP_X_CSRFTOKEN': self.client.cookies['csrftoken'].value}

    def test_register_creates_session_and_me_endpoint_returns_user(self):
        response = self.client.post(
            '/api/auth/register/',
            data={'first_name': 'Awa', 'last_name': 'Kouassi', 'email': 'awa@example.com', 'password': self.password},
            content_type='application/json',
            **self._csrf_headers(),
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json()['success'])
        self.assertEqual(self.client.get('/api/auth/me/').json()['user']['email'], 'awa@example.com')

    def test_login_requires_csrf_and_logout_invalidates_session(self):
        User.objects.create_user(username='user@example.com', email='user@example.com', password=self.password)
        blocked = self.client.post('/api/auth/login/', data={'email': 'user@example.com', 'password': self.password}, content_type='application/json')
        self.assertEqual(blocked.status_code, 403)
        response = self.client.post(
            '/api/auth/login/',
            data={'email': 'user@example.com', 'password': self.password, 'remember_me': False},
            content_type='application/json',
            **self._csrf_headers(),
        )
        self.assertEqual(response.status_code, 200)
        self.client.post('/api/auth/logout/', content_type='application/json', **self._csrf_headers())
        self.assertFalse(self.client.get('/api/auth/me/').json()['authenticated'])

    def test_repeated_failed_logins_are_throttled(self):
        for _ in range(5):
            response = self.client.post(
                '/api/auth/login/',
                data={'email': 'unknown@example.com', 'password': 'incorrect'},
                content_type='application/json',
                **self._csrf_headers(),
            )
            self.assertEqual(response.status_code, 401)
        response = self.client.post(
            '/api/auth/login/',
            data={'email': 'unknown@example.com', 'password': 'incorrect'},
            content_type='application/json',
            **self._csrf_headers(),
        )
        self.assertEqual(response.status_code, 429)