from django.test import SimpleTestCase
from django.urls import reverse
from django.contrib.staticfiles import finders

class LandingPageTests(SimpleTestCase):
    def test_landing_page_status_code_and_template(self):
        response = self.client.get(reverse('landing'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pages/landing.html')

    def test_landing_page_contains_static_assets(self):
        response = self.client.get(reverse('landing'))
        self.assertContains(response, '/static/css/style.css')
        self.assertContains(response, '/static/js/script.js')

    def test_static_files_exist(self):
        self.assertIsNotNone(finders.find('css/style.css'))
        self.assertIsNotNone(finders.find('js/script.js'))

