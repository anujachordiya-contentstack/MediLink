import React, { useState, useEffect, useCallback } from 'react'
import { personalizeService, PersonalizeManifest, PersonalizeVariant } from '../services/personalize.service'

export interface UsePersonalizeOptions {
  userAttributes?: Record<string, any>
  autoInitialize?: boolean
}

export interface UsePersonalizeResult {
  manifest: PersonalizeManifest | null
  userUid: string | null
  loading: boolean
  error: string | null
  setUserAttributes: (attributes: Record<string, any>) => Promise<void>
  trackCustomEvent: (eventKey: string) => Promise<void>
  getVariantForExperience: (experienceShortUid: string) => Promise<PersonalizeVariant | null>
  shouldShowVariant: (experienceShortUid: string, variantShortUid: string) => boolean
  initializePage: (userAttributes?: Record<string, any>) => Promise<void>
}

/**
 * Main hook for Contentstack Personalize integration
 */
export const usePersonalize = (options: UsePersonalizeOptions = {}): UsePersonalizeResult => {
  const [manifest, setManifest] = useState<PersonalizeManifest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userUid, setUserUid] = useState<string | null>(null)

  const { userAttributes, autoInitialize = true } = options

  const initializePage = useCallback(async (pageUserAttributes?: Record<string, any>) => {
    try {
      //('[usePersonalize] Starting page initialization...')
      setLoading(true)
      setError(null)

      const attributesToSet = pageUserAttributes || userAttributes
      //('[usePersonalize] Attributes to set:', attributesToSet)
      
      const result = await personalizeService.initializePage(attributesToSet)
      //('[usePersonalize] Personalization initialized, manifest:', result)
      
      setManifest(result)
      setUserUid(personalizeService.getUserUid())
      //('[usePersonalize] Page initialization complete')
    } catch (err) {
      //('[usePersonalize] Initialization error:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize personalization')
    } finally {
      setLoading(false)
    }
  }, []) // Remove userAttributes dependency to prevent infinite loops

  const setUserAttributes = useCallback(async (attributes: Record<string, any>) => {
    try {
      await personalizeService.setUserAttributes(attributes)
      setUserUid(personalizeService.getUserUid())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set user attributes')
    }
  }, [])

  const trackCustomEvent = useCallback(async (eventKey: string) => {
    try {
      await personalizeService.trackCustomEvent(eventKey)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to track event')
    }
  }, [])

  const getVariantForExperience = useCallback(async (experienceShortUid: string): Promise<PersonalizeVariant | null> => {
    //(`[usePersonalize] getVariantForExperience called for experience: ${experienceShortUid}`)
    const variant = await personalizeService.getVariantForExperience(experienceShortUid)
    //(`[usePersonalize] getVariantForExperience(${experienceShortUid}):`, variant)
    return variant
  }, [manifest])

  const shouldShowVariant = useCallback((experienceShortUid: string, variantShortUid: string): boolean => {
    return personalizeService.shouldShowVariant(experienceShortUid, variantShortUid)
  }, [manifest])

  useEffect(() => {
    if (autoInitialize && !loading && !manifest) {
      initializePage()
    }
  }, [autoInitialize]) // Remove initializePage from dependencies

  return {
    manifest,
    userUid,
    loading,
    error,
    setUserAttributes,
    trackCustomEvent,
    getVariantForExperience,
    shouldShowVariant,
    initializePage
  }
}

/**
 * Hook to get a specific variant for an experience
 */
export const usePersonalizeVariant = (experienceShortUid: string): PersonalizeVariant | null => {
  const [variant, setVariant] = useState<PersonalizeVariant | null>(null)
  const { getVariantForExperience, loading, manifest } = usePersonalize({ autoInitialize: true })
  
  useEffect(() => {
    if (!experienceShortUid) {
      return
    }
    
    const fetchVariant = async () => {
      try {
        const result = await getVariantForExperience(experienceShortUid)
        
        if (result && result.variantShortUid) {
          setVariant(result)
        }
      } catch (error) {
        //(`[usePersonalizeVariant] Error fetching variant for ${experienceShortUid}:`, error)
      }
    }
    
    fetchVariant() // Initial fetch
    
    // Simple polling: Check for variant updates every 1 second, up to 5 attempts
    let attempts = 0
    const maxAttempts = 5
    
    const interval = setInterval(() => {
      attempts++
      
      if (!loading && !variant && attempts < maxAttempts) {
        fetchVariant()
      } else {
        clearInterval(interval) // Stop polling after variant found or max attempts
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [experienceShortUid, getVariantForExperience, loading, manifest])
  
  return variant
}

/**
 * Hook to check if a specific variant should be shown
 */
export const usePersonalizeCondition = (experienceShortUid: string, variantShortUid: string): boolean => {
  const { shouldShowVariant } = usePersonalize({ autoInitialize: false })
  return shouldShowVariant(experienceShortUid, variantShortUid)
}

/**
 * Component wrapper for conditional personalized content
 */
export interface PersonalizeConditionalProps {
  experienceShortUid: string
  variantShortUid: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const PersonalizeConditional: React.FC<PersonalizeConditionalProps> = ({
  experienceShortUid,
  variantShortUid,
  children,
  fallback = null
}) => {
  const shouldShow = usePersonalizeCondition(experienceShortUid, variantShortUid)
  
  return shouldShow ? <>{children}</> : <>{fallback}</>
}
