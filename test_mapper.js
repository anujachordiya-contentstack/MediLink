// Quick test to verify the data mapper works with actual CMS data
const testData = {
  "uid": "blt1794fa92daa4784c",
  "_version": 2,
  "locale": "en-us",
  "title": "Dr. John SmithCardiologist",
  "speciality": "Cardiologist",
  "experience": "15 Years",
  "fee": "₹150",
  "language": "English, Spanish",
  "ratings": {
    "value": 4.5
  },
  "reviews": "25 review",
  "created_at": "2025-08-19T15:48:15.906Z",
  "updated_at": "2025-08-19T15:49:07.139Z",
  "created_by": "blt9b467753de60251c",
  "updated_by": "blt9b467753de60251c",
  "tags": []
};

// Test the extraction functions
const extractDoctorName = (title, specialty) => {
  if (title.endsWith(specialty)) {
    return title.replace(specialty, '').trim();
  }
  const match = title.match(/^(Dr\.\s+[A-Za-z\s]+)/);
  return match ? match[1].trim() : title;
};

const extractExperienceYears = (experience) => {
  const match = experience.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

const extractConsultationFee = (fee) => {
  const match = fee.match(/\$?(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

const extractLanguages = (language) => {
  return language.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0);
};

const extractTotalReviews = (reviews) => {
  const match = reviews.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

// Test with actual data
console.log('=== Testing Data Mapper ===');
console.log('Original title:', testData.title);
console.log('Extracted doctor name:', extractDoctorName(testData.title, testData.speciality));
console.log('Original experience:', testData.experience);
console.log('Extracted experience years:', extractExperienceYears(testData.experience));
console.log('Original fee:', testData.fee);
console.log('Extracted consultation fee:', extractConsultationFee(testData.fee));
console.log('Original language:', testData.language);
console.log('Extracted languages:', extractLanguages(testData.language));
console.log('Original reviews:', testData.reviews);
console.log('Extracted total reviews:', extractTotalReviews(testData.reviews));
console.log('Rating value:', testData.ratings.value);
