# Quickstart: Optimize Auto-Refresh API Calls

This quickstart guide provides instructions to quickly set up and verify the "Optimize Auto-Refresh API Calls" feature.

## 1. Run the Application

First, ensure the application is running locally.

```bash
# Navigate to the project root directory
cd /Users/rich/Developer/Github/forecast-site

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The application should now be accessible in your web browser, typically at `http://localhost:3000`.

## 2. Navigate to the Forecast Page

Open your web browser and go to the main forecast page (e.g., `http://localhost:3000`).

## 3. Enable Auto-Refresh

Locate the auto-refresh setting (e.g., a toggle or checkbox) on the forecast page and ensure it is enabled. Note the auto-refresh interval.

## 4. Observe Optimized API Calls (Indoor Parameter Changes)

1.  Open your browser's developer tools (usually F12 or right-click -> Inspect, then go to the "Network" tab).
2.  Clear any existing network requests in the Network tab.
3.  On the forecast page, modify an **indoor temperature-related parameter** (e.g., "Insulation Value" or "Indoor Temperature Offset") without changing the postcode or date.
4.  Wait for the auto-refresh interval to elapse.
5.  **Observation**: You should see the indoor temperature calculation on the display update, but **NO new network request** should appear in the developer tools for the external weather API. This confirms that the API call was avoided.

## 5. Observe API Calls (Outdoor Parameter Changes)

1.  Clear any existing network requests in the Network tab.
2.  On the forecast page, modify an **outdoor weather-related parameter** (e.g., change the "Postcode" or "Date").
3.  Wait for the auto-refresh interval to elapse.
4.  **Observation**: You should see a **new network request** for the external weather API (e.g., to `/weather/forecast` or similar endpoint), and the entire forecast display should update. This confirms that the API call was made when necessary.

By following these steps, you can quickly verify the functionality and optimization provided by this feature.
