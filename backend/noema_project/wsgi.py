"""
WSGI config for noema_project.

It exposes the WSGI callable as a module-level variable named ``application``.
For more information on this file, see the Django documentation at:
https://docs.djangoproject.com/en/stable/howto/deployment/wsgi/
"""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'noema_project.settings')
application = get_wsgi_application()

