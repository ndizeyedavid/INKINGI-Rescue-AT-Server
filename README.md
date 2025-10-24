# INKINGI Rescue - USSD & SMS Backend Server

A modular USSD application for emergency rescue services in Rwanda, built with Express.js and Africa's Talking API.

## Features

- **Multi-language Support**: English, Kinyarwanda, French, and Kiswahili
- **Emergency Reporting**: Report various types of emergencies (Fire, Medical, Assault, etc.)
- **Distress Alert**: Quick SOS button for immediate emergencies
- **Community Posts**: Access news and events
- **Hotlines**: Quick access to emergency contact numbers
- **Session Management**: Maintains user context throughout the USSD session

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ndizeyedavid/INKINGI-Rescue-AT-Server
cd INKINGI-Rescue-AT-server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file:

```env
PORT=8080
AT_API_KEY=your_africas_talking_api_key
AT_USERNAME=your_africas_talking_username
GEMINI_API_KEY=your_gemini_api_key
```

4. Start the server:

```bash
npm start       # Production with nodemon
npm run dev     # Development mode
```

## Development

### Adding New Menu Items

1. **Add menu to `src/config/ussdMenus.js`**:

```javascript
export const ussdMenus = {
  // ... existing menus
  newMenu: {
    text: `CON Your menu text
    1. Option 1
    2. Option 2
    0. Go back`,
    options: {
      1: "nextStep1",
      2: "nextStep2",
      0: "previousMenu",
    },
  },
};
```

2. **Add handler in `src/controllers/ussdController.js`** (if terminal action):

```javascript
export const terminalHandlers = {
  // ... existing handlers
  newHandler: (userData) => {
    // Your logic here
    return `END Response message`;
  },
};
```

### Adding Middleware

Create a new file in `src/middlewares/` and import it in `server.js`:

```javascript
import { yourMiddleware } from "./middlewares/yourMiddleware.js";
app.use(yourMiddleware);
```

### Session Management

Access session data using the `sessionManager`:

```javascript
import { sessionManager } from "../utils/sessionManager.js";

// Get session
const session = sessionManager.getSession(sessionId);

// Set session data
sessionManager.setSession(sessionId, { key: "value" });

// Get/Set language
const lang = sessionManager.getLanguage(sessionId);
sessionManager.setLanguage(sessionId, "en");
```

## Testing USSD Locally

1. Use Africa's Talking Simulator: https://simulator.africastalking.com/
2. Or use ngrok to expose your local server:

```bash
npm run ngrok
```

## API Endpoints

- `GET /` - Health check endpoint
- `POST /ussd` - Main USSD endpoint (receives Africa's Talking callbacks)

## USSD Request Format

Africa's Talking sends POST requests with:

```json
{
  "sessionId": "unique_session_id",
  "serviceCode": "*123#",
  "phoneNumber": "+250788123456",
  "text": "1*2*3"
}
```

## Implementation Plan

![IMG_0382](https://github.com/user-attachments/assets/cab105da-3161-48b5-9f94-f7a641897e10)
