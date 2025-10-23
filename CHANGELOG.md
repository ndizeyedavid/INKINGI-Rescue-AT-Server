# Changelog

All notable changes to the INKINGI Rescue USSD Server project.

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
