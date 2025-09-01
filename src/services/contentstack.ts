import Contentstack from 'contentstack';

// Contentstack configuration

const Stack = Contentstack.Stack({
  api_key: import.meta.env.VITE_CONTENTSTACK_API_KEY,
  delivery_token: import.meta.env.VITE_CONTENTSTACK_DELIVERY_TOKEN,
  environment: import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT,
  region: import.meta.env.VITE_CONTENTSTACK_REGION || 'us'
});

// Generic content fetcher
export const getEntries = async (contentTypeUid: string, query?: any) => {
    try {
    const Query = Stack.ContentType(contentTypeUid).Query();
    
    if (query) {
      Object.keys(query).forEach(key => {
        const queryMethod = (Query as any)[key];
        if (typeof queryMethod === 'function') {
          queryMethod.call(Query, query[key]);
        }
      });
    }
    const result = await Query.toJSON().find();
    return result[0];
  } catch (error) {
    return [];
  }
};

// Get single entry
export const getEntry = async (contentTypeUid: string, entryUid: string) => {
  try {
    const Query = Stack.ContentType(contentTypeUid).Entry(entryUid);
    const result = await Query.toJSON().fetch();
    return result;
  } catch (error: any) {
    return null;
  }
};

// Specific content fetchers

export const getMedicalSpecialties = async () => {
  try {
    // Fetch the medical specialties section with referenced specialties
    const Query = Stack.ContentType('medical_specialties').Query();
    
    // Include the referenced specialties (field name is 'reference')
    Query.includeReference('reference');
    const result = await Query.toJSON().find();
    // Return the first (and only) entry since it's a singleton
    return result[0] && result[0].length > 0 ? result[0][0] : null;
  } catch (error) {

    return null;
  }
};

export const getDoctorCard = async (uid: string) => {
  return getEntry('doctor_card', uid);
};

// Get individual doctor with full details for profile page
export const getDoctorProfile = async (uid: string) => {
  try {
    const Query = Stack.ContentType('doctor_card').Entry(uid);
    // Include all referenced content
    Query.includeReference(['button_reference', 'specialization_reference', 'reference']);
    
    const result = await Query.toJSON().fetch();
    return result;
  } catch (error) {

    return null;
  }
};

// Doctor Cards
export const getDoctorCards = async () => {
  try {
    const Query = Stack.ContentType('doctor_card').Query();
    
    // Include all referenced content including images
    Query.includeReference(['button_reference', 'specialization_reference', 'reference', 'image']);
    
    const result = await Query.toJSON().find();
    return result[0] || [];
  } catch (error) {

    return [];
  }
};

// Featured Doctors Section
export const getFeaturedDoctorsSection = async () => {
  try {
    // Fetch the featured doctors section with referenced doctor cards
    const Query = Stack.ContentType('featured_doctors').Query(); // Using UID: featured_doctors
    
    // Include the referenced doctor cards and their images
    Query.includeReference(['reference', 'reference.image']);

    const result = await Query.toJSON().find();
    // Return the first (and only) entry since it's a singleton
    return result[0] && result[0].length > 0 ? result[0][0] : null;
  } catch (error) {
    // Error fetching featured doctors section
    return null;
  }
};

// Hero section
export const getHeroSection = async () => {
  try {
    // Since this is a singleton, get the first (and only) entry with referenced buttons
    const Query = Stack.ContentType('hero_section').Query();
    // Correctly include the referenced button content
    Query.includeReference('reference');
    
    const result = await Query.toJSON().find();
    
    // result[0] contains the entries array
    return result[0] && result[0].length > 0 ? result[0][0] : null;
  } catch (error) {
    return null;
  }
};

// Find Doctors Page content
export const getFindDoctorsPageContent = async () => {
  try {
    // Since this is a singleton, get the first (and only) entry
    const entries = await getEntries('find_doctors');
    return entries && entries.length > 0 ? entries[0] : null;
  } catch (error) {
    return null;
  }
};

// About Us Page Content
export const getAboutUsPageContent = async () => {
  try {
    // Fetch the about us page with all referenced content
    const Query = Stack.ContentType('about_us').Query();
    
    // Include all referenced content types
    Query.includeReference([
      'vision_values.vision_and_values',
      'our_team.team_members',
      'how_it_works.how_it_works_steps',
      'ready_to_connect.button_reference'
    ]);
    
    const result = await Query.toJSON().find();
    
    // Return the first (and only) entry since it's a singleton
    return result[0] && result[0].length > 0 ? result[0][0] : null;
  } catch (error) {
    return null;
  }
};

// Footer Content
export const getFooterContent = async () => {
  try {
    // Fetch the footer page with all referenced content
    const Query = Stack.ContentType('medilink_footer').Query();
    
    // Include all referenced content types
    Query.includeReference([
      'social_media_links',
      'footer_sections',
      'footer_sections.navigation_links',
      'footer_sections.contact_info',
      'quick_links',
      'support_links'
    ]);
    
    const result = await Query.toJSON().find();
    
    // Return the first (and only) entry since it's a singleton
    return result[0] && result[0].length > 0 ? result[0][0] : null;
  } catch (error) {

    return null;
  }
};

