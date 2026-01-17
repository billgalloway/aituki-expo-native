# Step-by-Step: Set Up Chart Data in Supabase

Follow these steps to set up chart data tables in your Supabase project.

## 🎯 Prerequisites

- Access to your Supabase Dashboard
- Supabase project URL: `https://hhdntbgtedclqqufpzfj.supabase.co`
- Admin access to your Supabase project

## 📝 Step 1: Open Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **hhdntbgtedclqqufpzfj**
3. Click on **SQL Editor** in the left sidebar
4. Click **New query** to create a new SQL script

## 📋 Step 2: Create Tables

1. Open the file: `scripts/setup-chart-data-tables.sql`
2. Copy the **entire contents** of the file
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press `Cmd/Ctrl + Enter`)
5. You should see: `✅ All chart data tables created successfully!`

**What this creates:**
- `physical_scores` table
- `steps_data` table
- `heart_rate_data` table
- All necessary indexes and RLS policies

## 👤 Step 3: Get Your User ID (for sample data)

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Find a user you want to use for testing
3. Copy their **UUID** (it looks like: `123e4567-e89b-12d3-a456-426614174000`)
4. Keep this handy for the next step

## 📊 Step 4: Insert Sample Data (Optional)

1. Open the file: `scripts/insert-sample-chart-data.sql`
2. Find all instances of `'YOUR_USER_ID_HERE'`
3. Replace them with the UUID you copied in Step 3
4. Copy the **entire contents** of the modified file
5. Paste it into a new query in Supabase SQL Editor
6. Click **Run**
7. You should see: `✅ Sample data inserted successfully!`

## ✅ Step 5: Verify Tables Created

1. In Supabase Dashboard, go to **Table Editor**
2. You should see three new tables:
   - `physical_scores`
   - `steps_data`
   - `heart_rate_data`

3. Click on each table to verify:
   - Columns are correct
   - RLS is enabled (green toggle)
   - Sample data is present (if you ran Step 4)

## 🧪 Step 6: Test in Your App

1. Open your app in the emulator/simulator
2. Log in with a user account
3. Navigate to the **Health** tab → **Physical** tab
4. The charts should display data from Supabase

If you see default/fallback data instead:
- Check that you're logged in
- Verify the user ID matches the one in the database
- Check the console logs for any errors

## 🔍 Troubleshooting

### Error: "relation already exists"
- The tables already exist - this is fine!
- The script uses `IF NOT EXISTS` so it won't fail
- You can continue to Step 4

### Error: "permission denied"
- Make sure you're logged in as a project admin
- Check that RLS policies were created correctly

### No data showing in charts
- Verify sample data was inserted (check Table Editor)
- Make sure the user ID in your app matches the user ID in the database
- Check browser/app console for errors

### Charts show fallback/default data
- This means the queries aren't finding data
- Verify:
  1. You're logged in
  2. The logged-in user has data in the tables
  3. RLS policies allow the user to read their own data

## 📚 Next Steps

Once tables are set up:
1. Integrate real data sources (fitness trackers, health apps)
2. Set up scheduled jobs to sync data
3. Create triggers to calculate scores automatically
4. Add more chart types as needed

## 🆘 Need Help?

- See full guide: `help/Integrations/SUPABASE_CHART_DATA_SETUP.md`
- Check service code: `services/chartData.ts`
- Check React hook: `hooks/useChartData.ts`

---

**Quick Command Reference:**

```bash
# View SQL script
cat scripts/setup-chart-data-tables.sql

# View sample data script
cat scripts/insert-sample-chart-data.sql
```

