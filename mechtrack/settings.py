"""
Django settings for mechtrack project.
"""
import os
from datetime import timedelta
from pathlib import Path

from django.core.management.utils import get_random_secret_key
from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY') or get_random_secret_key()

# SECURITY WARNING: don't run with debug turned on in production!
IN_PRODUCTION = os.getenv('IN_PRODUCTION').lower()

if IN_PRODUCTION == 'true':
    print('In production!')
    DEBUG = False
    CORS_ORIGIN_ALLOW_ALL = False
    CORS_ORIGIN_WHITELIST = (
        os.getenv('PROD_BASE_URL'),
    )
    ALLOWED_HOSTS = [os.getenv('DEV_API_BASE_URL')]

    # Added to force SSL based on https://help.heroku.com/J2R1S4T8/can-heroku-force-an-application-to-use-ssl-tls
    # Activate for production and deactivate for development
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = True

    # Production database settings
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('PRODUCTION_DB'),
            'USER': os.getenv('PRODUCTION_USER'),
            'PASSWORD': os.getenv('PRODUCTION_PASS'),
            'HOST': os.getenv('PRODUCTION_HOST'),
            'PORT': os.getenv('PRODUCTION_PORT'),
        }
    }

elif IN_PRODUCTION == 'false':
    print('In development!')
    DEBUG = True
    ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

    # Development database settings
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DEVELOPMENT_DB'),
            'USER': os.getenv('DEVELOPMENT_USER'),
            'PASSWORD': os.getenv('DEVELOPMENT_PASS'),
            'HOST': os.getenv('DEVELOPMENT_HOST'),
            'PORT': os.getenv('DEVELOPMENT_PORT'),
        }
    }
    CORS_ORIGIN_ALLOW_ALL = True

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'shop.apps.ShopConfig',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'multiselectfield',
    'django_filters',
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend'
    ],
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware'
]

ROOT_URLCONF = 'mechtrack.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates']
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'mechtrack.wsgi.application'

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'America/Chicago'
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/
STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Set custom user model
AUTH_USER_MODEL = 'shop.CustomUser'

# Set custom authentication backend
AUTHENTICATION_BACKENDS = ['shop.backends.EmailBackend']

# Configure Simple JWT
SIMPLE_JWT = {
    'USER_ID_FIELD': 'email',
    'USER_ID_CLAIM': 'email',
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}