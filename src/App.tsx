// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Home from './pages/Home';
import About from './pages/About';
import FindDoctors from './pages/FindDoctors';
// Uncomment the line below to use the CMS-enabled version
// import FindDoctorsWithCMS from './pages/FindDoctorsWithCMS';
import DoctorProfile from './pages/DoctorProfile';
import Inquiries from './pages/Inquiries';
import HealthAdvice from './pages/HealthAdvice';
import ArticleDetail from './pages/ArticleDetail';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/find-doctors" element={<FindDoctors />} />
          {/* To use CMS-enabled version, replace FindDoctors with FindDoctorsWithCMS */}
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/inquiries" element={<Inquiries />} />
          <Route path="/health-advice" element={<HealthAdvice />} />
          <Route path="/health-advice/:id" element={<ArticleDetail />} />
        </Routes>

      </Layout>
    </Router>
  );
}

export default App;