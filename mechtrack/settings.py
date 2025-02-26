"""
Django settings for mechtrack project.
"""
import os
from datetime import timedelta
from pathlib import Path

import dj_database_url
from django.core.management.utils import get_random_secret_key
from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY') or get_random_secret_key()

# SECURITY WARNING: make sure these are set correctly as it affects security
IN_PRODUCTION = os.getenv('IN_PRODUCTION').lower()
IS_HEROKU_APP = os.getenv('IS_HEROKU_APP').lower()

if IN_PRODUCTION == 'true':
    print('In production!')
    DEBUG = False
    # FOR TROUBLESHOOTING PURPOSES
    CORS_ALLOW_ALL_ORIGINS = True
    # CORS_ORIGIN_WHITELIST = (
    #     os.getenv('BASE_URL'),
    # )

    # Added to force SSL based on https://help.heroku.com/J2R1S4T8/can-heroku-force-an-application-to-use-ssl-tls
    # Activate for production and deactivate for development
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = True

    if IS_HEROKU_APP == 'true':
        # Production database settings for Heroku deployment

        # On Heroku, it's safe to use a wildcard for `ALLOWED_HOSTS`, since the Heroku router performs
        # validation of the Host header in the incoming HTTP request. On other platforms you may need to
        # list the expected hostnames explicitly in production to prevent HTTP Host header attacks. See:
        # https://docs.djangoproject.com/en/5.1/ref/settings/#std-setting-ALLOWED_HOSTS
        ALLOWED_HOSTS = ["*"]

        DATABASES = {
            'default': dj_database_url.config(
                env='DATABASE_URL',
                conn_max_age=600,
                conn_health_checks=True,
                ssl_require=True,
            ),
        }
    else:
        # Production settings for non-Heroku deployment

        ALLOWED_HOSTS = [os.getenv('BASE_URL')]

        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': os.getenv('DB_NAME'),
                'USER': os.getenv('DB_USER'),
                'PASSWORD': os.getenv('DB_PASS'),
                'HOST': os.getenv('DB_HOST'),
                'PORT': os.getenv('DB_PORT'),
            }
        }

elif IN_PRODUCTION == 'false':
    # Development settings
    print('In development!')
    DEBUG = True
    CORS_ALLOW_ALL_ORIGINS = True
    ALLOWED_HOSTS = ['.localhost', '127.0.0.1', '[::1]', '0.0.0.0', '[::]']


    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DB_NAME'),
            'USER': os.getenv('DB_USER'),
            'PASSWORD': os.getenv('DB_PASS'),
            'HOST': os.getenv('DB_HOST'),
            'PORT': os.getenv('DB_PORT'),
        }
    }

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
    'corsheaders.middleware.CorsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
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
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

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