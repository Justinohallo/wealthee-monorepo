export interface PortfolioManager {
  uid: string
  email: string
  emailVerified: boolean
  displayName: string
  disabled: boolean
  metadata: {
    lastSignInTime: string | null
    creationTime: string
    lastRefreshTime: string | null
  }
  customClaims: {
    role: string
  }
  tokensValidAfterTime: string
  providerData: Array<{
    uid: string
    displayName: string
    email: string
    providerId: string
  }>
}
