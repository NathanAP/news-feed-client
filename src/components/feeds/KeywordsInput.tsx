import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'
import { MAX_KEYWORDS, normalizeKeywords } from './keywords'

interface KeywordsInputProps {
    value: string[]
    onChange: (next: string[]) => void
    error?: boolean
    helperText?: string
    disabled?: boolean
}

// Reusable chips input for a feed's keywords (5..20). Built on MUI Autocomplete
// in freeSolo/multiple mode: type + Enter adds a chip, the chip's delete icon
// removes it. Values are normalized (see normalizeKeywords) on every change.
export function KeywordsInput({
    value,
    onChange,
    error,
    helperText,
    disabled,
}: KeywordsInputProps) {
    const { t } = useTranslation()

    return (
        <Autocomplete
            multiple
            freeSolo
            disabled={disabled}
            options={[]}
            value={value}
            onChange={(_, next) =>
                onChange(normalizeKeywords(next as string[]))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={t('feedForm.keywordsLabel')}
                    placeholder={
                        value.length < MAX_KEYWORDS
                            ? t('feedForm.keywordsPlaceholder')
                            : undefined
                    }
                    error={error}
                    helperText={
                        helperText ??
                        t('feedForm.keywordsCounter', {
                            count: value.length,
                            max: MAX_KEYWORDS,
                        })
                    }
                />
            )}
        />
    )
}
