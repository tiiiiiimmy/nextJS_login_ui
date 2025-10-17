# Goldenset Registration Form

A modern, fully-featured registration form built for Goldenset with Next.js 15, TypeScript, and custom CSS styling. This project demonstrates best practices in form handling, validation, accessibility, and testing with Goldenset's vibrant brand identity.

## Features

- **Modern Tech Stack**: Built with Next.js 15 App Router, TypeScript, and React 19
- **Goldenset Branding**: Vibrant color palette (orange, yellow, green, blue, purple) with custom styling
- **Comprehensive Validation**: Client-side validation for all form fields with real-time feedback
- **Four Form States**:
  - **Idle**: Default state when the form loads
  - **Warning**: Processing state during form submission
  - **Failure**: Error state when validation fails or submission errors occur
  - **Success**: Success state after successful registration
- **Custom Styling**: No UI libraries used - all styles written from scratch using CSS
- **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation support
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Dark Mode Support**: Automatic dark mode based on system preferences
- **Comprehensive Testing**: 35 passing tests covering validation logic and component integration

## Form Fields

1. **First Name** (required)
   - Minimum 2 characters
   - Real-time validation on blur

2. **Last Name** (required)
   - Minimum 2 characters
   - Real-time validation on blur

3. **Email Address** (required)
   - Must be a Gmail address
   - Email format validation
   - Uniqueness check (test@gmail.com is already registered)
   - Real-time validation on blur

4. **Password** (required)
   - 8-30 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character
   - Visual indicators showing which requirements are met in real-time

## Technical Approach

### Architecture

The project follows a modular architecture with clear separation of concerns:

```
/var/www/nextjs-login-ui/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Main page component
│   ├── layout.tsx           # Root layout with metadata
│   └── globals.css          # Goldenset brand styles
├── components/              # React components
│   ├── RegistrationForm.tsx # Main form component
│   └── Input.tsx            # Reusable input component
├── lib/                     # Utility functions and types
│   ├── validation.ts        # Validation logic
│   └── types.ts            # TypeScript type definitions
├── public/                  # Static assets
│   └── goldenset-brandmark.svg # Brand logo
└── __tests__/              # Test files
    ├── validation.test.ts   # Validation logic tests (10 tests)
    └── RegistrationForm.test.tsx # Component tests (25 tests)
```

### Validation Strategy

**Client-side validation** is implemented with the following approach:

1. **On Blur Validation**: Fields are validated when the user leaves the field (blur event)
2. **On Change Validation**: After a field has been touched, it validates on every change for immediate feedback
3. **On Submit Validation**: All fields are validated when the form is submitted
4. **Real-time Requirements**: Password requirements update instantly as the user types

### Email Validation Rules

- Must be a valid email format
- Must be a Gmail address (@gmail.com only)
- `test@gmail.com` is considered already registered and will fail validation
- Case-insensitive checking

### Password Validation Rules

- Between 8 and 30 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*(),.?":{}|<>)

### State Management

The form uses React's built-in `useState` hook for state management:

- **formData**: Stores firstName, lastName, email, and password
- **errors**: Stores validation error messages for each field
- **touchedFields**: Tracks which fields have been interacted with
- **formState**: Tracks the overall form state (idle, warning, failure, success)
- **isSubmitting**: Prevents duplicate submissions

### Goldenset Brand Styling

The form features Goldenset's vibrant brand identity:

- **Color Palette**:
  - Orange: #ff6b4a
  - Yellow: #ffd93d
  - Green: #00d4aa
  - Blue: #7dd3fc
  - Purple: #d8b4fe
