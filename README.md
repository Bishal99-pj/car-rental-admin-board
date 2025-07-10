# Car Rental Admin Dashboard

A comprehensive admin dashboard for managing user-generated car rental listings, built with Next.js 15, TypeScript, and shadcn/ui.

## Features

### Core Features ✅
- **Authentication System**: Secure login with mock admin credentials
- **Dashboard Overview**: Statistics cards showing total listings, pending reviews, and approved listings
- **Listing Management**: 
  - Paginated table view of all car rental listings
  - Search functionality by title, model, or location
  - Filter by status (pending, approved, rejected)
  - Approve/Reject actions with one-click buttons
  - Edit listing details with a comprehensive form
- **Audit Trail**: Complete logging of all admin actions with filtering and pagination

### Technical Implementation
- **Next.js 15** with App Router and Server-Side Rendering
- **TypeScript** for type safety
- **shadcn/ui** components for consistent, beautiful UI
- **TailwindCSS** for styling
- **React Context API** for state management
- **API Routes** for backend functionality
- **In-memory data storage** (easily replaceable with database)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd car-rental-admin-board
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials
- **Email**: `admin@carrental.com`
- **Password**: `admin123`

## Project Structure

```
car-rental-admin-board/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── listings/          # Listing management
│   │   └── audit-logs/        # Audit trail
│   ├── dashboard/             # Main dashboard page
│   ├── login/                 # Login page
│   └── layout.tsx             # Root layout
├── components/
│   ├── ui/                    # shadcn/ui components
│   └── dashboard/             # Dashboard-specific components
├── lib/
│   ├── types.ts               # TypeScript interfaces
│   ├── auth.ts                # Authentication utilities
│   ├── auth-context.tsx       # React auth context
│   └── mock-data.ts           # Sample data
└── middleware.ts              # Route protection
```

## Features in Detail

### Authentication
- Mock authentication system (easily replaceable with real auth)
- Protected routes with middleware
- Session management with localStorage
- Automatic redirects based on auth status

### Listing Management
- **View**: Paginated table with car details, pricing, and status
- **Search**: Real-time search across title, model, and location
- **Filter**: Filter by listing status (pending/approved/rejected)
- **Actions**: 
  - ✅ Approve listings
  - ❌ Reject listings  
  - ✏️ Edit listing details
- **Edit Form**: Comprehensive form with all listing fields:
  - Title and description
  - Price per day
  - Car model and year
  - Mileage and location
  - Fuel type and transmission

### Audit Trail
- Complete logging of all admin actions
- Filter by action type (login, approve, reject, edit)
- Paginated view with timestamps
- Admin identification for each action

### UI/UX Features
- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Clean, professional design with shadcn/ui
- **Loading States**: Smooth loading indicators
- **Toast Notifications**: Success/error feedback
- **Accessibility**: Proper ARIA labels and keyboard navigation

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

### Listings
- `GET /api/listings` - Get paginated listings with filters
- `GET /api/listings/[id]` - Get specific listing
- `PATCH /api/listings/[id]` - Update listing (approve/reject/edit)

### Audit Logs
- `GET /api/audit-logs` - Get paginated audit trail with filters

## Next Steps & Enhancements

### Immediate Improvements
- [ ] Add real database integration (PostgreSQL/MongoDB)
- [ ] Implement proper authentication (NextAuth.js/Auth0)
- [ ] Add image upload functionality
- [ ] Implement real-time notifications

### Advanced Features
- [ ] Bulk actions (approve/reject multiple listings)
- [ ] Advanced filtering and sorting
- [ ] Export functionality (CSV/PDF)
- [ ] Email notifications for status changes
- [ ] User management (add/remove admins)
- [ ] Analytics dashboard with charts

### Performance Optimizations
- [ ] Implement React Query for data fetching
- [ ] Add optimistic updates
- [ ] Implement virtual scrolling for large datasets
- [ ] Add caching strategies

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Components
The project uses shadcn/ui. To add new components:

```bash
npx shadcn@latest add <component-name>
```

### Styling
- TailwindCSS for utility-first styling
- shadcn/ui components for consistent design
- Custom CSS in `app/globals.css`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
