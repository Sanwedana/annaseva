# FoodConnect

AnnaSeva is a React application that integrates Firebase for user authentication and data management. This project allows users to register, log in, and log out, providing a seamless experience for managing their food-related activities.

## Features

- User Registration: New users can create an account using their email and password.
- User Login: Registered users can log in to access their account.
- User Logout: Users can log out of their account securely.
- Home Page: After logging in, users are directed to the home page where they can view content.

## Technologies Used

- React: A JavaScript library for building user interfaces.
- Firebase: A platform for developing web and mobile applications, providing authentication and database services.
- React Router: For handling routing within the application.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- A Firebase project set up with authentication enabled.

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```
   cd foodconnect
   ```

3. Install the dependencies:

   ```
   npm install
   ```

### Configuration

1. Replace the Firebase configuration in `src/services/firebase.js` with your own Firebase project credentials.

### Running the Application

To start the development server, run:

```
npm start
```

The application will be available at `http://localhost:3000`.

## Usage

- Navigate to the login page to log in or register a new account.
- Once logged in, you will be redirected to the home page where you can view the main content.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.