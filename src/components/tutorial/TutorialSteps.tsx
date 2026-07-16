import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

// The high-level flow, shown as a 1—2—3 overview. Copy lives in i18n under
// `tutorial.steps.<key>`.
const STEP_KEYS = ['createFeed', 'gather', 'read'] as const

// Content-only piece of the tutorial: the two wrappers (the "Help" entry and the
// first-visit welcome modal) both render this, so the flow is described in one
// place. Every step is rendered `active` on purpose — this is an overview, not a
// wizard the user walks through, so all three read as equally present.
export function TutorialSteps() {
    const { t } = useTranslation()
    const theme = useTheme()
    // Three steps side by side get cramped on phones; stack them there.
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

    return (
        <Stepper
            orientation={isSmallScreen ? 'vertical' : 'horizontal'}
            alternativeLabel={!isSmallScreen}
            sx={{
                // Onboarding highlights use the brand gold (see PROJECT.md).
                '& .MuiStepIcon-root.Mui-active': { color: 'brand.main' },
                '& .MuiStepIcon-root.Mui-active .MuiStepIcon-text': {
                    // `fill` isn't an sx system prop, so it can't take a
                    // 'brand.contrastText' path — it needs a real CSS value.
                    // It must be the variable (this theme runs `cssVariables`):
                    // reading `theme.palette.*` here would bake in the base
                    // (light) scheme's value and reuse it in dark mode too.
                    fill: 'var(--mui-palette-brand-contrastText)',
                },
            }}
        >
            {STEP_KEYS.map((key) => (
                <Step key={key} active>
                    <StepLabel>
                        <Box
                            sx={{
                                textAlign: { xs: 'left', sm: 'center' },
                                px: { sm: 1 },
                            }}
                        >
                            <Typography sx={{ fontWeight: 600 }}>
                                {t(`tutorial.steps.${key}.title`)}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                            >
                                {t(`tutorial.steps.${key}.body`)}
                            </Typography>
                        </Box>
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    )
}
