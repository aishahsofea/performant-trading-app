# Technical Assumptions

## Repository Structure: Monorepo
Single repository structure to enable easy comparison of optimization phases and shared performance monitoring utilities across the learning journey.

## Service Architecture
**Hybrid Architecture for Learning Optimization:**
- **Phase 0-2**: Client-heavy architecture with minimal server optimization (deliberate performance bottlenecks)
- **Phase 3-4**: Progressive server-side optimization with API route optimization and edge functions
- **Phase 5-6**: Advanced patterns including edge computing, streaming, and service worker implementation

## Testing Requirements
**Performance-Focused Testing Strategy:**
- **Unit Tests**: Standard Jest/React Testing Library for component functionality
- **Performance Tests**: Lighthouse CI for automated Core Web Vitals monitoring
- **Load Testing**: Artillery.js for API endpoint stress testing under high data volume
- **Real User Monitoring**: Custom performance tracking for learning metrics
- **A/B Testing**: Framework to measure optimization impact with statistical significance

## Additional Technical Assumptions and Requests

**Core Technology Stack:**
- **Framework**: Next.js 14+ (App Router) for modern React patterns and built-in performance features
- **Language**: TypeScript for type safety and better development experience
- **Styling**: Tailwind CSS + CSS Modules hybrid for performance comparison learning
- **State Management**: Zustand for lightweight state + React Query for server state management
- **Charts/Visualization**: Chart.js initially (heavy), then progressive optimization to D3.js + Canvas
- **Real-time Data**: WebSockets via Socket.io initially, optimizing to native WebSocket + Server-Sent Events
- **3D Graphics**: Three.js for market depth visualization (performance challenge by design)
- **Voice Recognition**: Web Speech API with potential Web Worker optimization

**Database & APIs:**
- **External APIs**: Alpha Vantage (free tier) + Finnhub for stock data
- **Caching**: Redis for API response caching and session management
- **Database**: PostgreSQL for user data + Time-series data optimization learning
- **File Storage**: Vercel Blob for static assets with CDN optimization learning

**Development & Performance Tools:**
- **Bundler**: Webpack (Next.js default) with bundle analyzer for optimization learning
- **Performance Monitoring**: Custom implementation + Vercel Analytics for real metrics
- **Testing**: Lighthouse CI, WebPageTest API, Chrome DevTools Protocol automation
- **Deployment**: Vercel for edge optimization learning + performance insights

**Learning-Specific Technical Decisions:**
- **Deliberate Anti-patterns**: Initial implementation will use synchronous operations, blocking renders, and heavy re-renders
- **Progressive Enhancement**: Each phase adds performance optimizations while maintaining feature parity
- **Measurement-First**: All optimizations must be measurable with before/after metrics
- **Documentation-Heavy**: Extensive performance documentation for learning portfolio presentation
