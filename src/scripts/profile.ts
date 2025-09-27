// src/scripts/profile.ts
// This script contains the client-side logic for the Profile page of our Mini App.
// It now conditionally loads the Telegram WebApp SDK, prevents variable redeclaration,
// and uses a robust async event handler for logout.

// Wrap the entire script in an IIFE to create a private scope for its variables.
(() => {
  // Get references to our HTML elements
  // These are now block-scoped within the IIFE.
  const loadingElement = document.getElementById('loading');
  const userProfileElement = document.getElementById('user-profile');
  const profilePhotoElement = document.getElementById('profile-photo');
  const telegramIdDisplay = document.getElementById('telegram-id-display');
  const usernameDisplay = document.getElementById('username-display');
  const fullNameDisplay = document.getElementById('full-name-display');
  const logoutButton = document.getElementById('logout-button');
  const errorMessageElement = document.getElementById('error-message');

  // --- Dynamic Import and Initialization of Telegram WebApp SDK ---
  // This entire block only runs if `window` is defined (i.e., on the client-side).
  if (typeof window !== 'undefined') {
    // Dynamically import WebApp.
    import('@twa-dev/sdk').then(({ default: WebApp }) => {
      // Initialize Telegram WebApp SDK
      WebApp.ready();

      // Apply Telegram's theme parameters, similar to the Home page
      if (WebApp.themeParams) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', WebApp.themeParams.bg_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-text-color', WebApp.themeParams.text_color || '#000000');
        document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', WebApp.themeParams.secondary_bg_color || '#f0f0f0');
        document.documentElement.style.setProperty('--tg-theme-button-color', WebApp.themeParams.button_color || '#dc3545'); // Use red for logout button by default
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
              const confirmedResult = await WebApp.showConfirm('Are you sure you want to log out?');
              if (typeof confirmedResult === 'boolean' && !confirmedResult) return;
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

      // THIS IS THE CORRECTION for the void error, using an async callback
      if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
          await logoutUser();
        });
      }

      fetchUserProfile();

    }).catch(error => {
      // Handle potential errors if the SDK import itself fails
      console.error('SDK import error on profile page:', error);
      if (errorMessageElement) {
        errorMessageElement.textContent = `Error loading Telegram WebApp SDK: ${error.message}.`;
        errorMessageElement.style.display = 'block';
      }
      if (loadingElement) loadingElement.style.display = 'none';
    });
  } else {
    // Fallback for non-browser environments (like SSR)
    console.log('Running in SSR mode, skipping Telegram WebApp SDK initialization for profile.');
    if (loadingElement) loadingElement.style.display = 'none';
    if (errorMessageElement) {
      errorMessageElement.textContent = 'Profile cannot be loaded outside Telegram Web App.';
      errorMessageElement.style.display = 'block';
    }
  }
})(); // End of IIFE