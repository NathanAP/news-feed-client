// The app's clock logo, drawn inline so it inherits `currentColor` — the header
// sets the color per theme (gold in dark, near-black in light).
export function Logo({ size = 32 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 512 512"
            fill="none"
            role="img"
            aria-label="news-feed-client"
        >
            <circle
                cx="256"
                cy="256"
                r="196"
                stroke="currentColor"
                strokeWidth="7"
            />
            <g
                fill="currentColor"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="46"
                textAnchor="middle"
            >
                <text x="256" y="112">
                    XII
                </text>
                <text x="412" y="272">
                    III
                </text>
                <text x="256" y="448">
                    VI
                </text>
                <text x="100" y="272">
                    IX
                </text>
            </g>
            <g
                stroke="currentColor"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M256 172 L256 358 Q256 396 222 402" />
                <path d="M256 174 Q260 152 286 158 L302 172" />
                <path d="M238 252 L302 252" />
            </g>
            <g fill="currentColor">
                <polygon points="204,416 227,408 212,393" />
                <polygon points="318,178 293,180 301,160" />
                <polygon points="320,252 298,263 298,241" />
            </g>
        </svg>
    )
}
