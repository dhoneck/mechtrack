release: cd client && npm install && npm run build && cd .. && python manage.py collectstatic --noinput && python manage.py migrate
web: gunicorn mechtrack.wsgi --log-file -
