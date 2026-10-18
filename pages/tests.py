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

    def test_microsoft_oauth_redirects_to_azure(self):
        # When user initiates Microsoft login, it redirects to login.microsoftonline.com
        response = self.client.post('/accounts/microsoft/login/', HTTP_HOST='susorsafe.courses')
        self.assertEqual(response.status_code, 302)
        location = response['Location']
        self.assertIn('login.microsoftonline.com', location)
        self.assertIn('client_id=6fb9ae22-cac3-402e-8970-d7f284e2b1a7', location)
        self.assertIn('redirect_uri=', location)
        self.assertIn('accounts%2Fmicrosoft%2Flogin%2Fcallback%2F', location)

    def test_oauth_start_view_delegates_to_microsoft_login(self):
        # Ensure /oauth/microsoft/ delegates to allauth microsoft login and preserves next
        response = self.client.get(reverse('oauth_start', kwargs={'provider': 'microsoft'}) + '?next=/dashboard/', HTTP_HOST='susorsafe.courses')
        self.assertEqual(response.status_code, 302)
        self.assertIn('/accounts/microsoft/login/', response['Location'])
        self.assertIn('next=%2Fdashboard%2F', response['Location'])

    def test_static_files_exist(self):
        self.assertIsNotNone(finders.find('susorsafe/styles.css'))
        self.assertIsNotNone(finders.find('susorsafe/fonts.css'))


class ProfileModelTests(TestCase):
    def test_profile_automatically_created_for_new_user(self):
        user = User.objects.create_user(username='new_explorer', password='Password123!')
        self.assertTrue(hasattr(user, 'profile'))
        self.assertIsNotNone(user.profile.explorer_id)
        self.assertTrue(user.profile.explorer_id.startswith('usr_'))
        self.assertEqual(user.profile.coins, 0)
        self.assertEqual(user.profile.age_mode, 'kid')
