# Exam Builder - Professional Online Exam Platform

A modern, responsive web application for creating and managing online exams with real-time collaboration features.

## Features

✨ **Authentication**
- Email/Password signup with OTP verification
- Google OAuth integration
- Password reset functionality
- Secure session management

🎨 **Modern UI/UX**
- Responsive design (mobile & desktop)
- Animated gradient backgrounds
- Dark mode, light mode, and system theme
- Custom color themes
- Brightness control

📊 **Dashboard**
- Database management
- Exam creation and tracking
- Statistics and analytics
- Search functionality
- Real-time notifications

🔐 **User Management**
- Editable profile
- Password change with email verification
- Account settings

🤝 **Collaboration**
- Share databases with read-only or editable permissions
- Generate shareable links
- Manage shared users
- Remove access controls

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Supabase Auth
- **Database:** Supabase (PostgreSQL)
- **State Management:** Zustand
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account

### 1. Clone and Install

```bash
cd exam-builder
npm install
```

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be ready

#### Create Database Tables

Go to SQL Editor in Supabase and run these commands:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create databases table
create table databases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table databases enable row level security;

create policy "Users can view own databases"
  on databases for select
  using (auth.uid() = user_id);

create policy "Users can create databases"
  on databases for insert
  with check (auth.uid() = user_id);

create policy "Users can update own databases"
  on databases for update
  using (auth.uid() = user_id);

create policy "Users can delete own databases"
  on databases for delete
  using (auth.uid() = user_id);

-- Create exams table
create table exams (
  id uuid default gen_random_uuid() primary key,
  database_id uuid references databases on delete cascade not null,
  title text not null,
  status text check (status in ('draft', 'published')) default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table exams enable row level security;

create policy "Users can view exams from own databases"
  on exams for select
  using (
    exists (
      select 1 from databases
      where databases.id = exams.database_id
      and databases.user_id = auth.uid()
    )
  );

create policy "Users can create exams in own databases"
  on exams for insert
  with check (
    exists (
      select 1 from databases
      where databases.id = exams.database_id
      and databases.user_id = auth.uid()
    )
  );

-- Create shared_databases table
create table shared_databases (
  id uuid default gen_random_uuid() primary key,
  database_id uuid references databases on delete cascade not null,
  shared_with_email text not null,
  permission text check (permission in ('readonly', 'editable')) not null,
  created_at timestamp with time zone default now()
);

alter table shared_databases enable row level security;

create policy "Users can view shares for own databases"
  on shared_databases for select
  using (
    exists (
      select 1 from databases
      where databases.id = shared_databases.database_id
      and databases.user_id = auth.uid()
    )
  );
```

#### Set up Google OAuth (Optional)

1. In Supabase Dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials
4. Add authorized redirect URL: `YOUR_APP_URL/auth/callback`

### 3. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from:
- Supabase Dashboard > Project Settings > API

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

## Project Structure

```
exam-builder/
├── app/                      # Next.js app directory
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Dashboard pages
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # Reusable components
├── lib/                     # Utilities and configurations
│   ├── auth.ts             # Authentication service
│   ├── store.ts            # State management
│   └── supabase.ts         # Supabase client
├── public/                 # Static assets
└── package.json            # Dependencies

```

## Features Roadmap

- [x] Authentication (Email/Password & Google)
- [x] User profile management
- [x] Dashboard with statistics
- [x] Database CRUD operations
- [x] Theme customization
- [x] Sharing functionality
- [ ] Exam builder interface
- [ ] Question bank management
- [ ] Exam taking interface
- [ ] Results and analytics
- [ ] Export functionality

## Environment Setup for Mobile

The app is fully responsive and works on:
- Mobile phones (iOS & Android)
- Tablets
- Desktop browsers
- PWA capable (can be installed as an app)

## Support

For issues or questions:
- Email: osilajaolamiposi18@gmail.com
- Create an issue in the repository

## License

MIT License - feel free to use this for your projects!
