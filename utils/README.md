# API Response Utilities

## APIResponse Class

The `APIResponse` class provides a standardized way to format API responses following the JSend specification. This helps maintain consistency across all API endpoints and reduces repetitive code.

### JSend Format

JSend is a simple specification that defines a consistent format for API responses. It has three main response types:

- **Success**: When an API call is successful
- **Fail**: When an API call fails due to client-side issues (validation errors, etc.)
- **Error**: When an API call fails due to server-side issues

### Usage

```javascript
const APIResponse = require('../utils/APIResponse');

// In your controller:
const myController = async (req, res) => {
  try {
    // Your business logic here
    const data = await someService();
    
    // Success response
    APIResponse.send(res, APIResponse.success(data, 200, 'Optional success message'));
  } catch (error) {
    // If it's a client error (e.g., validation error)
    if (error.statusCode === 400) {
      APIResponse.send(res, APIResponse.fail({ message: error.message }, error.statusCode));
    } else {
      // Server error
      APIResponse.send(res, APIResponse.error(error.message, error.statusCode));
    }
  }
};
```

### Methods

#### `APIResponse.success(data, statusCode = 200, message = null)`

Creates a success response object.

- **data**: The data to be returned
- **statusCode**: HTTP status code (default: 200)
- **message**: Optional success message

#### `APIResponse.fail(data, statusCode = 400)`

Creates a fail response object (client error).

- **data**: Error details or validation errors object
- **statusCode**: HTTP status code (default: 400)

#### `APIResponse.error(message, statusCode = 500, data = null)`

Creates an error response object (server error).

- **message**: Error message
- **statusCode**: HTTP status code (default: 500)
- **data**: Optional additional error data

#### `APIResponse.send(res, responseObj)`

Sends the response to the client.

- **res**: Express response object
- **responseObj**: Response object from success/fail/error methods