- **Background**: Warm beige (#f5f1e8) with subtle gradient overlays
- **Rainbow Border**: Colorful gradient top border on the form card
- **Logo**: Goldenset brandmark in original black
- **Focus State**: Teal border (#9cd9de) when inputs are focused
- **Rounded Corners**: 24px border radius for modern look
- **Gradient Button**: Orange gradient submit button with hover effects

### Form States Implementation

1. **Idle State**: Default state with no status messages
2. **Warning State**: Shown during form submission with a loading indicator
3. **Failure State**: Displayed when validation fails with specific error messages
4. **Success State**: Shown after successful submission with success message and auto-reset after 3 seconds

## API Backend (Extra Credit)

This project includes a full Node.js REST API backend with PostgreSQL database integration.

### API Architecture

```
/var/www/nextjs-login-ui/api/
├── server.ts              # Express server setup
├── db/
│   └── connection.ts      # PostgreSQL connection pool
├── models/
│   └── user.ts           # User model with CRUD operations
├── middleware/
│   └── validation.ts     # Server-side validation middleware
└── routes/
    └── users.ts          # User registration endpoints
```

### Database Setup

1. **Install PostgreSQL**:
```bash
sudo apt install postgresql postgresql-contrib
```

2. **Start PostgreSQL**:
```bash
sudo service postgresql start
```

3. **Create Database and Schema**:
```bash
sudo -u postgres createdb goldenset_db
cat database/schema.sql | sudo -u postgres psql goldenset_db
```

4. **Set PostgreSQL Password**:
```bash
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
```

5. **Configure Environment Variables**:
Create a `.env` file in the project root:
```env
# PostgreSQL Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/goldenset_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=goldenset_db
DB_USER=postgres
DB_PASSWORD=postgres

# API Configuration
API_PORT=3001
NODE_ENV=development

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
```

### Database Schema

The `users` table schema:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- Hashed with bcrypt
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints

#### POST /api/users/register

Register a new user account.

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@gmail.com",
  "password": "Password1!"
}
```

**Success Response (201)**:
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@gmail.com",
    "createdAt": "2025-10-18T10:30:00.000Z"
  }
}
```

**Validation Error Response (400)**:
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Only Gmail addresses are accepted"
    }
  ]
}
```

**Conflict Error Response (409)**:
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "This email address is already registered"
    }
  ]
}
```

#### GET /api/users

Get all registered users (for testing/admin purposes).

**Success Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@gmail.com",
      "createdAt": "2025-10-18T10:30:00.000Z"
    }
  ]
}
```

#### DELETE /api/users/:email

Delete a user by email (for testing purposes).

**Success Response (200)**:
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Not Found Response (404)**:
```json
{
  "success": false,
  "message": "User not found"
}
```

#### GET /health

Health check endpoint to verify API is running.

**Success Response (200)**:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-10-18T10:30:00.000Z"
}
```

### Server-Side Validation

The API implements the same validation rules as the frontend:

- **First Name**: Required, minimum 2 characters, maximum 100 characters
- **Last Name**: Required, minimum 2 characters, maximum 100 characters
- **Email**: Required, valid format, Gmail only (@gmail.com), test@gmail.com rejected
- **Password**: Required, 8-30 characters, must contain uppercase, lowercase, number, and special character

### Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with 10 salt rounds before storage
- **SQL Injection Protection**: Parameterized queries using pg library
- **CORS**: Configured to only allow requests from the frontend (localhost:3000)
- **Input Sanitization**: All inputs are trimmed and validated
- **Email Normalization**: Emails are stored in lowercase

### Running the API

#### Development Mode

Run both frontend and API concurrently:
```bash
npm run dev:all
```

