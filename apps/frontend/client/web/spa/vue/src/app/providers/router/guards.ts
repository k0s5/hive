import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useRefreshAuthTokens } from '@/features/auth/refresh/model'
import useUserStore from '@entities/user/model/store'

/**
 * Guard for protected routes that require authentication
 * Redirects unauthenticated users to signin page
 */
export const requireAuthGuard = async (
  _: RouteLocationNormalized,
  __: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const userStore = useUserStore()
  const { refreshAuthTokens } = useRefreshAuthTokens()

  // If user is not authenticated
  if (!userStore.user) {
    // Try to refresh tokens if refresh token exists
    if (localStorage.getItem('refreshToken')) {
      try {
        await refreshAuthTokens()

        // If refresh was successful and user is now authenticated
        if (userStore.user) {
          return next()
        }
      } catch (error) {
        // If refresh failed, clear invalid tokens
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('accessToken')
        //todo replace with signout method
      }
    }

    // Redirect to signin if no valid authentication
    return next({ name: 'signin' })
  }

  // User is authenticated, proceed
  next()
}

/**
 * Guard for authentication routes (signin/signup)
 * Redirects authenticated users to home page
 */
export const guestOnlyGuard = async (
  _: RouteLocationNormalized,
  __: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const userStore = useUserStore()
  const { refreshAuthTokens } = useRefreshAuthTokens()

  // If user is already authenticated, redirect to home
  if (userStore.user) {
    return next({ name: 'home' })
  }

  // Check if there's a valid refresh token to restore session
  const refreshToken = localStorage.getItem('refreshToken')
  if (refreshToken) {
    try {
      await refreshAuthTokens()

      // If refresh was successful, user is now authenticated
      if (userStore.user) {
        return next({ name: 'home' })
      }
    } catch (error) {
      // If refresh failed, clear invalid tokens and continue to auth page
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('accessToken')
      //todo replace with signout method
    }
  }

  // User is not authenticated, allow access to auth routes
  next()
}
