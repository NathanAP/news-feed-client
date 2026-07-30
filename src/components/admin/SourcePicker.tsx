import { useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'
import { useSourceSearch } from '../../hooks/useSources'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import type { Source } from '../../types/source'

export interface SourcePickerProps {
    value: Source | null
    onChange: (source: Source | null) => void
    disabled?: boolean
    error?: boolean
    helperText?: string
}

// Picks the source an article belongs to. Searches server-side by name rather
// than loading every source: the listing is paginated (20 per page), so a plain
// dropdown would silently hide everything past the first page once the catalog
// grows.
export function SourcePicker({
    value,
    onChange,
    disabled = false,
    error = false,
    helperText,
}: SourcePickerProps) {
    const { t } = useTranslation()
    const [term, setTerm] = useState('')
    // One request per pause in typing, not per keystroke.
    const debouncedTerm = useDebouncedValue(term, 400)
    const { data, isFetching } = useSourceSearch(debouncedTerm)

    const options = data?.items ?? []

    return (
        <Autocomplete
            value={value}
            onChange={(_event, selected) => onChange(selected)}
            inputValue={term}
            onInputChange={(_event, next) => setTerm(next)}
            options={options}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, selected) =>
                option.id === selected.id
            }
            // The list is already filtered by the API; filtering again on the
            // client would drop matches the server found by other criteria.
            filterOptions={(items) => items}
            loading={isFetching}
            disabled={disabled}
            noOptionsText={t('articleForm.sourceEmpty')}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={t('articleForm.sourceLabel')}
                    error={error}
                    helperText={helperText}
                />
            )}
        />
    )
}
