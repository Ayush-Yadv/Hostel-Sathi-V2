import { useState } from 'react';
import { Send } from 'lucide-react';
import { saveContactForm } from '../../lib/contactform';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    college: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const wordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    if (id === 'message' && wordCount(value) > 200) {
      return; // prevent input beyond 200 words
    }

    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    // Phone validation: 10-digit numeric
    if (!/^\d{10}$/.test(formData.phone.trim())) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    // Message word count check
    if (wordCount(formData.message) > 200) {
      setError('Message should not exceed 200 words');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await saveContactForm({
        name: formData.name,
        phone: formData.phone,
        college: formData.college,
        message: formData.message
      });

      if (result.success) {
        window.location.href = '/contact-thank-you';
      } else {
        setError(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="py-10 px-4 bg-gradient-to-r from-[#5A00F0]/10 to-[#B366FF]/10">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 md:max-w-2xl lg:max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleContactSubmit} className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
          <div className="md:col-span-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
              placeholder="Your name"
              required
            />
          </div>

          <div className="md:col-span-1">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
              placeholder="Your phone number"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
              College
            </label>
            <input
              type="text"
              id="college"
              value={formData.college}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
              placeholder="Your college name"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A00F0]"
              placeholder="Your message (max 200 words)"
              required
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">
              Word count: {wordCount(formData.message)} / 200
            </p>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#8300FF] text-white font-semibold py-3 rounded-md hover:bg-[#7000DD] transition flex items-center justify-center gap-2 disabled:bg-purple-300"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'} {!isSubmitting && <Send size={16} />}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
