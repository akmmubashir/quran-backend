# Ayah Group Removal Fix

## Problem
When removing ayah groups, the `ayah_groups` table entries were not being deleted because:
1. The backend was only looking for a group matching the exact min/max of selected ayahs
2. If users selected only part of a group or multiple groups, the lookup would fail
3. Only the `Ayah` table was being updated, leaving orphaned records in `ayah_groups`

## Solution

### Backend Changes (`quran.service.ts`)
The `removeAyahGroup` method now:

1. **Finds affected groups**: Queries the `Ayah` table to find which groups the selected ayahs belong to (by checking their `ayahGroupStart` and `ayahGroupEnd`)

2. **Collects all ayahs in those groups**: For each group found, includes ALL ayahs in that group (not just the selected ones) to ensure complete cleanup

3. **Deletes from ayah_groups table**: For each unique group found, deletes the corresponding record from the `ayah_groups` table using TypeORM

4. **Updates Ayah table**: Sets `ayahGroupStart` and `ayahGroupEnd` to NULL for all ayahs that were part of any deleted group

### Frontend Changes (`view-surah/index.js`)
The `handleRemoveGroup` method now:

1. **Calls the backend API**: Uses the updated backend endpoint
2. **Refetches surah data**: After successful ungrouping, fetches the complete surah data again from the backend to ensure the UI shows the updated state
3. **Shows detailed feedback**: Displays how many groups were deleted

## Testing
To test:
1. Create a group with ayahs 1-2
2. Create another group with ayahs 4-5
3. Select any ayah from one or both groups
4. Click "Remove Group"
5. Verify:
   - The `ayah_groups` table has the group(s) deleted
   - The `Ayah` table has `ayahGroupStart` and `ayahGroupEnd` set to NULL for affected ayahs
   - The UI refreshes and no longer shows the group tags

## API Response
The updated endpoint returns:
```json
{
  "success": true,
  "message": "Successfully ungrouped 2 group(s) in surah 1",
  "data": {
    "surahId": 1,
    "selectedAyahs": [1, 4],
    "deletedGroups": ["1-2", "4-5"],
    "ungroupedAyahCount": 4
  }
}
```
