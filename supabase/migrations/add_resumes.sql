-- Table resumes pour le CV builder
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  title text not null default 'Mon CV',
  template text not null default 'modern',
  primary_color text not null default '#7c3aed',
  content jsonb not null default '{}',
  ats_score integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.resumes enable row level security;

create policy "Users can view their own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own resumes"
  on public.resumes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);

-- Trigger updated_at
create or replace function update_resumes_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger resumes_updated_at
  before update on public.resumes
  for each row execute function update_resumes_updated_at();
