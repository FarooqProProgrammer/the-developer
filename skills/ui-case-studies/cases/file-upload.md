# Case study — File upload / import

Sources: [SaaS UI workflow](https://gist.github.com/camillanapoles/573f1dd3559459fa37bbe52e6ff33fc1) (bulk import → mapping → validation).

## Job

Get files or bulk data in safely — with progress, validation, and recoverable errors.

## Single / multi file upload — defaults

1. Dropzone + “Browse files”
2. Accepted types + max size stated **before** pick
3. Per-file row — name, size, progress, cancel, error
4. Overall progress for batches
5. Success summary + link to where files landed

## Bulk CSV/import wizard

1. Upload file
2. **Field mapping** — source column → product field
3. **Validation** — row errors list (downloadable)
4. **Resolve / skip** bad rows
5. Confirm import + result counts (created / updated / failed)

## Content that must appear

| Area | Expected |
|------|----------|
| Constraints | Types, size, row limits |
| Errors | Which file/row + why |
| Partial success | Counts, not only “failed” |

## Defaults

- Don’t block UI without cancel on long uploads
- Re-auth mid-upload → clear resume/retry message
- Virus/malware scan status if you scan

## Anti-patterns

- Silent fail after drop
- Mapping step with no preview rows
- “Success” when some rows failed

## Checklist

- [ ] Types/size upfront
- [ ] Per-file progress + error
- [ ] Import: map → validate → results
