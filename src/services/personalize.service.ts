import PersonalizeSDK from '@contentstack/personalize-edge-sdk'

export interface PersonalizeUser {
  uid?: string
  attributes?: Record<string, any>
}

export interface PersonalizeVariant {
  experienceShortUid: string
  variantShortUid: string | null
  experienceTitle?: string
  variantTitle?: string
}

export interface PersonalizeManifest {
  variants: PersonalizeVariant[]
  userUid: string
}

export interface PersonalizeEvent {
  type: 'IMPRESSION' | 'EVENT'
  experienceShortUid?: string
  variantShortUid?: string
  eventKey?: string
}

export class PersonalizeService {
  private sdk: any = null
  private initialized: boolean = false
  private initPromise: Promise<void> | null = null

  constructor() {
    // Initialize SDK when service is created
    this.initializeSDK()
  }

  private async initializeSDK() {
    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = this.doInit()
    return this.initPromise
  }

  private async doInit() {
    try {
      const projectUid = import.meta.env.VITE_CONTENTSTACK_PERSONALIZE_PROJECT_UID
      if (!projectUid) {
        return
      }

      this.sdk = await PersonalizeSDK.init(projectUid)
      this.initialized = true
    } catch (error) {
      // SDK initialization failed - will use fallback behavior
    }
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initializeSDK()
    }
  }

  /**
   * Get the current user UID using official SDK
   */
  getUserUid(): string | null {
    if (!this.sdk) return null
    return this.sdk.getUserId()
  }

  /**
   * Set user attributes using official SDK
   */
  async setUserAttributes(attributes: Record<string, any>): Promise<void> {
    try {
      await this.ensureInitialized()
      if (!this.sdk) {
        return
      }

      await this.sdk.set(attributes)
    } catch (error) {
      // Failed to set user attributes - continue with fallback behavior
    }
  }

  /**
   * Get active variants using official SDK
   */
  async getManifest(): Promise<PersonalizeManifest | null> {
    try {
      await this.ensureInitialized()
      if (!this.sdk) {
        return null
      }

      const variants = this.sdk.getVariants()
      const userUid = this.sdk.getUserId()

      // Convert variants object to our format
      const variantsArray = Object.entries(variants || {}).map(([experienceShortUid, variantShortUid]) => ({
        experienceShortUid,
        variantShortUid: variantShortUid as string
      }))

      const manifest: PersonalizeManifest = {
        variants: variantsArray,
        userUid: userUid || ''
      }

      return manifest
    } catch (error) {
      return null
    }
  }

  /**
   * Track an event using official SDK
   */
  async trackEvent(event: PersonalizeEvent): Promise<void> {
    try {
      await this.ensureInitialized()
      if (!this.sdk) {
        return
      }

      if (event.type === 'EVENT' && event.eventKey) {
        await this.sdk.triggerEvent(event.eventKey)
      } else if (event.type === 'IMPRESSION' && event.experienceShortUid && event.variantShortUid) {
        await this.sdk.triggerImpressions({
          aliases: [`cs_personalize_${event.experienceShortUid}_${event.variantShortUid}`]
        })
      }
    } catch (error) {
      // Failed to track event - continue silently
    }
  }

  /**
   * Track impression for a variant
   */
  async trackImpression(experienceShortUid: string, variantShortUid: string): Promise<void> {
    await this.trackEvent({
      type: 'IMPRESSION',
      experienceShortUid,
      variantShortUid
    })
  }

  /**
   * Track custom event (like doctor specialty clicked)
   */
  async trackCustomEvent(eventKey: string): Promise<void> {
    await this.trackEvent({
      type: 'EVENT',
      eventKey
    })
  }

  /**
   * Get variant for a specific experience using official SDK
   */
  async getVariantForExperience(experienceShortUid: string): Promise<PersonalizeVariant | null> {
    if (!this.sdk) {
      await this.ensureInitialized()
      
      if (!this.sdk) {
        return null
      }
    }
    
    const variantShortUid = this.sdk.getActiveVariant(experienceShortUid)
    
    if (variantShortUid === null || variantShortUid === undefined) {
      return null
    }

    return {
      experienceShortUid,
      variantShortUid
    }
  }

  /**
   * Check if user should see a specific variant using official SDK
   */
  shouldShowVariant(experienceShortUid: string, variantShortUid: string): boolean {
    if (!this.sdk) return false
    
    const activeVariant = this.sdk.getActiveVariant(experienceShortUid)
    return activeVariant === variantShortUid
  }

  /**
   * Initialize personalization for a page
   */
  async initializePage(userAttributes?: Record<string, any>): Promise<PersonalizeManifest | null> {
    try {
      await this.ensureInitialized()
      
      if (userAttributes) {
        await this.setUserAttributes(userAttributes)
      }

      return await this.getManifest()
    } catch (error) {
      return null
    }
  }

  /**
   * Set user ID using official SDK (for when user logs in)
   */
  async setUserId(userId: string, preserveAttributes: boolean = true): Promise<void> {
    try {
      await this.ensureInitialized()
      if (!this.sdk) {
        return
      }

      await this.sdk.setUserId(userId, { preserveUserAttributes: preserveAttributes })
    } catch (error) {
      // Failed to set user ID - continue silently
    }
  }

  /**
   * Track doctor specialty interest (for doctor recommendations)
   */
  async trackDoctorSpecialtyInterest(specialty: string): Promise<void> {
    await this.setUserAttributes({
      User_Segment: specialty
    })
    
    // Give Personalize time to process the attributes and re-evaluate audiences
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Track custom event
    await this.trackCustomEvent('doctor_specialty_viewed')
  }

  /**
   * Track trainer specialty interest (legacy method for compatibility)
   */
  async trackTrainerSpecialtyInterest(specialty: string): Promise<void> {
    await this.setUserAttributes({
      lastViewedSpecialty: specialty,
      interestIn: specialty.toLowerCase()
    })
    
    await new Promise(resolve => setTimeout(resolve, 500))
    await this.trackCustomEvent('trainer_specialty_viewed')
  }

  /**
   * Get personalized doctor recommendation experience (ID: 1)
   */
  getDoctorRecommendationVariant(): string | null {
    if (!this.sdk) return null
    return this.sdk.getActiveVariant('1')
  }

  /**
   * Get variant aliases for personalized content delivery
   */
  getVariantAliases(): string[] {
    if (!this.sdk) return []
    return this.sdk.getVariantAliases()
  }
}

// Export singleton instance
export const personalizeService = new PersonalizeService()
