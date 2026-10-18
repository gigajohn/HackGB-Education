from pathlib import Path

from django.test import TestCase
from django.urls import reverse
from django.contrib.staticfiles import finders
from django.contrib.auth import get_user_model
from pages.models import Profile

User = get_user_model()


class LandingPageTests(TestCase):
    def test_landing_page_status_code_and_template(self):
        response = self.client.get(reverse('landing'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            'home.html' in [t.name for t in response.templates] or
            'pages/landing.html' in [t.name for t in response.templates]
        )

    def test_home_page_describes_each_age_mode(self):
        response = self.client.get(reverse('home'))
        self.assertContains(response, 'Preschool–middle school')
        self.assertContains(response, 'High school–college')
        self.assertContains(response, 'Middle age–senior')

    def test_primary_navigation_has_three_pages(self):
        for page in ('home', 'lessons', 'about'):
            with self.subTest(page=page):
                response = self.client.get(reverse(page))
                self.assertEqual(response.status_code, 200)
                self.assertContains(response, f'data-page="{page}"')

    def test_games_route_opens_games_within_lessons_page(self):
        response = self.client.get(reverse('games'))
        self.assertRedirects(response, f"{reverse('lessons')}#games")
        response = self.client.get(reverse('lessons'))
        self.assertContains(response, 'data-page="lessons"')
        self.assertContains(response, 'id="gamesGrid"')
        self.assertContains(response, 'id="lessonPath"')
        content = response.content.decode()
        self.assertLess(content.index('id="lessons"'), content.index('id="games"'))

    def test_help_sections_share_the_about_page(self):
        response = self.client.get(reverse('about'))
        for section in ('toolkit', 'parents', 'about', 'install', 'support'):
            with self.subTest(section=section):
                self.assertContains(response, f'id="{section}"')

        for page, section in (('toolkit', 'toolkit'), ('parents', 'parents'), ('install', 'install'), ('support', 'support')):
            with self.subTest(page=page):
                response = self.client.get(reverse(page))
                self.assertRedirects(response, f"{reverse('about')}#{section}")

    def test_support_header_links_to_site_sections(self):
        response = self.client.get(reverse('support'), follow=True)
        for page in ('home', 'lessons', 'about'):
            with self.subTest(page=page):
                self.assertContains(response, reverse(page))
        for mode in ('kid', 'teen', 'adult'):
            with self.subTest(mode=mode):
                self.assertContains(response, f'data-mode="{mode}"')
        self.assertContains(response, 'class="main-nav"')
        self.assertContains(response, 'data-legal="terms"')
        self.assertContains(response, 'data-legal="cookies"')
        self.assertContains(response, 'class="site-footer"')

    def test_home_footer_has_animated_legal_notices_and_age_mascot(self):
        response = self.client.get(reverse('home'))
        self.assertContains(response, '<!DOCTYPE html>', html=False)
        self.assertContains(response, 'class="site-footer"')
        self.assertContains(response, '@ 2026 Sus Or Safe')
        self.assertContains(response, 'Terms &amp; conditions')
        self.assertContains(response, 'Cookie notice')
        self.assertContains(response, 'Privacy notice')
        self.assertContains(response, 'id="legalDialog"')
        self.assertContains(response, 'class="mascot-age-teen"')
        self.assertContains(response, 'class="mascot-age-adult"')
        self.assertContains(response, f"{reverse('lessons')}#games")
        styles = Path(finders.find('susorsafe/styles.css')).read_text(encoding='utf-8')
        theme_styles = Path(finders.find('susorsafe/v2.css')).read_text(encoding='utf-8')
        self.assertIn('@keyframes footer-aurora', styles)
        self.assertIn('@keyframes footer-orbit', styles)
        self.assertIn('body[data-mode="kid"] .site-footer .footer-brand > p', theme_styles)
        self.assertIn('body[data-mode="kid"] .legal-dialog .legal-dialog-body', theme_styles)
        self.assertIn('body[data-mode="kid"] .toast{', theme_styles)
        self.assertIn('background:#ffd34f', theme_styles)
        self.assertIn('body[data-mode="adult"] .site-footer{', theme_styles)
        self.assertIn('body[data-mode="adult"] .legal-dialog{', theme_styles)

    def test_games_page_uses_age_specific_standalone_minigames(self):
        response = self.client.get(reverse('lessons'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'data-page="lessons"')
        self.assertContains(response, 'id="gamesGrid"')
        self.assertContains(response, 'id="gamesModeIntro"')
        self.assertContains(response, 'id="arcadeDialog"')
        app = Path(finders.find('susorsafe/app.js')).read_text(encoding='utf-8')
        for title in ("title: 'AI or a person?'", "title: 'Fill in the safety blank'", "title: 'Pick the safe choice'", "title: 'Real or pretend?'"):
            with self.subTest(title=title):
                self.assertIn(title, app)
        self.assertIn("kind: 'ai'", app)
        self.assertIn("kind: 'blank'", app)
        self.assertIn("kind: 'choose'", app)
        self.assertIn("kind: 'realfake'", app)
        self.assertIn('data-arcade="${game.id}"', app)
        self.assertIn('function answerArcadeRound', app)
        self.assertIn('function finishArcadeGame', app)
        self.assertIn('cannot be proven by style alone', app)
        self.assertIn('renderGames();', app)

    def test_games_page_keeps_account_actions_and_navigation_on_a_single_line(self):
        response = self.client.get(reverse('lessons'))
        self.assertContains(response, 'class="auth-nav"')
        self.assertContains(response, 'class="main-nav"')
        self.assertContains(response, 'Lessons &amp; Games')
        self.assertNotContains(response, 'id="profileBtn"')
        self.assertContains(response, 'href="/login/"')
        self.assertContains(response, 'href="/signup/"')
        styles = Path(finders.find('susorsafe/v2.css')).read_text(encoding='utf-8')
        self.assertIn('@media (min-width:1121px)', styles)
        self.assertIn('.main-nav{flex-wrap:nowrap;gap:1px;margin-left:auto}', styles)
        self.assertIn('prefers-reduced-motion:reduce', Path(finders.find('susorsafe/styles.css')).read_text(encoding='utf-8'))

    def test_age_specific_profile_and_lesson_options_are_available(self):
        response = self.client.get(reverse('home'))
        self.assertContains(response, 'id="schoolStageLabel"')
        self.assertContains(response, 'id="profileNameLabel"')
        data = Path(finders.find('susorsafe/data.js')).read_text(encoding='utf-8')
        app = Path(finders.find('susorsafe/app.js')).read_text(encoding='utf-8')
        self.assertIn("id: 'preschool'", data)
        self.assertIn("id: 'working'", data)
        self.assertIn("id: 'scarf'", data)
        self.assertIn("id: 'backpack'", data)
        self.assertIn("badge: 'Digital Navigator'", app)
        self.assertIn("'Online Guardian'", app)
        self.assertIn("vocabIntro:", app)
        self.assertIn("activityLabels:", app)
        for pet in ("id: 'luna'", "id: 'pixel'", "id: 'orbit'", "id: 'pebble'", "id: 'comet'", "id: 'sprout'"):
            with self.subTest(pet=pet):
                self.assertIn(pet, data)
        for pet in ("id: 'seal'", "id: 'hedgehog'", "id: 'penguin'", "id: 'froglet'", "id: 'whale'", "id: 'redpanda'"):
            with self.subTest(pet=pet):
                self.assertIn(pet, data)
        self.assertIn('shopPriceMarkup(pet, owned, equipped)', app)
        self.assertIn('shop-price--points', app)
        self.assertIn('.shop-price--points{border:1px solid #9A6700;background:#FFE08A;color:#493000}', Path(finders.find('susorsafe/v2.css')).read_text(encoding='utf-8'))

    def test_signed_in_header_shows_points_and_profile_link(self):
        user = User.objects.create_user(username='profile_explorer', password='Password123!')
        self.client.force_login(user)
        response = self.client.get(reverse('home'))
        self.assertContains(response, 'id="profileBtn"')
        self.assertContains(response, reverse('lessons') + '#crew')
        self.assertContains(response, '<span>points</span>')
        self.assertContains(response, 'Log out')
        self.assertNotContains(response, 'href="/login/"')
        self.assertNotContains(response, 'href="/signup/"')

    def test_auth_pages_load_the_saved_age_theme(self):
        for url in (reverse('login'), reverse('page_signup')):
            with self.subTest(url=url):
                response = self.client.get(url)
                self.assertContains(response, 'class="auth-body"')
                self.assertContains(response, 'susorsafe/theme.js')
                self.assertContains(response, 'data-age-copy-adult=')

    def test_landing_page_contains_login_link(self):
        response = self.client.get(reverse('landing'))
        self.assertContains(response, reverse('login'))


class LoginPageTests(TestCase):
    def test_login_page_renders_successfully(self):
        response = self.client.get(reverse('login'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pages/login.html')

    def test_login_page_contains_oauth_options(self):
        response = self.client.get(reverse('login'))
        self.assertContains(response, 'Continue with Google')
        self.assertContains(response, 'Continue with Microsoft')
        self.assertContains(response, '/accounts/google/login/')
        self.assertContains(response, '/accounts/microsoft/login/')

    def test_invalid_login_credentials(self):
        response = self.client.post(reverse('login'), {
            'username': 'unknown_user',
            'password': 'bad_password',
        })
        self.assertEqual(response.status_code, 401)
        self.assertContains(response, 'Invalid username or password', status_code=401)

    def test_successful_login_returns_to_home(self):
        user = User.objects.create_user(username='home_explorer', password='Password123!')
        response = self.client.post(reverse('login'), {
            'username': user.username,
            'password': 'Password123!',
        })
        self.assertRedirects(response, reverse('home'))

    def test_static_files_exist(self):
        self.assertIsNotNone(finders.find('susorsafe/styles.css'))
        self.assertIsNotNone(finders.find('susorsafe/fonts.css'))
        self.assertIsNotNone(finders.find('susorsafe/theme.js'))


class ProfileModelTests(TestCase):
    def test_profile_automatically_created_for_new_user(self):
        user = User.objects.create_user(username='new_explorer', password='Password123!')
        self.assertTrue(hasattr(user, 'profile'))
        self.assertIsNotNone(user.profile.explorer_id)
        self.assertTrue(user.profile.explorer_id.startswith('usr_'))
        self.assertEqual(user.profile.coins, 0)
        self.assertEqual(user.profile.age_mode, 'kid')
