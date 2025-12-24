import React from 'react';
import { HelpCircle, Mail, Phone, MessageCircle, Book, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Help() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const helpTopics = [
    {
      title: 'Getting Started',
      description: 'Learn how to set up your account and upload your first receipt',
      icon: Book
    },
    {
      title: 'Managing Expenses',
      description: 'Understand how to categorize and track your spending',
      icon: Book
    },
    {
      title: 'Viewing Summaries',
      description: 'Explore daily, weekly, monthly, and yearly expense reports',
      icon: Book
    },
    {
      title: 'Setting Budgets',
      description: 'Configure notification limits and budget alerts',
      icon: Book
    }
  ];

  const contactOptions = [
    {
      icon: Mail,
      label: 'Email Support',
      value: 'budgetbeefyp@gmail.com',
      action: () => navigate('/support'),
      color: 'text-blue-500'
    }
    /*{
      icon: Phone,
      label: 'Phone Support',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      color: 'text-green-500'
    },
    {
      icon: MessageCircle,
      label: 'Live Chat',
      value: 'Available Mon-Fri 9AM-5PM',
      link: '#',
      color: 'text-purple-500'
    }*/
  ];

  return (
    <div className={`${isDark ? 'bg-[#1a1f2c]' : 'bg-white'} rounded-xl shadow-lg p-8`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className={`h-8 w-8 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Help & Support
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Find answers and get assistance
          </p>
        </div>
      </div>

      {/* Help Topics */}
      <div className="mb-8">
        <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Popular Help Topics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {helpTopics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <div
                key={index}
                className={`
                  p-5 rounded-lg cursor-pointer transition-all border
                  ${isDark 
                    ? 'bg-[#0c111c] border-gray-700 hover:border-emerald-400' 
                    : 'bg-gray-50 border-gray-200 hover:border-emerald-400'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`h-6 w-6 mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                  <div>
                    <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {topic.title}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {topic.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Support */}
      <div className="mb-8">
        <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Contact Support
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contactOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div
                key={index}
                onClick={option.action}
                className={`
                  p-6 rounded-lg text-center transition-all border-2 cursor-pointer
                  ${isDark 
                    ? 'bg-[#0c111c] border-gray-700 hover:border-emerald-400' 
                    : 'bg-gray-50 border-gray-200 hover:border-emerald-400'
                  }
                `}
              >
                <Icon className={`h-8 w-8 mx-auto mb-3 ${option.color}`} />
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {option.label}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {option.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className={`
        p-6 rounded-lg border-2
        ${isDark 
          ? 'bg-[#0c111c] border-emerald-400/30' 
          : 'bg-emerald-50 border-emerald-200'
        }
      `}>
        <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <summary className="cursor-pointer font-medium">
              How do I upload a receipt?
            </summary>
            <p className={`mt-2 ml-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Click on the "New" button in the navigation bar, then either drag and drop your receipt image or click to browse your files.
            </p>
          </details>
          <details className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <summary className="cursor-pointer font-medium">
              How are expenses automatically categorized?
            </summary>
            <p className={`mt-2 ml-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              BudgetBee uses AI to extract data from your receipts and automatically assigns categories based on the items and merchant information.
            </p>
          </details>
          <details className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <summary className="cursor-pointer font-medium">
              Can I export my expense reports?
            </summary>
            <p className={`mt-2 ml-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Yes! Each summary page has a "Download PDF" button that generates a professional expense report.
            </p>
          </details>
        </div>
      </div>

      {/* Documentation Link */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/documentation')}
          className="
            inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
            bg-gradient-to-r from-emerald-500 to-emerald-600
            hover:from-emerald-600 hover:to-emerald-700
            text-white shadow-lg hover:shadow-xl
            transform hover:scale-105 transition-all duration-200
          "
        >
          View Full Documentation
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
