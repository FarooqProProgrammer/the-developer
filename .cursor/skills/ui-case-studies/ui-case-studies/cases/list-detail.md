# Case study — List → detail (page or drawer)

Sources: [SaaS UI workflow patterns](https://gist.github.com/camillanapoles/573f1dd3559459fa37bbe52e6ff33fc1).

## Job

Browse many items, then inspect one without losing list context (drawer) or go deep (full page).

## Default patterns

| Pattern | When |
|---------|------|
| **Right drawer** | Quick inspect/edit; return to same scroll position |
| **Full detail page** | Many tabs, long forms, heavy media |
| **Split master–detail** | Persistent list + detail pane (desktop) |

## Detail content defaults

1. Title + status badge
2. Primary actions (Edit, Share, More)
3. Summary fields / description list
4. Tabs if needed (Overview, Activity, Settings)
5. Related list or timeline
6. Danger zone at bottom if delete/archive

## Defaults

- Deep link to detail URL even when opened from drawer (shareable)
- Loading skeleton in detail pane; don’t blank the list
- Back/close returns to list with filters preserved

## Anti-patterns

- Opening detail in a way that nukes filters
- Drawer with a full settings app inside (use page)
- No title/status above the fold

## Checklist

- [ ] List selection/open highlight
- [ ] Close/back preserves list state
- [ ] Shareable detail URL when useful
