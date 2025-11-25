-- Create bookings table for medical appointments
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  patient_id text not null,
  patient_phone text not null,
  date date not null,
  time text not null,
  doctor_name text not null,
  doctor_specialty text not null,
  status text not null check (status in ('pendiente', 'confirmado', 'cancelado')),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.bookings enable row level security;

-- Allow everyone to read all bookings (public access for patients and admin)
create policy "bookings_select_all"
  on public.bookings for select
  using (true);

-- Allow everyone to insert bookings (public booking form)
create policy "bookings_insert_all"
  on public.bookings for insert
  with check (true);

-- Allow everyone to update bookings (admin can change status)
create policy "bookings_update_all"
  on public.bookings for update
  using (true);

-- Allow everyone to delete bookings (admin can cancel)
create policy "bookings_delete_all"
  on public.bookings for delete
  using (true);

-- Create index for faster queries
create index if not exists bookings_date_time_idx on public.bookings(date, time);
create index if not exists bookings_patient_id_idx on public.bookings(patient_id);
create index if not exists bookings_status_idx on public.bookings(status);