// Header Content
export const getHeaderContent = async () => {
  try {
    const Query = Stack.ContentType('medilink_header').Query();
    Query.includeReference(['logo']);

    const result = await Query.toJSON().find();
    
    // Return the first (and only) entry since it's a singleton
    return result[0] && result[0].length > 0 ? result[0][0] : null;
  } catch (error) {

    return null;
  }
};

// Health Advice Section
export const getHealthAdviceSection = async () => {
  try {
    const Query = Stack.ContentType('health_advice_section').Query();
    Query.includeReference([
      'health_advices',
      'health_advices.image',
      'health_advices.doctor_reference',
      'health_advices.doctor_reference.profile_image',
      'health_advices.buttons',
      'featured_articles',
      'featured_articles.image',
      'featured_articles.doctor_reference',
      'featured_articles.doctor_reference.profile_image',
      'featured_articles.buttons',
      'cta_buttons'
    ]);

    const result = await Query.toJSON().find();
    
    // Return the first (and only) entry since it's a singleton
    return result[0] && result[0].length > 0 ? result[0][0] : null;
  } catch (error) {

    return null;
  }
};

// Latest Medical Advice Section
export const getLatestMedicalAdvice = async () => {
  try {
    const Query = Stack.ContentType('latest_medical_advice').Query();
    Query.includeReference([
      'health_advice_cards',
      'health_advice_cards.image', 
      'health_advice_cards.doctor_reference',
      'health_advice_cards.doctor_reference.image',
      'health_advice_cards.author_reference',
      'health_advice_cards.author_reference.image',
      'health_advice_cards.button_references'
    ]);

    const result = await Query.toJSON().find();
    
    // Return the first (and only) entry since it's a singleton
    return result[0] && result[0].length > 0 ? result[0][0] : null;
  } catch (error) {

    return null;
  }
};

// Get individual health advice article by UID
export const getHealthAdviceArticle = async (articleUid: string) => {
  try {
    const Query = Stack.ContentType('health_advice_article').Query();
    Query.where('uid', articleUid);
    Query.includeReference([
      'image',
      'doctor_reference',
      'doctor_reference.profile_image',
      'doctor_reference.specialization_reference',
      'buttons'
    ]);

    const result = await Query.toJSON().find();
    
    // Return the first article found
    return result[0] && result[0].length > 0 ? result[0][0] : null;
  } catch (error) {

    return null;
  }
};

// Patient Inquiries Page Content
export const getPatientInquiriesPageContent = async () => {
  try {
    // Fetch the patient inquiries page content using the specific UID
    const Query = Stack.ContentType('patient_inquires').Query();
    
    const result = await Query.toJSON().find();
    // Return the first (and only) entry since it's likely a singleton
    return result[0] && result[0].length > 0 ? result[0][0] : null;
  } catch (error) {

    return null;
  }
};

/**
 * Fetch doctors recommendation using proper entry variants (similar to trainer recommendations)
 * CORRECTED: Variants work on Entry objects, not Query objects
 */
export const getDoctorsRecommendation = async (variantAliases?: string[]): Promise<any> => {
  try {
    // Get the base doctors recommendations entry UID
    const query = Stack
      .ContentType('doctors_recommendation')
      .Query()
      .toJSON();
    
    const response = await query.find();
    const entries = Array.isArray(response) ? response[0] : response.entries || [];
    
    if (!entries || entries.length === 0) {
      return null;
    }
    
    // Get the first entry UID (assuming singleton pattern for recommendations)
    const baseEntryUid = entries[0].uid;
    
    // Use Entry().variants() for personalization
    let entryQuery = Stack
      .ContentType('doctors_recommendation')
      .Entry(baseEntryUid);
    
    // Apply variants if we have variant aliases
    if (variantAliases && variantAliases.length > 0) {
      // Build proper Contentstack variant UID: cs_personalize_{experience}_{variant}
      const experienceId = '1'; // Doctor recommendations experience
      const variantId = variantAliases[0]; // Get the variant number
      const contentstackVariantUid = `cs_personalize_${experienceId}_${variantId}`;
      
      // Use the proper Contentstack variant UID format
      entryQuery = entryQuery.variants(contentstackVariantUid);
    }
    
    // Include referenced doctors
    entryQuery = entryQuery.includeReference([
      'doctors_recommended',
      'doctors_recommended.image',
      'doctors_recommended.specialization_reference',
      'doctors_recommended.button_reference'
    ]);
    
    // Fetch the variant entry
    const variantEntry = await entryQuery.toJSON().fetch();
    
    if (!variantEntry) {
      // Fallback: Get base entry without variants
      const fallbackEntry = await Stack
        .ContentType('doctors_recommendation')
        .Entry(baseEntryUid)
        .includeReference([
          'doctors_recommended',
          'doctors_recommended.image',
          'doctors_recommended.specialization_reference',
          'doctors_recommended.button_reference'
        ])
        .toJSON()
        .fetch();
        
      return fallbackEntry || null;
    }
    
    return variantEntry;
    
  } catch (error) {
    return null;
  }
};

export default Stack;
