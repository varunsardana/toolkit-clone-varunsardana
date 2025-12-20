// List of authorized users is now loaded from an environment variable
export function getAuthorizedUsers(): string[] {
  try {
    const users = JSON.parse(process.env.AUTH_USERS_JSON || '[]');
    // Support both array of emails or array of user objects
    if (Array.isArray(users) && typeof users[0] === 'object' && users[0].email) {
      return users.map((u: any) => u.email.toLowerCase());
    }
    if (Array.isArray(users) && typeof users[0] === 'string') {
      return users.map((u: string) => u.toLowerCase());
    }
    return [];
  } catch {
    return [];
  }
}

// Check if a user is authorized
export function isUserAuthorized(email: string | null | undefined): boolean {
  if (!email) return false

  // For development/testing, allow all users
  if (process.env.NODE_ENV === "development") {
    console.log("Development mode: allowing all users")
    return true
  }

  const authorizedUsers = getAuthorizedUsers();
  const isAuthorized = authorizedUsers.includes(email.toLowerCase())
  console.log("Checking authorization for:", email, "Result:", isAuthorized)
  return isAuthorized
}
export const AUTHORIZED_DOMAINS = [
  // Uncomment and add domains if you want to authorize entire domains
  // "school.edu",
  // "university.edu",
]

export function isUserDomainAuthorized(email: string | null | undefined): boolean {
  if (!email) return false

  // For development/testing, allow all domains
  if (process.env.NODE_ENV === "development") {
    return true
  }

  const domain = email.split("@")[1]?.toLowerCase()
  const isAuthorized = AUTHORIZED_DOMAINS.some((authorizedDomain) => domain === authorizedDomain)
  console.log("Checking domain authorization for:", email, "Domain:", domain, "Result:", isAuthorized)
  return isAuthorized
}
