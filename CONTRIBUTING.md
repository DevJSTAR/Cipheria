<p align="center">
  <img src="public/logo-white.svg" alt="Cipheria Logo" width="120" height="120">
</p>

<h1 align="center">Contributing to Cipheria</h1>

<p align="center">
  <a href="https://github.com/DevJSTAR/Cipheria?tab=contributing-ov-file#-code-of-conduct">Code of Conduct</a> •
  <a href="https://github.com/DevJSTAR/Cipheria?tab=contributing-ov-file#-getting-started">Getting Started</a> •
  <a href="https://github.com/DevJSTAR/Cipheria?tab=contributing-ov-file#-how-to-contribute">How to Contribute</a> •
  <a href="https://github.com/DevJSTAR/Cipheria?tab=contributing-ov-file#-development-guidelines">Development Guidelines</a> •
  <a href="https://github.com/DevJSTAR/Cipheria?tab=contributing-ov-file#-security">Security</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Contributions-Welcome-green?style=for-the-badge" alt="Contributions Welcome">
  <img src="https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge" alt="Apache 2.0 License">
  <img src="https://img.shields.io/badge/Built-With_%E2%9D%A4%EF%B8%8F-black?style=for-the-badge" alt="Built With Love">
</p>

---

First off, thank you for considering contributing to Cipheria! It's people like you that make Cipheria such a great tool for everyone.

This project is maintained by [DevJSTAR](https://github.com/DevJSTAR) and can be found at [github.com/DevJSTAR/Cipheria](https://github.com/DevJSTAR/Cipheria).

## 📋 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [knownasjunaid@gmail.com](mailto:knownasjunaid@gmail.com).

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm package manager

### Setup

1. Fork the repository from [DevJSTAR/Cipheria](https://github.com/DevJSTAR/Cipheria)
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/Cipheria.git
   ```
3. Navigate to the project directory:
   ```bash
   cd Cipheria
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Create a branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Workflow

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Make your changes
3. Run linting to ensure code quality:
   ```bash
   npm run lint
   ```
4. Test your changes in the browser at [http://localhost:3000](http://localhost:3000)

## 📝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the [issue tracker](https://github.com/DevJSTAR/Cipheria/issues) as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots if possible
- Note your browser, browser version, and operating system

### Suggesting Enhancements

Before creating enhancement suggestions, please check the [issue tracker](https://github.com/DevJSTAR/Cipheria/issues) as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please include as many details as possible:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful to most Cipheria users

### Pull Requests

1. Fork the repository and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code lints
5. Issue that pull request!

## 🎨 Development Guidelines

### UI Components

- Use [shadcn/ui](https://ui.shadcn.com/) components whenever possible
- Follow the existing design patterns in the application
- Maintain consistency with the dark/light mode support
- Ensure all components are accessible

### TypeScript

- Include type annotations for function parameters and return types
- Prefer interfaces over types for object definitions
- Use PascalCase for type names
- Use camelCase for variable and function names

## 🔐 Security Considerations

As this is a security-focused application, please pay special attention to:

- Never commit secrets or sensitive information
- Follow the existing encryption patterns and never weaken them
- Ensure no data leaves the client-side
- Delete QR code images immediately after processing
- Validate all user inputs

If you've found a security vulnerability, please DO NOT create a public issue. Instead, please email [knownasjunaid@gmail.com](mailto:knownasjunaid@gmail.com) directly.

## 🙏 Thank You!

Again, thank you for contributing to Cipheria. Your efforts help make this project better for everyone!