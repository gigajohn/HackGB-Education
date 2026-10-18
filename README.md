### SusOrSafe

* [www.susorsafe.courses](https://www.susorsafe.courses)
* [www.susorsafe.study](https://www.susorsafe.study)


### 🚀 How to Run

#### 1. Setup Virtual Environment
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
```

#### 2. Local Development Server
```bash
python manage.py runserver
```

#### 3. Production Deployment

1. **Start Gunicorn as a system service**:
   ```bash
   sudo cp gunicorn.service /etc/systemd/system/gunicorn.service
   sudo systemctl daemon-reload
   sudo systemctl enable --now gunicorn
   ```

2. **Configure and start Caddy**:
   ```bash
   sudo cp Caddyfile /etc/caddy/Caddyfile
   sudo systemctl enable --now caddy
   sudo systemctl reload caddy
   ```

3. **Open firewall ports (ports 80 and 443)**:
   ```bash
   sudo firewall-cmd --permanent --add-service=http --add-service=https
   sudo firewall-cmd --reload
   ```

