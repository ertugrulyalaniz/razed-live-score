# Live Score Application

A responsive live sports score application built with Next.js 16, TypeScript, and styled-components. Displays real-time match information with filtering capabilities and a mobile-first design approach.

## Features

- **Real-time Match Display**: Shows live scores, finished results, and upcoming matches
- **Status Filtering**: Filter matches by status (All, Live, Result, Upcoming) with dynamic counts
- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
- **Accessible UI**: ARIA-compliant components with proper semantic HTML
- **Performance Optimized**: React Compiler enabled, efficient state management with Zustand
- **Comprehensive Testing**: Unit, component, integration, and E2E test coverage

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 with App Router & Turbopack |
| Language | TypeScript (strict mode) |
| Styling | styled-components v6 with SSR support |
| State Management | Zustand v5 |
| Testing | Vitest + Testing Library |
| E2E Testing | Playwright |
| Linting | Biome |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd razed-live-score

# Install dependencies
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install chromium
```

### Development

```bash
# Start development server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run unit/component tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run lint` | Run Biome linter |
| `npm run format` | Format code with Biome |
| `npm run check` | Run Biome check (lint + format) |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── providers.tsx       # Client-side providers (Theme, Registry)
├── components/
│   ├── filters/            # Filter components
│   │   ├── FilterBar/      # Filter container
│   │   └── FilterButton/   # Individual filter button
│   ├── layout/             # Layout components
│   │   ├── Container/      # Responsive container
│   │   └── Header/         # Page header
│   ├── match/              # Match-related components
│   │   ├── MatchCard/      # Individual match display
│   │   └── MatchList/      # Match grid container
│   └── ui/                 # Reusable UI components
│       ├── Spinner/        # Loading indicator
│       └── StatusIndicator/# Match status display
├── constants/              # Application constants
│   └── filters.ts          # Filter configuration
├── lib/                    # External library setup
│   └── registry.tsx        # styled-components SSR registry
├── services/               # Data services
│   └── match.service.ts    # Match data fetching with caching
├── store/                  # State management
│   └── match.store.ts      # Zustand store for matches
├── styles/                 # Styling system
│   ├── theme.ts            # Design tokens
│   └── media.ts            # Responsive breakpoints
├── types/                  # TypeScript types
│   └── match.types.ts      # Match data interfaces
├── utils/                  # Utility functions
│   ├── match.utils.ts      # Match helpers
│   └── date.utils.ts       # Date formatting
└── test/                   # Test utilities
    ├── setup.ts            # Vitest setup
    ├── test-utils.tsx      # Custom render
    └── mocks/              # Mock data factories
e2e/
└── app.spec.ts             # Playwright E2E tests
```

## Architecture Decisions

### State Management
- **Zustand** chosen over Redux for simpler API and smaller bundle size
- Single store for match data with computed filtered results
- Selectors for optimized re-renders

### Styling
- **styled-components** for CSS-in-JS with full TypeScript support
- Design tokens in theme for consistent styling
- CSS custom properties for runtime theming potential
- Server-side rendering support via Next.js registry

### Data Layer
- Service layer abstracts data fetching
- Built-in caching with 5-minute TTL
- Graceful error handling with stale-while-revalidate pattern
- 10-second fetch timeout for reliability

### Testing Strategy
- **Unit tests**: Utility functions and constants
- **Component tests**: Isolated component behavior
- **Integration tests**: Store and service interactions
- **E2E tests**: Full user flows and responsive design

## Testing

### Running Tests

```bash
# Unit and component tests
npm test

# With coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E with UI
npx playwright test --ui
```

### Test Coverage

The project maintains 80%+ code coverage across:
- Utility functions (100%)
- Components (90%+)
- Store logic (100%)
- Service layer (95%+)

## Accessibility

- Semantic HTML (`article`, `header`, `main`)
- ARIA attributes for dynamic content (`aria-live`, `aria-busy`)
- Keyboard navigation support
- Screen reader friendly status indicators
- Color contrast compliant design tokens

## Performance

- React Compiler enabled for automatic optimizations
- Efficient re-renders via Zustand selectors
- Code splitting with Next.js App Router
- Turbopack for fast development builds
- Optimized data fetching with caching

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - All rights reserved
