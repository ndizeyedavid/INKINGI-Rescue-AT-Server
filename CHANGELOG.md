# Changelog

All notable changes to the INKINGI Rescue USSD Server project.

## 2025-10-24

### Added

#### Internationalization (i18n)

- **Multi-language Support**: Full localization in 4 languages (English, Kinyarwanda, French, Swahili)
- **i18n Configuration** (`src/config/i18n.js`): Centralized translation management using i18n-js
- **Translation Files**: Complete translations for all USSD menus and responses
  - `src/locales/en.json` - English
  - `src/locales/rw.json` - Kinyarwanda
  - `src/locales/fr.json` - French
  - `src/locales/sw.json` - Swahili
- **Dynamic Menu Generation**: USSD menus now generated based on user's language preference
- **Session-based Language Persistence**: User's language choice remembered throughout session

#### AI Emergency Assistance

- **Gemini AI Integration** (`src/services/aiService.js`): Google Gemini AI for emergency guidance
- **AI System Instructions** (`src/config/ai-instructions.txt`): Comprehensive role definition for emergency response
- **AI Assistance Menu**: New main menu option for AI-powered emergency guidance
- **Emergency Type Selection**: AI guidance for Fire, Medical, Accident, Crime/Safety emergencies
- **Custom AI Questions**: Users can ask specific emergency questions in natural language
- **Multi-language AI Responses**: AI responds in user's selected language
- **Fallback Guidance**: Default emergency instructions if AI service unavailable
- **Streaming Responses**: Efficient response handling using Gemini's streaming API

#### User Input Features

- **Free Text Input**: Support for custom text input in emergency reporting and AI queries
- **Additional Info Field**: Users can provide custom descriptions when reporting emergencies
- **Smart Navigation**: Automatic detection of text input vs menu selections

### Changed

#### USSD Menu System

- **Main Menu**: Added AI Assistance option (now 6 options instead of 5)
- **Dynamic Menus**: All menus now support language switching on-the-fly
- **Menu Text Generation**: Converted from static to dynamic function-based generation
- **Navigation Logic**: Enhanced to handle free text input and custom AI requests

#### Emergency Reporting

- **Custom Descriptions**: Users can now provide detailed emergency descriptions
- **Skip Option**: Users can skip additional info and use default descriptions
- **Session Storage**: Custom text stored in session for submission

#### API Configuration

- **Gemini API**: Added `GEMINI_API_KEY` environment variable
- **Model Selection**: Using `gemini-flash-lite-latest` for optimal performance

### Technical Improvements

#### Code Organization

- **Modular i18n System**: Centralized translation management with helper functions
- **AI Service Layer**: Dedicated service for AI interactions with error handling
- **Enhanced Session Management**: Support for language preferences and custom input storage
- **Improved Navigation**: Special handling for dynamic menus and text input

#### Error Handling

- **AI Fallbacks**: Graceful degradation to default guidance when AI unavailable
- **Translation Fallbacks**: Default to English if translation missing
- **Input Validation**: Smart detection of menu choices vs custom text

### Dependencies Added

- `i18n-js@^4.5.1` - Internationalization framework
- `@google/genai@latest` - Google Gemini AI SDK

### Configuration Updates

- `.env.example`: Added `GEMINI_API_KEY` configuration
- System instructions file for AI behavior definition

---

## 2025-10-23

### Added

#### Backend API Integration

- **Backend API Service Layer** (`src/services/backendApiService.js`)

  - Created comprehensive HTTP client using Axios
  - Implemented request/response interceptors with detailed logging
  - Added automatic error handling and response transformation
  - Configured 10-second timeout for all API requests

- **Backend API Configuration** (`src/config/backendApi.js`)
  - Centralized API endpoint definitions
  - Environment-based base URL configuration via `BACKEND_API_URL`
  - Organized endpoints by category (Emergency, Distress, Posts, Users)

#### Emergency Management

- **Emergency Reporting**

  - Integrated emergency reporting with backend via `POST /ussd/report-emergency`
  - Sends comprehensive emergency data including type, description, location, and status
  - Generates unique reference IDs (format: `INK12345678`)
  - Stores emergency data in session for tracking
  - Graceful fallback if backend is unavailable

- **View All Emergencies**

  - Fetches all emergencies from `GET /ussd/emergencies`
  - Displays emergency type, status, and reporter information
  - Shows up to 5 emergencies with pagination support
  - Stores emergencies list in session for detail view selection

- **My Emergencies**

  - Fetches user-specific emergencies from `GET /ussd/user-emergencies`
  - Filters by phone number
  - Displays emergency type, status, and truncated ID
  - Separate from "View All Emergencies" for better UX

- **Emergency Detail View**
  - Fetches individual emergency details via `GET /ussd/emergency/{id}`
  - Displays comprehensive information:
    - Emergency type, status, and priority
    - Location/address
    - Reporter name and phone number
    - Timestamp
  - Session-based selection from emergency lists

#### Distress Alert System

- **Distress Alert Trigger**
  - Integrated with backend via `POST /ussd/distress`
  - Sends automated message: "Urgent help needed!"
  - Includes user phone number and location
  - Generates reference ID for tracking
  - Immediate confirmation to user

#### Community Posts/News

- **Posts List View**

  - Fetches community posts from `GET /ussd/posts`
  - Displays up to 5 posts with truncated titles
  - Stores posts in session for detail view selection

- **Post Detail View**
  - Fetches individual post details via `GET /ussd/posts/{id}`
  - Displays:
    - Post title
    - Content (first 200 characters)
    - Author information
    - Posted timestamp
  - Session-based selection from posts list

#### Data Helpers & Utilities

