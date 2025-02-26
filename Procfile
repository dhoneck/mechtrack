release: npm install --prefix client && npm run build --prefix client && python manage.py collectstatic --noinput
web: gunicorn mechtrack.wsgi --log-file -