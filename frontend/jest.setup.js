// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Set test environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api'

// Mock window.location with writable href
delete window.location;

let mockHref = '';
window.location = Object.defineProperties(
  {},
  {
    href: {
      get: () => mockHref,
      set: (value) => {
        mockHref = value;
      },
      configurable: true,
      enumerable: true,
    },
    pathname: {
      value: '/',
      writable: true,
    },
    search: {
      value: '',
      writable: true,
    },
    hash: {
      value: '',
      writable: true,
    },
    origin: {
      value: 'http://localhost',
    },
    protocol: {
      value: 'http:',
    },
    host: {
      value: 'localhost',
    },
    hostname: {
      value: 'localhost',
    },
    port: {
      value: '',
    },
    assign: {
      value: jest.fn(),
    },
    replace: {
      value: jest.fn(),
    },
    reload: {
      value: jest.fn(),
    },
    toString: {
      value: () => 'http://localhost',
    },
  }
);

