### SusOrSafe

* [www.susorsafe.courses](http://www.susorsafe.courses)
* [www.susorsafe.study](http://www.susorsafe.study)


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

Use the navigation to visit Lessons, Games, Toolkit, Parents & Teachers, Install, About, and Support as separate pages. The Games page contains seven standalone mini-games—AI or human, fill in the blank, pick and choose, real or fake, password choices, privacy choices, and safer connections—with age-tailored examples. Game scores are saved separately from lesson progress in your browser. AI authorship examples explain that style alone cannot prove who created real content. Choose an age mode to see distinct themes, wording, and scam examples; the selected mode, stage preferences, and lesson progress are saved in your browser. The avatar shop includes additional colours and wearable designs. A shared animated footer provides site navigation and plain-language privacy, terms, and cookie/storage notices.


### AI Use

We used Chatgpt for the front end of the website to develope our ideas. This also took care of most of the visuals. Other ways we used AI was when we didn't understand a concept, we asked it to explain why a certain part of our code wasn't working. Other than that, the idea was all our own, original work, with no outside input