Or run them separately:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - API
npm run dev:api
```

The API will be available at [http://localhost:3001](http://localhost:3001)

#### Production Mode

1. Build the API:
```bash
npm run build:api
```

2. Start the API:
```bash
npm run start:api
```

### API Testing

The project includes comprehensive API tests with **31 passing tests**:

#### Validation Middleware Tests (`__tests__/api/validation.test.ts`) - 17 tests

- First name validation (missing, too short, trimming)
- Last name validation (missing, too short, trimming)
- Email validation (missing, invalid format, non-Gmail, test@gmail.com)
- Password validation (missing, too short, too long, missing character types)
- Multiple field validation errors
- Whitespace trimming

#### API Endpoint Tests (`__tests__/api/users.test.ts`) - 14 tests

- POST /api/users/register with valid/invalid data
- Email uniqueness enforcement
- Database error handling
- GET /api/users endpoint
- DELETE /api/users/:email endpoint
- Health check endpoint
- 404 handling for unknown routes

Run API tests:
```bash
npm run test:api
```

Run all tests (frontend + API):
```bash
npm run test:all
```

### Test Database Connection

Test the PostgreSQL connection:
```bash
node test-db-connection.js
```

This will verify:
- Database connection is working
- Users table exists
- Table schema is correct

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nextjs-login-ui
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

**Frontend:**
- `npm run dev` - Start Next.js development server (http://localhost:3000)
- `npm run build` - Build frontend for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

**API:**
- `npm run dev:api` - Start API development server (http://localhost:3001)
- `npm run dev:all` - Start both frontend and API concurrently
- `npm run build:api` - Build API for production
- `npm run start:api` - Start API production server

**Testing:**
- `npm test` - Run frontend tests (35 tests)
- `npm run test:api` - Run API tests (31 tests)
- `npm run test:all` - Run all tests (66 tests total)
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

**Database:**
- `npm run db:setup` - Run database schema setup
- `node test-db-connection.js` - Test PostgreSQL connection

## Testing

The project includes comprehensive test coverage with **66 passing tests** (35 frontend + 31 API):

### Frontend Tests (35 tests)

### Validation Tests (`__tests__/validation.test.ts`) - 10 tests

- **First Name Validation**:
  - Empty first name
  - First name less than 2 characters
  - Valid first name

- **Last Name Validation**:
  - Empty last name
  - Last name less than 2 characters
  - Valid last name

- **Email Validation**:
  - Empty email
  - Invalid email format
  - Non-Gmail addresses
  - test@gmail.com (already registered)
  - Valid Gmail addresses

- **Password Validation**:
  - Empty password
  - Password less than 8 characters
  - Password more than 30 characters
  - Missing uppercase, lowercase, number, or special character
  - Valid passwords meeting all requirements

### Component Tests (`__tests__/RegistrationForm.test.tsx`) - 25 tests

- Form rendering with all fields
- Validation errors on blur for each field
- Non-Gmail email rejection
- test@gmail.com uniqueness validation
- Password requirements real-time updates
- Empty field submission validation
- Form state transitions (idle → warning → success/failure)
- Submit button disabled during submission
- Valid Gmail address acceptance
- Complete password requirement validation

Run frontend tests with:
```bash
npm test
```

**Test Results**: ✅ All 35 frontend tests pass successfully in ~2.6 seconds

### API Tests (31 tests)

#### Validation Middleware Tests (`__tests__/api/validation.test.ts`) - 17 tests

- **First Name Validation**:
  - Missing first name
  - First name too short (< 2 characters)
  - Whitespace trimming

- **Last Name Validation**:
  - Missing last name
  - Last name too short (< 2 characters)
  - Whitespace trimming

- **Email Validation**:
  - Missing email
  - Invalid email format
  - Non-Gmail addresses rejected
  - test@gmail.com rejected (already registered)
  - Whitespace trimming

- **Password Validation**:
  - Missing password
  - Password too short (< 8 characters)
  - Password too long (> 30 characters)
  - Missing uppercase letter
  - Missing lowercase letter
  - Missing number
  - Missing special character

- **Multiple Field Validation**: Tests multiple validation errors simultaneously

#### API Endpoint Tests (`__tests__/api/users.test.ts`) - 14 tests

- **POST /api/users/register**:
  - Successful registration with valid data
  - Validation errors for invalid first name, last name, email, password
  - Non-Gmail email rejection
  - test@gmail.com rejection
  - Weak password rejection
  - Email already exists (409 conflict)
  - Database error handling (500)
  - Missing fields validation

- **GET /api/users**:
  - Returns all users successfully
  - Returns empty array when no users exist
  - Database error handling

- **DELETE /api/users/:email**:
  - Successful user deletion
  - User not found (404)
  - Database error handling

- **Health Check** (GET /health): API running status
- **404 Handler**: Unknown routes return 404

Run API tests with:
```bash
npm run test:api
```

**Test Results**: ✅ All 31 API tests pass successfully in ~0.8 seconds

Run all tests:
```bash
npm run test:all
```

**Combined Results**: ✅ All 66 tests (35 frontend + 31 API) pass successfully

## Accessibility Features

- Semantic HTML5 elements
- ARIA labels and descriptions
- Form field associations with labels
- Error announcements with `role="alert"`
- Keyboard navigation support
- Focus management with visual indicators
- Required field indicators
- Screen reader friendly

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

⚠️ **Important Note**: When previewing the page, please disable all browser extensions/plugins. Some extensions (such as password managers like Bitwarden) may inject attributes into the DOM, which can cause React hydration mismatch errors. For the best development experience, use an incognito/private window without extensions enabled.

## Design Decisions

### Why No UI Library?

As specified in the requirements, this project uses custom CSS instead of UI libraries. This demonstrates:
- Deep understanding of CSS fundamentals
- Ability to create custom, maintainable styles
- Better performance (no large UI library bundle)
- Full control over Goldenset's brand styling

### Why Gmail Only?

The form enforces Gmail-only registration as per project requirements, with special handling for the test account (test@gmail.com) which is treated as already registered.

### Why TypeScript?

TypeScript provides:
- Type safety for form data and validation
- Better IDE support and autocomplete
- Fewer runtime errors
- Self-documenting code

### Why React Testing Library?

React Testing Library encourages:
- Testing from the user's perspective
- Focus on accessibility
- Avoiding implementation details
- More maintainable tests

## Project Structure Details

### Components

- **RegistrationForm**: Main form component with all logic, state management, and Goldenset branding
- **Input**: Reusable text/email/password input component with error handling

### Utilities

- **validation.ts**: Pure functions for validating firstName, lastName, email, and password
- **types.ts**: TypeScript interfaces for FormData, FieldError, and FormState

### Styling

- **globals.css**: Contains all Goldenset brand styles, color variables, and responsive design
- Custom CSS variables for easy theme management
- Gradient overlays and smooth animations
- Focus states with Goldenset's teal accent color

## Performance Considerations

- Client-side validation reduces server load
- Form state optimized to prevent unnecessary re-renders
- CSS animations use GPU-accelerated properties
- Password requirement checks are simple regex operations
- No external UI library reduces bundle size

## Security Considerations

- Passwords are not stored or logged
- Client-side validation should be complemented by server-side validation in production
- No sensitive data in console logs
- HTTPS should be enforced in production
- CSRF protection should be added for real API integration
- Rate limiting should be implemented on the backend

## Future Enhancements

Possible improvements for production use:

1. **Server-side Validation**: Add API endpoint with backend validation
2. **Database Integration**: Store user data securely
3. **Email Verification**: Send verification email after registration
4. **Password Strength Meter**: Visual indicator beyond requirements
5. **Social Login**: Add OAuth providers (Google, GitHub, etc.)
6. **Internationalization**: Multi-language support
7. **Analytics**: Track form completion rates and common errors
8. **Rate Limiting**: Prevent abuse on the backend
9. **Account Recovery**: Password reset functionality
10. **Two-Factor Authentication**: Enhanced security option

## Goldenset Integration

This registration form is designed to integrate with Goldenset's platform, which helps creators:
- Transform link-in-bio from passive to dynamic
- Make content interactive and searchable
- Customize page appearance and AI responses
- Maximize earnings with advanced analytics

## Contributing

This is a demonstration project built to Goldenset's specifications. For production deployment, ensure all security and scalability enhancements are implemented.

## License

MIT

## Project Requirements Checklist

This project fulfills all requirements from the specification:

### ✅ Technical Requirements
- [x] Built with React and TypeScript
- [x] Using Next.js framework
- [x] All components developed from scratch (no UI library)
- [x] User entity fields: First Name, Last Name, Email, Password
- [x] Client-side validation only
- [x] All fields are required
- [x] Gmail-only email validation
- [x] test@gmail.com treated as already registered
- [x] Password: 8-30 chars, lowercase, uppercase, number, special char
- [x] Form states: Idle, Warning, Failure, Success
- [x] Comprehensive unit tests (35 tests)
- [x] Complete README with approach explanation

### 📋 Approach to Solving the Problem

**1. Planning & Architecture**
- Started by analyzing the spec requirements thoroughly
- Designed a modular component structure with clear separation of concerns
- Created reusable components (Input) for consistency
- Separated validation logic into pure functions for testability

**2. Implementation Strategy**
- Built validation functions first with all requirements (TDD approach in mind)
- Created TypeScript interfaces for type safety
- Implemented the form with React hooks for state management
- Added real-time validation feedback on blur and onChange
- Implemented all four form states with visual feedback
- Custom CSS from scratch matching Goldenset's brand identity

**3. Testing Strategy**
- Unit tests for all validation functions (10 tests)
- Integration tests for form component behavior (25 tests)
- Tests cover all validation rules, form states, and user interactions
- Tests are designed to fail if code changes break functionality

**4. Styling Approach**
- No UI libraries used as required
- Custom CSS with Goldenset's vibrant color palette
- Responsive design with mobile-first approach
- Real-time password requirement indicators
- Smooth animations and transitions
- Accessibility features throughout

### 🤖 How Much AI Was Used?

**AI Usage: ~95%**

This project was built with extensive AI assistance (Claude Code):
- **Code Generation**: AI wrote most of the implementation code
- **Architecture**: AI designed the component structure and file organization
- **Testing**: AI created all test cases and test logic
- **Styling**: AI developed the custom CSS with Goldenset branding
- **Documentation**: AI wrote the comprehensive README

**Human Input**:
- Provided the project specifications
- Made design decisions (Goldenset branding, color choices)
- Reviewed and approved the implementation approach
- Tested the application in the browser
- Requested specific refinements (logo color, focus color, Gmail message tone)

The collaboration was efficient - AI handled implementation details while human oversight ensured the solution met requirements and maintained quality.

### 💡 Where Could We Do Better?

**1. Server-Side Integration**
- Currently, form submission is simulated
- Production would need real API endpoints
- Server-side validation should mirror client-side rules
- Database integration for actual user registration

**2. Enhanced Error Handling**
- Could add more specific error messages
- Network error handling for real API calls
- Retry logic for failed submissions
- Better error logging and monitoring

**3. Password Security**
- Add password strength meter beyond basic requirements
- Check against common password lists
- Implement "Have I Been Pwned" API check
- Add password visibility toggle

**4. User Experience**
- Add loading skeleton on initial page load
- Implement debouncing for validation to reduce checks
- Add progress indicator for multi-step forms
- Remember field values in localStorage (except password)

**5. Testing Coverage**
- Could add E2E tests with Playwright or Cypress
- Visual regression testing for UI consistency
- Performance testing for form responsiveness
- Accessibility testing with axe-core

**6. Internationalization**
- Support for multiple languages
- Locale-specific validation messages
- Different email provider rules per region

**7. Analytics & Monitoring**
- Track form abandonment rates
- Monitor validation failure patterns
- A/B testing for form layouts
- Performance monitoring with Web Vitals

**8. Advanced Features**
- Social authentication (Google OAuth)
- Email verification workflow
- Two-factor authentication
- Account recovery flow
- Rate limiting on client side

**9. Code Organization**
- Could extract more reusable hooks (useFormValidation)
- Create a FormField wrapper component
- Add Storybook for component documentation
- Implement error boundary components

**10. Performance Optimization**
- Code splitting for faster initial load
- Lazy load validation functions
- Optimize re-renders with React.memo
- Service worker for offline support

## Contact

For questions about Goldenset's platform, visit [goldenset.com](https://goldenset.com) or contact contact@goldenset.com

---

🤖 Built with Next.js 15, React 19, TypeScript, and custom CSS styling for Goldenset
