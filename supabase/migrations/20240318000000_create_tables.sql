-- Create users table extensions
create extension if not exists "uuid-ossp";

-- Create doctors table
create table public.doctors (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  specialization text not null,
  consultation_fee decimal not null,
  availability text[] not null,
  hospital_id uuid references hospitals(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create hospitals table
create table public.hospitals (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  address text not null,
  contact text not null,
  emergency boolean default false,
  services text[],
  rating decimal(2,1),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create appointments table
create table public.appointments (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references auth.users(id),
  doctor_id uuid references doctors(id),
  hospital_id uuid references hospitals(id),
  appointment_date date not null,
  token_number integer not null,
  scheduled_time time not null,
  payment_status text not null,
  payment_amount decimal not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.doctors enable row level security;
alter table public.hospitals enable row level security;
alter table public.appointments enable row level security;

-- Doctors policies
create policy "Doctors are viewable by everyone" on public.doctors
  for select using (true);

-- Hospitals policies
create policy "Hospitals are viewable by everyone" on public.hospitals
  for select using (true);

-- Appointments policies
create policy "Users can view their own appointments" on public.appointments
  for select using (auth.uid() = patient_id);

create policy "Users can create their own appointments" on public.appointments
  for insert with check (auth.uid() = patient_id);

create policy "Users can update their own appointments" on public.appointments
  for update using (auth.uid() = patient_id);