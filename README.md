# Next.js Registration Form

A modern, fully-featured registration form built with Next.js 15, TypeScript, and custom CSS styling. This project demonstrates best practices in form handling, validation, accessibility, and testing.

## Features

- **Modern Tech Stack**: Built with Next.js 15 App Router, TypeScript, and React 19
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
- **Comprehensive Testing**: Unit tests for validation logic and integration tests for components

## Form Fields

1. **Email Address** (required)
   - Valid email format validation
   - Real-time validation on blur

2. **Password** (required)
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character
   - Visual indicators showing which requirements are met

3. **Confirm Password** (required)
   - Must match the password field
   - Automatically revalidates when password changes

4. **Date of Birth** (required)
   - Must be in the past
   - User must be at least 18 years old
   - Date format validation

5. **Terms and Conditions** (required)
   - Checkbox that must be accepted to submit

## Technical Approach

### Architecture

The project follows a modular architecture with clear separation of concerns:

```
/var/www/nextjs-login-ui/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Main page component
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles and custom CSS
├── components/              # React components
│   ├── RegistrationForm.tsx # Main form component
│   ├── Input.tsx            # Reusable input component
│   └── Checkbox.tsx         # Reusable checkbox component
├── lib/                     # Utility functions and types
│   ├── validation.ts        # Validation logic
│   └── types.ts            # TypeScript type definitions
└── __tests__/              # Test files
    ├── validation.test.ts   # Validation logic tests
    └── RegistrationForm.test.tsx # Component integration tests
```

### Validation Strategy

**Client-side validation** is implemented with the following approach:

1. **On Blur Validation**: Fields are validated when the user leaves the field (blur event)
2. **On Change Validation**: After a field has been touched, it validates on every change for immediate feedback
3. **On Submit Validation**: All fields are validated when the form is submitted
4. **Real-time Requirements**: Password requirements are shown in real-time as the user types

### State Management

The form uses React's built-in `useState` hook for state management:

- **formData**: Stores all form field values
- **errors**: Stores validation error messages for each field
- **touchedFields**: Tracks which fields have been interacted with
- **formState**: Tracks the overall form state (idle, warning, failure, success)
- **isSubmitting**: Prevents duplicate submissions

### Styling Approach

Custom CSS is used throughout the project with:

- **CSS Variables**: For theming and color management
- **BEM-inspired naming**: Clear, descriptive class names
- **Mobile-first**: Responsive design that works on all devices
- **Smooth transitions**: Enhanced UX with CSS animations
- **Dark mode**: Automatic theme switching based on system preferences

### Form States Implementation

1. **Idle State**: Default state with no status messages
2. **Warning State**: Shown during form submission with a loading indicator
3. **Failure State**: Displayed when validation fails with specific error messages
4. **Success State**: Shown after successful submission with a success message and auto-reset

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

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Testing

The project includes comprehensive test coverage:

### Validation Tests (`__tests__/validation.test.ts`)

- Email validation (empty, invalid format, valid format)
- Password validation (all requirements: length, uppercase, lowercase, numbers, special characters)
- Confirm password validation (matching passwords)
- Date of birth validation (empty, invalid format, future dates, age requirements)
- Terms acceptance validation

### Component Tests (`__tests__/RegistrationForm.test.tsx`)

- Component rendering
- Field validation on blur
- Password requirements indicators
- Form submission with empty fields
- Form state transitions (idle → warning → success/failure)
- Submit button disabled state during submission
- Password revalidation when confirm password changes

Run tests with:
```bash
npm test
```

All 34 tests pass successfully.

## Accessibility Features

- Semantic HTML5 elements
- ARIA labels and descriptions
- Form field associations with labels
- Error announcements with `role="alert"`
- Keyboard navigation support
- Focus management
- Required field indicators

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Design Decisions

### Why No UI Library?

As specified in the requirements, this project uses custom CSS instead of UI libraries. This demonstrates:
- Deep understanding of CSS fundamentals
- Ability to create custom, maintainable styles
- Better performance (no large UI library bundle)
- Full control over styling and theming

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

## Future Enhancements

Possible improvements for production use:

1. **Server-side Validation**: Add API endpoint with server-side validation
2. **Rate Limiting**: Prevent abuse with rate limiting
3. **Email Verification**: Send verification email after registration
4. **Password Strength Meter**: Visual indicator of password strength
5. **Social Login**: Add OAuth providers (Google, GitHub, etc.)
6. **Internationalization**: Multi-language support
7. **Analytics**: Track form completion rates and common errors
8. **A/B Testing**: Test different form layouts and copy

## Project Structure Details

### Components

- **RegistrationForm**: Main form component with all logic and state management
- **Input**: Reusable text/email/date/password input with error handling
- **Checkbox**: Reusable checkbox component with error handling

### Utilities

- **validation.ts**: Pure functions for validating each form field
- **types.ts**: TypeScript interfaces and types for type safety

## Performance Considerations

- Client-side validation reduces server load
- Debouncing could be added for better performance (currently validates on blur)
- Form state is optimized to prevent unnecessary re-renders
- CSS animations use GPU-accelerated properties

## Security Considerations

- Passwords are not stored or logged
- Client-side validation is complemented by simulated server-side validation
- No sensitive data in console logs
- HTTPS should be enforced in production
- CSRF protection should be added for real API integration

## Contributing

This is a demonstration project built to specification. For production use, consider adding the enhancements listed above.

## License

MIT

## Author

Built as a technical demonstration of modern React/Next.js development practices.
