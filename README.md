# Expense Tracker App (React Native + Expo)

A mobile application built with React Native and Expo to help track personal expenses. Features OCR capabilities using Google Cloud Vision API to automatically extract expense details from receipt photos.

## Features

*   **Scan Receipts:** Select an image from the gallery or take a photo (basic setup done, camera logic similar to gallery).
*   **OCR Extraction:** Uses Google Cloud Vision API (`DOCUMENT_TEXT_DETECTION`) to extract text from receipts.
*   **Smart Parsing:** Attempts to automatically parse the store name, total amount, and date from the extracted text.
*   **Add Expenses:** Add expenses to the list based on scanned results.
*   **Expense List:** View expenses grouped by month (newest first).
*   **Monthly Totals:** See the total spending for each month in the list headers.
*   **Overall Total:** Displays the total sum of all recorded expenses.
*   **Delete Expenses:** Remove individual expenses from the list with confirmation.

<!-- Add screenshots here later -->
<!-- ![Screenshot 1](path/to/screenshot1.png) -->
<!-- ![Screenshot 2](path/to/screenshot2.png) -->

## Technology Stack

*   **Framework:** React Native (with Expo SDK 52+)
*   **Language:** TypeScript
*   **Routing:** Expo Router
*   **State Management:** React Hooks (`useState`)
*   **Image Handling:** `expo-image-picker`
*   **Configuration:** `expo-constants`, `dotenv`
*   **Date Handling:** `date-fns`
*   **OCR Service:** Google Cloud Vision API
*   **Build Service:** Expo Application Services (EAS) Build

## Prerequisites

Before you begin, ensure you have met the following requirements:

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) package manager
*   [Expo CLI](https://docs.expo.dev/get-started/installation/) (Optional but helpful: `npm install -g expo-cli`)
*   [EAS CLI](https://docs.expo.dev/eas/install/) (`npm install -g eas-cli`)
*   An Expo account ([expo.dev](https://expo.dev/)) - Login via `eas login`.
*   A Google Cloud Platform account with billing enabled.
*   An Android device or emulator for testing/running.
*   Expo Go app (for running during development).

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # OR
    yarn install
    ```

3.  **Set up Google Cloud Vision API:**
    *   Go to the [Google Cloud Console](https://console.cloud.google.com/).
    *   Create a new project or select an existing one.
    *   Enable the **Cloud Vision API**.
    *   Go to "APIs & Services" -> "Credentials".
    *   Create an **API Key**.
    *   **Important:** Restrict the API key to only allow the "Cloud Vision API" for security.

4.  **Create Environment File:**
    *   In the root directory of the project, create a file named `.env`
    *   Add your Google Cloud Vision API key to this file:
        ```env
        # .env
        GOOGLE_CLOUD_VISION_API_KEY=PASTE_YOUR_ACTUAL_API_KEY_HERE
        ```
    *   **Crucial:** Add `.env` to your `.gitignore` file to avoid committing your API key.

5.  **Check Configuration:**
    *   Ensure the `app.config.js` file correctly loads the API key into `extra.googleCloudVisionApiKey` using `dotenv`.
    *   Ensure `android.package` in `app.config.js` or `app.json` is set to a unique identifier (e.g., `com.yourname.expensetracker`).

## Running the App (Development)

1.  **Start the Metro bundler:**
    ```bash
    npx expo start
    ```

2.  **Run on your device:**
    *   Open the Expo Go app on your Android or iOS device.
    *   Scan the QR code displayed in the terminal.
    *   The app should load, and you can test features, including the API-based OCR scanning.

## Building a Shareable APK (Production)

This process uses EAS Build to create a standalone Android application package.

1.  **Ensure EAS CLI is installed and you are logged in:**
    ```bash
    npm install -g eas-cli
    eas login
    ```

2.  **Configure for APK build:**
    *   Make sure your `eas.json` file under `build.production` includes the `android.buildType` setting:
        ```json
        // eas.json (inside build.production)
        "production": {
          "android": {
            "buildType": "apk" // Ensure this line is present
          },
          "autoIncrement": true // Or your existing settings
        }
        ```

3.  **Start the build:**
    ```bash
    eas build --profile production --platform android
    ```

4.  **Wait and Download:**
    *   EAS will build the app in the cloud (this takes several minutes).
    *   A link to download the `.apk` file will be provided in the terminal upon completion.

5.  **Install the APK:**
    *   Transfer the downloaded `.apk` file to an Android device.
    *   Enable "Install from Unknown Sources" in the device's security settings.
    *   Open the `.apk` file using a file manager and follow the prompts to install.

## Important Notes

*   **API Key Security:** The method used stores the Google Cloud Vision API key within the built application's code bundle. While it's loaded via `.env` (preventing it from being in version control), it is **not secure** for a widely distributed app. For production apps, use a backend proxy to handle API calls securely. This setup is acceptable for personal use or sharing with trusted individuals only.
*   **OCR Accuracy:** The accuracy of the OCR and the parsing logic depends heavily on the quality and format of the receipt image. The current parsing logic is heuristic and may require further refinement for different receipt styles or currencies.
*   **Date Parsing:** Uses `date-fns` for improved reliability but may still struggle with highly unusual date formats.

## Future Enhancements (Ideas)

*   Implement manual expense entry via a Modal form.
*   Add editing functionality for existing expenses.
*   Improve OCR parsing logic for greater accuracy and more extracted fields (e.g., individual items).
*   Allow user correction of scanned data before saving.
*   Implement data persistence using AsyncStorage or a database.
*   Add charts or visual summaries of spending.
*   Implement user authentication.
*   Create a secure backend proxy for API calls.

---

*Consider adding a license here if you plan to share the code publicly (e.g., MIT License).*