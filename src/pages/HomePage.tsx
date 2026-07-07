import { useState } from 'react'
import { useSession } from '../hooks/useSession'
import { useCurrentUser } from '../hooks/useCurrentUser'

export function HomePage() {
    const { logout } = useSession()
    const { data: user, isPending, isError } = useCurrentUser()
    const [avatarFailed, setAvatarFailed] = useState(false)

    return (
        <main>
            <h1>Home</h1>

            {isPending && <p>Loading your profile…</p>}
            {isError && <p>Could not load your profile.</p>}

            {user !== undefined && (
                <section>
                    {user.picture !== null && !avatarFailed && (
                        <img
                            src={user.picture}
                            alt=""
                            width={64}
                            height={64}
                            referrerPolicy="no-referrer"
                            onError={() => setAvatarFailed(true)}
                        />
                    )}
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                </section>
            )}

            <button type="button" onClick={logout}>
                Sign out
            </button>
        </main>
    )
}
