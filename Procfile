release: npm install --prefix client && npm run build --prefix client && python manage.py collectstatic --noinput && python manage.py migrate
web: gunicorn mechtrack.wsgi --log-file -