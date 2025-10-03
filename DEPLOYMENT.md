# 🚀 Simple Deployment Guide - Promotion Wheel

This guide shows how to deploy the application using the Google Sheets API directly, without Google Apps Script.

## 📋 Requirements

- [ ] Google account
- [ ] Cloudflare account (free)
- [ ] Git repository (GitHub, GitLab, etc.)
- [ ] Node.js 18+ (local installation)

## 🔧 Step 1: Google Sheets Preparation

### 1.1 Create a Google Sheet

1.  Go to [Google Sheets](https://sheets.google.com)
2.  Create a new spreadsheet
3.  Name it "Promotion Wheel Results"
4.  **Copy the Sheet ID from the URL**:
    ```
    https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
    ```

### 1.2 Prepare the Sheet Structure

1.  **Set the first row as headers**:
    - A1: `Timestamp`
    - B1: `FullName`
    - C1: `Phone`
    - D1: `Prize`
2.  **Rename the sheet to "Results"** (right-click the "Sheet1" tab in the bottom-left corner)
3.  **Sharing settings**:
    - Click the "Share" button in the top-right corner
    - Select "Anyone with the link can edit"
    - **This setting is important!** It's necessary for the API to have write permissions.

### 1.3 Get a Google Sheets API Key

1.  Go to the [Google Cloud Console](https://console.cloud.google.com)
2.  Create a new project or select an existing one
3.  Go to **APIs & Services > Library**
4.  Search for "Google Sheets API" and enable it
5.  Go to **APIs & Services > Credentials**
6.  Select **"+ CREATE CREDENTIALS" > "API key"**
7.  Copy the API key
8.  **Restrict the API key** (optional but recommended):
    - Click on the API key
    - Under "Application restrictions," select "HTTP referrers"
    - Add your Cloudflare Pages domain

## 🌐 Step 2: Cloudflare Pages Setup

### 2.1 Connect Repository

1.  Go to [Cloudflare Pages](https://pages.cloudflare.com)
2.  Click "Create a project"
3.  Connect your Git provider (GitHub, GitLab, etc.)
4.  Select your repository
5.  Click "Begin setup"

### 2.2 Build Settings

```
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: / (leave empty)
```

### 2.3 Environment Variables

Add the following environment variables in the Cloudflare Pages dashboard:

```env
# Admin password hash (generate with the command below)
ADMIN_PASSWORD_HASH=$2a$10$your.bcrypt.hash.here

# Google Sheets information
GOOGLE_SHEETS_ID=your_sheet_id_from_url
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key

# Domain (update after the first deploy)
ALLOWED_ORIGIN=https://your-project-name.pages.dev
```

### 2.4 Generate Admin Password Hash

In your local terminal:

```bash
npm run generate-hash
# Or manually:
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

## 🚀 Step 3: Deploy

1.  Click "Save and Deploy"
2.  Wait for the build to complete
3.  Note your Pages URL
4.  Update `ALLOWED_ORIGIN` in the environment variables
5.  Redeploy if necessary

## 🧪 Step 4: Test

### 4.1 Basic Test

1.  Go to your Pages URL
2.  Enter test data:
    - Name: `Test User`
    - Phone: `12345678901`
3.  Spin the wheel
4.  Check the result

### 4.2 Google Sheets Check

1.  Open your Google Sheet
2.  Check that a new row has been added to the "Results" sheet
3.  Verify that the data is in the correct columns

### 4.3 Admin Panel Test

1.  Click the gear icon in the bottom-right corner
2.  Enter your admin password
3.  Change the wheel settings
4.  Save and check that the wheel has been updated

## ⚙️ Step 5: Settings

### 5.1 Wheel Settings

-   **In development mode**: Settings are stored in localStorage
-   **In production**: Settings are stored in browser memory
-   **On page refresh**: Settings are preserved
-   **When cache is cleared**: Settings are reset (not critical)

### 5.2 Default Settings

The application loads with the following default prizes:
- Free Coffee
- 50% Discount
- Free Dessert
- Try Again (2x weight)
- Free Appetizer
- 25% Discount
- Free Drink
- Lucky Draw

## 🔧 Troubleshooting

### Common Issues

**"Google Sheets API error"**
- Check that the Sheet ID is correct
- Verify that the API key is active
- Check that the Sheet is shared as "Anyone can edit"

**"Phone number already exists"**
- The same phone number exists in Google Sheets
- This is normal; the user has already participated

**Admin panel not opening**
- Check that `ADMIN_PASSWORD_HASH` was generated correctly
- Verify that the password is entered correctly

**Wheel settings disappear**
- Check that localStorage is active in the browser
- Does not work in private/incognito mode

### Debug Mode

Add to your environment variables:
```env
DEBUG=true
```

## 📊 Google Sheets Structure

### Results Sheet
| A (Timestamp) | B (FullName) | C (Phone) | D (Prize) |
|---------------|--------------|-----------|-----------|
| 2024-01-01T10:00:00Z | John Doe | 1234567890 | Free Coffee |

### API Limits
- **Google Sheets API**: 100 requests per day (free)
- **Cloudflare Pages**: 100,000 requests per month (free)
- **For high traffic**: Increase the quota in the Google Cloud Console

## 🔄 Updates

### Application Update
1.  Make code changes
2.  Push to Git
3.  Cloudflare Pages will automatically deploy

### Settings Update
- Done from the admin panel
- Stored in localStorage
- Applies to all users

## 📞 Support

If you have problems:
1.  Check the Cloudflare Pages function logs
2.  Examine error messages in the browser console
3.  Check your Google Sheets API quota
4.  Verify that the environment variables are correct

---