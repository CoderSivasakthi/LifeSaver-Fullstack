import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Textarea } from './components/ui/textarea';
import { toast } from 'sonner';
import { Badge } from './components/ui/badge';
import { Toaster } from './components/ui/sonner';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Home Page Component
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-emerald-800">Life Saver</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-emerald-700 hover:text-emerald-900"
              >
                Home
              </Button>
              <Button 
                onClick={() => navigate('/form')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Create QR
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mb-8">
            <span className="text-6xl mb-4 block">🆘</span>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
              Welcome to Life Saver!
            </h2>
            <p className="text-xl text-emerald-700 mb-8 max-w-2xl mx-auto">
              Your digital safety partner is ready. Create emergency QR stickers that could save your life.
            </p>
            <Button 
              onClick={() => navigate('/form')}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-12 mt-16">
          <div>
            <div className="mb-8">
              <span className="text-4xl mb-4 block">💊</span>
              <h3 className="text-2xl font-bold text-emerald-900 mb-4">Why LifeSaver?</h3>
              <div className="space-y-4 text-emerald-700">
                <p className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  <span><strong>Emergency Ready</strong> – QR code stores your vital details</span>
                </p>
                <p className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  <span><strong>Quick Contact</strong> – Relatives notified instantly</span>
                </p>
                <p className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  <span><strong>Blood Group Access</strong> – Life-saving in critical times</span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-8">
              <span className="text-4xl mb-4 block">🔒</span>
              <h3 className="text-2xl font-bold text-emerald-900 mb-4">Our Promise</h3>
              <div className="space-y-4 text-emerald-700">
                <p className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  <span>Your data is 99.9% secure</span>
                </p>
                <p className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  <span>No leaks, no misuse – only you control your info</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Form Page Component
const FormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    blood_group: '',
    guardian_name: '',
    guardian_phone: '',
    address: '',
    aadhar: ''
  });
  const [loading, setLoading] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setFormData({
      name: '',
      phone: '',
      blood_group: '',
      guardian_name: '',
      guardian_phone: '',
      address: '',
      aadhar: ''
    });
    toast.success('Form cleared successfully!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.blood_group) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/details`, formData);
      toast.success('Emergency details saved successfully!');
      navigate(`/preview/${response.data.id}`);
    } catch (error) {
      console.error('Error saving details:', error);
      toast.error('Failed to save details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-emerald-800">Life Saver</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-emerald-700 hover:text-emerald-900"
              >
                Home
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate('/form')}
                className="text-emerald-700 hover:text-emerald-900"
              >
                Form
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side - Welcome info */}
          <div className="space-y-8">
            <div>
              <span className="text-5xl mb-4 block">👋</span>
              <h2 className="text-3xl font-bold text-emerald-900 mb-4">Welcome!</h2>
              <p className="text-emerald-700">Your digital safety partner is ready.</p>
            </div>

            <div>
              <span className="text-4xl mb-4 block">💊</span>
              <h3 className="text-2xl font-bold text-emerald-900 mb-4">Why LifeSaver?</h3>
              <div className="space-y-3 text-emerald-700">
                <p>Emergency Ready – QR code stores your vital details</p>
                <p>Quick Contact – Relatives notified instantly</p>
                <p>Blood Group Access – Life-saving in critical times</p>
              </div>
            </div>

            <div>
              <span className="text-4xl mb-4 block">🔒</span>
              <h3 className="text-2xl font-bold text-emerald-900 mb-4">Our Promise</h3>
              <div className="space-y-3 text-emerald-700">
                <p>Your data is 99.9% secure</p>
                <p>No leaks, no misuse – only you control your info</p>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div>
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-emerald-200">
              <CardHeader>
                <CardTitle className="text-2xl text-emerald-900 text-center">
                  Fill the form
                </CardTitle>
                <div className="flex justify-center">
                  <Button 
                    type="button" 
                    onClick={handleClear}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    data-testid="clear-form-button"
                  >
                    Clear
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-emerald-800">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="border-emerald-300 focus:border-emerald-500"
                      data-testid="name-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-emerald-800">Phone number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      required
                      className="border-emerald-300 focus:border-emerald-500"
                      data-testid="phone-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="blood_group" className="text-emerald-800">Blood Group *</Label>
                    <Select 
                      value={formData.blood_group} 
                      onValueChange={(value) => handleInputChange('blood_group', value)}
                    >
                      <SelectTrigger className="border-emerald-300 focus:border-emerald-500" data-testid="blood-group-select">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="guardian_name" className="text-emerald-800">Parents/Guardian Name</Label>
                    <Input
                      id="guardian_name"
                      value={formData.guardian_name}
                      onChange={(e) => handleInputChange('guardian_name', e.target.value)}
                      placeholder="Enter guardian name"
                      className="border-emerald-300 focus:border-emerald-500"
                      data-testid="guardian-name-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="guardian_phone" className="text-emerald-800">Parents/Guardian Phone</Label>
                    <Input
                      id="guardian_phone"
                      value={formData.guardian_phone}
                      onChange={(e) => handleInputChange('guardian_phone', e.target.value)}
                      placeholder="Enter guardian phone"
                      className="border-emerald-300 focus:border-emerald-500"
                      data-testid="guardian-phone-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-emerald-800">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your address"
                      className="border-emerald-300 focus:border-emerald-500 resize-none"
                      rows={3}
                      data-testid="address-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="aadhar" className="text-emerald-800">Aadhar number</Label>
                    <Input
                      id="aadhar"
                      value={formData.aadhar}
                      onChange={(e) => handleInputChange('aadhar', e.target.value)}
                      placeholder="Enter Aadhar number"
                      className="border-emerald-300 focus:border-emerald-500"
                      data-testid="aadhar-input"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg"
                    data-testid="submit-form-button"
                  >
                    {loading ? 'Saving...' : 'Submit'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Preview Page Component
const PreviewPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API}/details/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, navigate]);

  const handleDownloadPDF = () => {
    window.open(`${API}/generate-pdf/${userId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-emerald-700">User data not found</p>
          <Button onClick={() => navigate('/')} className="mt-4 bg-emerald-600 hover:bg-emerald-700">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-emerald-800">Life Saver</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-emerald-700 hover:text-emerald-900"
              >
                Home
              </Button>
              <Button 
                onClick={() => navigate('/form')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                New QR
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">✅</span>
          <h2 className="text-3xl font-bold text-emerald-900 mb-2">Details Saved Successfully!</h2>
          <p className="text-emerald-700">Your emergency QR stickers are ready to download.</p>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-emerald-200 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-900 text-center">
              Preview Your Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-emerald-800 font-semibold">Name</Label>
                  <p className="text-emerald-700" data-testid="preview-name">{userData.name}</p>
                </div>
                <div>
                  <Label className="text-emerald-800 font-semibold">Phone</Label>
                  <p className="text-emerald-700" data-testid="preview-phone">{userData.phone}</p>
                </div>
                <div>
                  <Label className="text-emerald-800 font-semibold">Blood Group</Label>
                  <Badge className="bg-red-100 text-red-800" data-testid="preview-blood-group">{userData.blood_group}</Badge>
                </div>
                <div>
                  <Label className="text-emerald-800 font-semibold">Guardian Name</Label>
                  <p className="text-emerald-700" data-testid="preview-guardian-name">{userData.guardian_name}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-emerald-800 font-semibold">Guardian Phone</Label>
                  <p className="text-emerald-700" data-testid="preview-guardian-phone">{userData.guardian_phone}</p>
                </div>
                <div>
                  <Label className="text-emerald-800 font-semibold">Address</Label>
                  <p className="text-emerald-700" data-testid="preview-address">{userData.address}</p>
                </div>
                <div>
                  <Label className="text-emerald-800 font-semibold">Aadhar Number</Label>
                  <p className="text-emerald-700" data-testid="preview-aadhar">{userData.aadhar}</p>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="mt-8 pt-6 border-t border-emerald-200">
              <div className="text-center">
                <Label className="text-emerald-800 font-semibold text-lg block mb-4">Your Emergency QR Code</Label>
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-md border-2 border-emerald-200">
                    <img 
                      src={`${BACKEND_URL}/api/qr-code/${userId}`}
                      alt="Emergency QR Code"
                      className="w-48 h-48 mx-auto"
                      data-testid="preview-qr-code"
                    />
                    <p className="text-sm text-emerald-600 mt-2 text-center max-w-xs">
                      Scan this QR code to view emergency contact information
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={handleDownloadPDF}
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg"
            data-testid="download-pdf-button"
          >
            📄 Download PDF Stickers
          </Button>
          <p className="text-sm text-emerald-600 mt-2">
            Download and print your emergency QR stickers
          </p>
        </div>
      </div>
    </div>
  );
};

// Public Profile Page (for QR scan)
const ProfilePage = () => {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API}/profile/${userId}`);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Profile not found');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-emerald-200 w-full max-w-md mx-4">
          <CardContent className="text-center py-8">
            <span className="text-6xl mb-4 block">❌</span>
            <h2 className="text-2xl font-bold text-emerald-900 mb-2">Profile Not Found</h2>
            <p className="text-emerald-700">The QR code you scanned is invalid or expired.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-emerald-200 w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <span className="text-6xl mb-4 block">🆘</span>
          <CardTitle className="text-2xl text-emerald-900">Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <div>
              <Label className="text-emerald-800 font-semibold block mb-1">Name</Label>
              <p className="text-xl font-bold text-emerald-900" data-testid="profile-name">{profileData.name}</p>
            </div>
            <div>
              <Label className="text-emerald-800 font-semibold block mb-1">Phone</Label>
              <p className="text-lg text-emerald-700" data-testid="profile-phone">
                <a href={`tel:${profileData.phone}`} className="hover:underline">
                  {profileData.phone}
                </a>
              </p>
            </div>
            <div>
              <Label className="text-emerald-800 font-semibold block mb-1">Blood Group</Label>
              <Badge className="bg-red-100 text-red-800 text-lg px-4 py-2" data-testid="profile-blood-group">
                {profileData.blood_group}
              </Badge>
            </div>
          </div>
          <div className="pt-4 border-t border-emerald-200">
            <p className="text-sm text-emerald-600 text-center">
              This is an emergency contact profile. If this is a medical emergency, please contact emergency services immediately.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/preview/:userId" element={<PreviewPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
