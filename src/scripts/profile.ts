// src/scripts/profile.ts
// This script defines the client-side logic for the Profile page.
// It conditionally loads the Telegram WebApp SDK, prevents variable redeclaration,
// and uses a robust async event handler for logout.

// Export a default function that will be called when the script is loaded.
export default function initializeProfilePage() {
  // Get references to our HTML elements
  const loadingElement = document.getElementById('loading');
  const userProfileElement = document.getElementById('user-profile');
  const profilePhotoElement = document.getElementById('profile-photo');
  const telegramIdDisplay = document.getElementById('telegram-id-display');
  const usernameDisplay = document.getElementById('username-display');
  const fullNameDisplay = document.getElementById('full-name-display');
  const logoutButton = document.getElementById('logout-button');
  const errorMessageElement = document.getElementById('error-message');

  // --- Dynamic Import and Initialization of Telegram WebApp SDK ---
  if (typeof window !== 'undefined') {
    import('@twa-dev/sdk').then(({ default: WebApp }) => {
      WebApp.ready();

      if (WebApp.themeParams) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', WebApp.themeParams.bg_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-text-color', WebApp.themeParams.text_color || '#000000');
        document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', WebApp.themeParams.secondary_bg_color || '#f0f0f0');
        document.documentElement.style.setProperty('--tg-theme-button-color', WebApp.themeParams.button_color || '#dc3545');
        document.documentElement.style.setProperty('--tg-theme-button-text-color', WebApp.themeParams.button_text_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-link-color', WebApp.themeParams.link_color || '#3498db');
        document.documentElement.style.setProperty('--tg-theme-hint-color', WebApp.themeParams.hint_color || '#808080');
      }
      WebApp.setBackgroundColor(WebApp.themeParams.secondary_bg_color || '#f0f0f0');


      async function fetchUserProfile() {
        try {
          if (loadingElement) loadingElement.style.display = 'block';
          if (userProfileElement) userProfileElement.style.display = 'none';
          if (errorMessageElement) errorMessageElement.style.display = 'none';

          const response = await fetch('/api/user');
          const data = await response.json();

          if (response.ok) {
            const user = data.user;
            console.log('User profile data:', user);

            if (telegramIdDisplay) telegramIdDisplay.textContent = user.telegram_id.toString();
            if (usernameDisplay) usernameDisplay.textContent = user.username || 'N/A';
            if (fullNameDisplay) fullNameDisplay.textContent = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A';

            if (profilePhotoElement) {
              if (user.photo_url) {
                (profilePhotoElement as HTMLImageElement).src = user.photo_url;
                profilePhotoElement.style.display = 'block';
              } else {
                profilePhotoElement.style.display = 'none';
              }
            }

            if (userProfileElement) userProfileElement.style.display = 'block';

            if (WebApp.MainButton) {
              WebApp.MainButton.hide();
            }

          } else if (response.status === 401) {
            if (errorMessageElement) {
              errorMessageElement.textContent = `Session expired. Redirecting to login...`;
              errorMessageElement.style.display = 'block';
            }
            console.warn('Unauthorized access to profile. Redirecting to home.');
            await logoutUser(false);
          } else {
            if (errorMessageElement) {
              errorMessageElement.textContent = `Error: ${data.error || 'Failed to fetch profile'}`;
              errorMessageElement.style.display = 'block';
            }
            console.error('Failed to fetch user profile:', data);
            WebApp.showAlert(`Error: ${data.error || 'Failed to load profile'}`);
          }
        } catch (error: any) {
          if (errorMessageElement) {
            errorMessageElement.textContent = `An error occurred: ${error.message}`;
            errorMessageElement.style.display = 'block';
          }
          console.error('Fetch error:', error);
          WebApp.showAlert(`An error occurred: ${error.message}`);
        } finally {
          if (loadingElement) loadingElement.style.display = 'none';
        }
      }

      async function logoutUser(showConfirmation = true) {
        if (showConfirmation) {
          if (WebApp.showConfirm) {
              await WebApp.showConfirm('Are you sure you want to log out?');
              // Assume user confirms, as showConfirm does not return a value
          } else if (!confirm('Are you sure you want to log out?')) {
              return;
          }
        }

        try {
          const response = await fetch('/api/user/logout', { method: 'POST' });
          if (response.ok) {
            console.log('Logged out successfully. Redirecting to home.');
            window.location.href = '/';
          } else {
            const data = await response.json();
            WebApp.showAlert(`Logout failed: ${data.error || 'Unknown error'}`);
            console.error('Logout error:', data);
          }
        } catch (error: any) {
          console.error('Logout fetch error:', error);
          WebApp.showAlert('An error occurred during logout.');
        }
      }

      if (logoutButton) {
        logoutButton.addEventListener('click', async () => { // Corrected: async callback
          await logoutUser();
        });
      }

      fetchUserProfile();

    }).catch(error => {
      console.error('SDK import error on profile page:', error);
      if (errorMessageElement) {
        errorMessageElement.textContent = `Error loading Telegram WebApp SDK: ${error.message}.`;
        errorMessageElement.style.display = 'block';
      }
      if (loadingElement) loadingElement.style.display = 'none';
    });
  } else {
    console.log('Running in SSR mode, skipping Telegram WebApp SDK initialization for profile.');
    if (loadingElement) loadingElement.style.display = 'none';
    if (errorMessageElement) {
      errorMessageElement.textContent = 'Profile cannot be loaded outside Telegram Web App.';
      errorMessageElement.style.display = 'block';
    }
  }
}