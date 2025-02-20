# ASVAB Prep Platform

A modern web application designed to help users prepare for the Armed Services Vocational Aptitude Battery (ASVAB) test. Features include practice tests, progress tracking, and a customizable dark/light theme interface.

## Features

- 🌓 Dark/Light Theme Toggle
- 📝 ASVAB Practice Tests
- 🔐 User Authentication
- 📊 Progress Tracking
- 💪 Comprehensive Test Categories
- 📱 Responsive Design

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** Supabase Auth
- **Database:** Supabase

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/asvab-prep.git
cd asvab-prep
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser

## Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Theme Toggle Usage

The theme toggle functionality is implemented using the following components:

- `ThemeProvider`: Manages theme state
- `ThemeToggle`: Button component for switching themes

To use the theme toggle in your components:

```tsx
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeProvider } from "@/components/theme-provider"

// Wrap your app with ThemeProvider
<ThemeProvider>
  <YourComponent>
    <ThemeToggle />
  </YourComponent>
</ThemeProvider>
```

## Project Structure

```
asvab-prep/
├── app/                 # Next.js app router pages
├── components/         
│   ├── landing/        # Landing page components
│   ├── theme-toggle.tsx
│   └── theme-provider.tsx
├── public/             # Static assets
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch
```bash
git checkout -b feature/your-feature-name
```

3. Make your changes and commit them
```bash
git commit -m "Add your commit message"
```

4. Push to your fork
```bash
git push origin feature/your-feature-name
```

5. Create a Pull Request

### Contributing Guidelines

- Follow the existing code style
- Write clear commit messages
- Include tests if applicable
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Next.js](https://nextjs.org/) for the framework

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
