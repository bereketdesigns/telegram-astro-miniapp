// src/scripts/home.ts
// This script contains the client-side logic for the Home page of our Mini App.
// It now conditionally loads the Telegram WebApp SDK to prevent SSR errors.

// Get references to our HTML elements (they must exist in index.astro)
const statusElement = document.getElementById('status');
const loaderElement = document.getElementById('loader');
const userInfoElement = document.getElementById('user-info');
const usernameDisplayElement = document.getElementById('username-display');
const errorMessageElement = document.getElementById('error-message');

// Helper function to display messages
function showStatus(message: string, isError: boolean = false) {
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.style.color = isError ? 'red' : 'inherit';
  }
}

// --- Dynamic Import and Initialization of Telegram WebApp SDK ---
// This entire block only runs if `window` is defined (i.e., on the client-side).
if (typeof window !== 'undefined') {
  // Dynamically import WebApp. This prevents the SDK from being processed on the server.
  import('@twa-dev/sdk').then(({ default: WebApp }) => {
    // Initialize the Telegram WebApp SDK.
    WebApp.ready();

    // Apply Telegram's theme parameters to our page for a native look and feel.
    if (WebApp.themeParams) {
      document.documentElement.style.setProperty('--tg-theme-bg-color', WebApp.themeParams.bg_color || '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-text-color', WebApp.themeParams.text_color || '#000000');
      document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', WebApp.themeParams.secondary_bg_color || '#f0f0f0');
      document.documentElement.style.setProperty('--tg-theme-button-color', WebApp.themeParams.button_color || '#007bff');
      document.documentElement.style.setProperty('--tg-theme-button-text-color', WebApp.themeParams.button_text_color || '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-link-color', WebApp.themeParams.link_color || '#3498db');
      document.documentElement.style.setProperty('--tg-theme-hint-color', WebApp.themeParams.hint_color || '#808080');
    }
    WebApp.setBackgroundColor(WebApp.themeParams.secondary_bg_color || '#f0f0f0');

    async function authenticateUser() {
      try {
        // Get the `initData` from the Telegram WebApp SDK.
        const initData = WebApp.initData;

        if (!initData) {
          showStatus('Telegram initData not available. Please open the app from Telegram.', true);
          if (loaderElement) loaderElement.style.display = 'none';
          return;
        }

        showStatus('Authenticating...');

        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ initData }),
        });

        const data = await response.json();

        if (response.ok) {
          const user = data.user;
          console.log('Authentication successful:', user);
          showStatus('Authenticated!');

          if (usernameDisplayElement) usernameDisplayElement.textContent = user.username || user.first_name || 'Guest';
          if (userInfoElement) userInfoElement.style.display = 'block';

          if (WebApp.MainButton) {
            WebApp.MainButton.setText('Go to Profile');
            WebApp.MainButton.onClick(() => window.location.href = '/profile');
            WebApp.MainButton.show();
            WebApp.MainButton.enable();
          }

        } else {
          showStatus(`Authentication failed: ${data.error || 'Unknown error'}`, true);
          if (errorMessageElement) {
            errorMessageElement.textContent = data.error || 'Failed to authenticate.';
            errorMessageElement.style.display = 'block';
          }
          console.error('Authentication error:', data);
          WebApp.showAlert(`Authentication Failed: ${data.error || 'Unknown error'}`);
        }
      } catch (error: any) {
        showStatus('An error occurred during authentication.', true);
        if (errorMessageElement) {
          errorMessageElement.textContent = `Error: ${error.message}`;
          errorMessageElement.style.display = 'block';
        }
        console.error('Fetch error:', error);
        WebApp.showAlert(`Error: ${error.message}`);
      } finally {
        if (loaderElement) loaderElement.style.display = 'none';
      }
    }

    authenticateUser();
  }).catch(error => {
    // Handle potential errors if the SDK import itself fails
    showStatus('Failed to load Telegram WebApp SDK.', true);
    if (errorMessageElement) {
      errorMessageElement.textContent = `Error loading SDK: ${error.message}`;
      errorMessageElement.style.display = 'block';
    }
    if (loaderElement) loaderElement.style.display = 'none';
    console.error('SDK import error:', error);
  });
} else {
  // Fallback for non-browser environments (like SSR)
  console.log('Running in SSR mode, skipping Telegram WebApp SDK initialization.');
  showStatus('Please open the app from Telegram.', true);
  if (loaderElement) loaderElement.style.display = 'none';
}