# How to Seed Data in Supabase

This guide explains different methods to seed test data in your Supabase database.

## Method 1: Using Supabase SQL Editor (Easiest)

### Steps:

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor** (left sidebar)

2. **Get Your User ID**
   - Go to **Authentication** → **Users**
   - Copy the UUID of the user you want to seed data for

3. **Run the Seed Script**
   - Open `scripts/seed-data.sql`
   - If you're logged into Supabase Dashboard, it will use `auth.uid()` automatically
   - OR use Option 2 in the script to specify a user ID
   - Copy the script content
   - Paste into SQL Editor
   - Click **Run** or press `Cmd/Ctrl + Enter`

4. **Verify the Data**
   - Go to **Table Editor**
   - Check tables: `physical_scores`, `steps_data`, `heart_rate_data`
   - You should see the inserted records

## Method 2: Using Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Make sure you're in the project directory
cd /path/to/aituki-mobile

# Link to your Supabase project (if not already linked)
supabase link --project-ref your-project-ref

# Run the seed script
supabase db execute --file scripts/seed-data.sql
```

## Method 3: Programmatically from Your App

You can also seed data from your React Native app:

```typescript
import { supabase } from './services/supabase';

async function seedData() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return;
  }

  // Insert physical score
  await supabase.from('physical_scores').insert({
    user_id: user.id,
    score: 179,
    percentage: 56,
    label: 'Good week',
    timeframe: 'week',
    date: new Date().toISOString()
  });

  // Insert steps data
  await supabase.from('steps_data').insert([
    { user_id: user.id, quarter: 'q1', walking: 45, running: 20, date: new Date().toISOString() },
    { user_id: user.id, quarter: 'q2', walking: 35, running: 30, date: new Date().toISOString() },
    { user_id: user.id, quarter: 'q3', walking: 50, running: 25, date: new Date().toISOString() },
    { user_id: user.id, quarter: 'q4', walking: 55, running: 20, date: new Date().toISOString() }
  ]);

  // Insert heart rate data
  await supabase.from('heart_rate_data').insert([
    { user_id: user.id, heart_rate: 85, time: '08:00', date: new Date().toISOString() },
    { user_id: user.id, heart_rate: 95, time: '10:00', date: new Date().toISOString() },
    { user_id: user.id, heart_rate: 102, time: '12:00', date: new Date().toISOString() },
    { user_id: user.id, heart_rate: 98, time: '14:00', date: new Date().toISOString() },
    { user_id: user.id, heart_rate: 105, time: '16:00', date: new Date().toISOString() }
  ]);
}
```

## Troubleshooting

### "No rows returned" or "PGRST116" Error
- Make sure the tables exist: Run `scripts/setup-chart-data-tables.sql` first
- Verify your user ID is correct
- Check Row Level Security (RLS) policies allow inserts

### "Permission denied" Error
- RLS policies only allow users to insert their own data
- Make sure you're using the correct user ID
- Verify the user exists in `auth.users` table

### "Duplicate key" Error
- The seed script uses `ON CONFLICT DO NOTHING` to avoid duplicates
- If you want to update existing data, modify the script to use `ON CONFLICT DO UPDATE`

## What Data Gets Seeded?

The seed script inserts:

1. **Physical Scores** (5 records)
   - Recent score: 179 (56%)
   - Historical scores for the past week

2. **Steps Data** (4 quarters)
   - Q1: 45 walking, 20 running
   - Q2: 35 walking, 30 running
   - Q3: 50 walking, 25 running
   - Q4: 55 walking, 20 running

3. **Heart Rate Data** (5 time points)
   - 08:00 - 85 bpm
   - 10:00 - 95 bpm
   - 12:00 - 102 bpm
   - 14:00 - 98 bpm
   - 16:00 - 105 bpm

## Next Steps

After seeding data:
1. Restart your Expo app
2. Navigate to the Health screen
3. The charts should now display the seeded data
4. The error "Cannot coerce the result to a single JSON object" should be gone!