- **USSD Data Helpers** (`src/utils/ussdDataHelpers.js`)
  - `fetchAndFormatAllEmergencies()` - Formats all emergencies for USSD display
  - `fetchAndFormatUserEmergencies()` - Formats user-specific emergencies
  - `fetchAndFormatEmergencyDetails()` - Formats detailed emergency view
  - `fetchAndFormatPosts()` - Formats posts list for USSD display
  - `fetchAndFormatPostDetails()` - Formats detailed post view
  - Session management helpers for storing and retrieving selected items

#### Navigation & Menu System

- **Dynamic Menu Handlers**

  - `viewEmergencies` - Fetches and displays all emergencies
  - `myEmergencies` - Fetches and displays user's emergencies
  - `news` - Fetches and displays community posts
  - `viewEmergency` - Displays selected emergency details
  - `viewNews` - Displays selected post details

- **Enhanced Navigation Logic**
  - Automatic detection of detail view selections
  - Index-based selection from lists (1-5)
  - Session-based state management for multi-level navigation

### Changed

#### API Service Functions

- **Response Transformation**

  - All API responses now transformed to consistent format
  - `getEmergencies()` returns `{ emergencies: [...], total: N }`
  - `getUserEmergencies()` returns `{ emergencies: [...], total: N }`
  - `getPosts()` returns `{ posts: [...], total: N }`
  - `getEmergencyById()` extracts data from nested response
  - `getPostById()` extracts data from nested response

- **Language Handlers**
  - Removed backend sync for language updates (no longer supported by backend)
  - Language preferences now stored in session only

#### Configuration

- **Environment Variables** (`.env.example`)

  - Added `BACKEND_API_URL` configuration
  - Default: `http://localhost:3000`
  - Production-ready configuration support

- **Endpoint Updates**
  - Updated `GET_USER_EMERGENCIES` to use `/ussd/user-emergencies`
  - Changed posts endpoints from `/ussd/news` to `/ussd/posts`
  - Added dedicated `/ussd/distress` endpoint

### Removed

- **Unsupported Endpoints**

  - Removed `UPDATE_EMERGENCY` endpoint (not supported by backend)
  - Removed `UPDATE_USER_LANGUAGE` endpoint (not supported by backend)
  - Removed `GET_NEWS`, `GET_NEWS_BY_ID` endpoints (replaced with posts)
  - Removed `GET_EVENTS`, `GET_EVENT_BY_ID` endpoints (replaced with posts)

- **SMS Notifications** (Temporarily Disabled)
  - Commented out SMS confirmation calls in emergency reporting
  - Commented out SMS alerts in distress confirmation
  - Can be re-enabled when SMS service is configured

### Technical Details

#### API Request/Response Flow

```
USSD Controller → Backend API Service → Axios Client → Backend API
                                                      ↓
USSD Response ← Data Transformation ← Response Interceptor ← Backend Response
```

#### Session Management

- Stores emergency lists for detail view navigation
- Stores post lists for detail view navigation
- Tracks last emergency submission
- Tracks distress alert triggers
- Language preference storage

#### Error Handling

- Graceful degradation when backend is unavailable
- Fallback messages for users
- Comprehensive error logging
- User-friendly error messages in USSD responses

#### Logging

- Request logging: `🌐 Backend API Request: METHOD /endpoint`
- Success logging: `✅ Backend API Response: STATUS /endpoint`
- Error logging: `❌ Backend API Error: STATUS /endpoint`
- Emergency tracking: `✅ Emergency saved to backend`
- Distress tracking: `✅ Distress alert sent to backend`

### API Endpoints Used

#### Emergency Endpoints

- `POST /ussd/report-emergency` - Report new emergency
- `GET /ussd/emergencies` - Get all emergencies (with optional phone filter)
- `GET /ussd/emergency/{id}` - Get emergency by ID
- `GET /ussd/user-emergencies?phoneNumber={phone}` - Get user's emergencies

#### Distress Endpoint

- `POST /ussd/distress` - Trigger distress alert

#### Community Posts Endpoints

- `GET /ussd/posts` - Get all posts
- `GET /ussd/posts/{id}` - Get post by ID

#### User Endpoints

- `POST /ussd/create-user` - Create new user
- `GET /ussd/user?phoneNumber={phone}` - Get user by phone number

### Dependencies

No new dependencies added. Uses existing:

- `axios` - HTTP client for API requests
- `dotenv` - Environment variable management

### Configuration Required

1. Set `BACKEND_API_URL` in `.env` file
2. Ensure backend API is running and accessible
3. Configure Africa's Talking credentials (existing)

### Notes

- All backend integrations include error handling and fallbacks
- USSD flow continues even if backend is temporarily unavailable
- Reference IDs generated locally for immediate user feedback
- Location data currently placeholder ("Location to be determined")
- Future enhancement: Integrate actual location services

---

## Backend API Data Formats

### Emergency Report Request

```json
{
  "phoneNumber": "+250788123456",
  "emergencyType": "fire",
  "referenceId": "INK12345678",
  "description": "Fire emergency reported via USSD",
  "location": "Location to be determined",
  "status": "pending",
  "reportedAt": "2025-10-23T18:42:18.000Z"
}
```

### Distress Alert Request

```json
{
  "phoneNumber": "+250788123456",
  "message": "Urgent help needed!",
  "location": "Location to be determined"
}
```

### Emergency Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "FIRE",
      "status": "PENDING",
      "priority": "HIGH",
      "description": "...",
      "address": "...",
      "createdAt": "2025-10-23T18:42:18.217Z",
      "user": {
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "+250788123456"
      }
    }
  ]
}
```
