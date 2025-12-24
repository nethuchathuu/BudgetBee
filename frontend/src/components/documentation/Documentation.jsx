import React, { useState } from 'react';
import { ArrowLeft, Book, ChevronRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Documentation() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const categories = [
    { id: 'food', name: 'Food & Dining' },
    { id: 'transport', name: 'Transportation' },
    { id: 'utilities', name: 'Utilities' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'shopping', name: 'Shopping' },
    { id: 'education', name: 'Education' },
    { id: 'housing', name: 'Housing' },
    { id: 'insurance', name: 'Insurance' },
    { id: 'savings', name: 'Savings & Investments' },
    { id: 'personal-care', name: 'Personal Care' },
    { id: 'gifts', name: 'Gifts & Donations' },
    { id: 'travel', name: 'Travel' },
    { id: 'automotive', name: 'Automotive' },
    { id: 'pets', name: 'Pet Care' },
    { id: 'groceries', name: 'Groceries' },
    { id: 'restaurants', name: 'Restaurants & Cafes' },
    { id: 'sports', name: 'Sports & Fitness' },
    { id: 'subscriptions', name: 'Subscriptions' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing & Accessories' },
    { id: 'home-improvement', name: 'Home Improvement' },
    { id: 'childcare', name: 'Childcare' },
    { id: 'debt', name: 'Debt Payments' },
    { id: 'taxes', name: 'Taxes' },
    { id: 'business', name: 'Business Expenses' },
    { id: 'miscellaneous', name: 'Miscellaneous' },
    { id: 'uncategorized', name: 'Uncategorized' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0c111c] text-gray-300' : 'bg-white text-gray-800'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 border-b ${
        isDark ? 'bg-[#1a1f2c] border-emerald-400/20' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDark 
                ? 'text-emerald-400 hover:bg-emerald-400/10' 
                : 'text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          {/*<button
            onClick={() => navigate('/home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDark 
                ? 'text-gray-400 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>*/}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-10 px-6">
        {/* Title */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Book className={`w-12 h-12 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
            <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              BudgetBee — User Documentation
            </h1>
          </div>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Your complete guide to smart receipt recognition, budget tracking, and financial management.
          </p>
        </div>

        {/* Table of Contents */}
        <div className={`p-6 rounded-xl mb-12 border-2 ${
          isDark 
            ? 'bg-[#1a1f2c] border-emerald-400/30' 
            : 'bg-emerald-50 border-emerald-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { id: 'intro', title: 'Introduction' },
              { id: 'account', title: '1. Account Management' },
              { id: 'homepage', title: '2. Homepage Overview' },
              { id: 'upload', title: '3. Smart Upload System' },
              { id: 'diary', title: '4. Notes' },
              { id: 'notifications', title: '5. Notification System' },
              { id: 'settings', title: '6. Settings Overview' },
              { id: 'howto', title: '7. How to Use Application' },
              { id: 'categories', title: '8. Categories & Logic' },
              { id: 'faq', title: '9. FAQ' },
              { id: 'privacy', title: '10. Privacy & Security' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? isDark
                      ? 'bg-emerald-400/20 text-emerald-400'
                      : 'bg-emerald-200 text-emerald-700'
                    : isDark
                    ? 'hover:bg-emerald-400/10 text-gray-300'
                    : 'hover:bg-emerald-100 text-gray-700'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Introduction */}
        <section id="intro" className="mb-16">
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Introduction
          </h2>
          <div className="space-y-4">
            <p>
              <strong className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>BudgetBee</strong> is an intelligent expense tracking application that uses cutting-edge OCR (Optical Character Recognition) technology to automatically extract data from your receipts. Our platform helps you manage your finances efficiently with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Smart Receipt Recognition:</strong> Upload photos of receipts and let AI extract the details</li>
              <li><strong>Automatic Categorization:</strong> 28 predefined categories powered by NLP</li>
              <li><strong>Real-time Budget Tracking:</strong> Daily, weekly, monthly, and yearly summaries</li>
              <li><strong>Smart Notifications:</strong> Get alerts when you exceed spending limits</li>
              <li><strong>Visual Analytics:</strong> Beautiful charts and graphs to understand your spending patterns</li>
              <li><strong>Dark Mode Support:</strong> Choose between light and dark themes</li>
            </ul>
          </div>
        </section>

        {/* 1. Account Management */}
        <section id="account" className="mb-16">
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            1. Account Management
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Sign In
              </h3>
              <p className="mb-3">To access your BudgetBee account:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Navigate to the Sign In page</li>
                <li>Enter your registered email address</li>
                <li>Enter your password</li>
                <li>Click "Sign In" to access your dashboard</li>
              </ol>
              <p className={`mt-3 italic ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <strong>Prefer a faster login?</strong><br></br> You can also sign in using Google Login by clicking the “Sign in with Google” button on the sign-in page.
              </p>
              <p className={`mt-3 italic ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <strong>Forgot Password?</strong><br></br> Click the "Forgot Password" link on the sign-in page to reset your password via email.
              </p>
            </div>
            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Sign Up
              </h3>
              <p className="mb-3">Creating a new BudgetBee account is simple:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Click "Sign Up" on the landing page</li>
                <li>Enter your full name</li>
                <li>Provide a valid email address</li>
                <li>Create a strong password (minimum 8 characters)</li>
                <li>Confirm your password</li>
                <li>Click "Sign Up"</li>
                <li>Verify your email address (check your inbox)</li>
              </ol>
              <p className={`mt-3 italic ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <strong>Or choose a faster way:</strong><br></br> You can also register instantly using Google Sign-Up by clicking the “Sign up with Google” button on the Sign Up page.
              </p>
            </div>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Profile Management
              </h3>
              <p>Update your profile information at any time:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li><strong>Name:</strong> Change your display name</li>
                <li><strong>Email:</strong> Update your email address (requires verification)</li>
                <li><strong>Avatar:</strong> Upload a profile picture</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. Homepage Overview */}
        <section id="homepage" className="mb-16">
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            2. Homepage Overview
          </h2>
          
          <div className="space-y-6">
            <p>
              The BudgetBee homepage is your central dashboard for viewing and analyzing expenses. It provides comprehensive insights into your spending habits across different time periods.
            </p>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Dashboard Structure
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Navigation Bar:</strong> Quick access to Home, Upload, Diary, Notifications, and Settings</li>
                <li><strong>Summary Cards:</strong> Total spending, top category, and average calculations</li>
                <li><strong>Visual Charts:</strong> Pie charts and bar graphs showing category breakdown</li>
                <li><strong>Expense Cards:</strong> Detailed cards showing spending by category with product lists</li>
                <li><strong>Calendar Navigation:</strong> Select specific dates, weeks, months or years to view historical data</li>
              </ul>
            </div>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Summary Views
              </h3>
              <div className="space-y-3">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-[#1a1f2c]' : 'bg-gray-50'}`}>
                  <h4 className="font-semibold mb-2">📅 Daily Summary</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    View today’s expenses or select any date using the calendar. See the total spent, the highest expense category, and all category-wise expenses.
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-[#1a1f2c]' : 'bg-gray-50'}`}>
                  <h4 className="font-semibold mb-2">📊 Weekly Summary</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Current week's spending (Sunday to Saturday). Includes total spent, daily average, top spending day, and top category of the week.
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-[#1a1f2c]' : 'bg-gray-50'}`}>
                  <h4 className="font-semibold mb-2">📈 Monthly Summary</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Current month's expenses, including total spent, highest-expense week and date, weekly and daily averages, and the top category of the month. Helps track budget progress.
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-[#1a1f2c]' : 'bg-gray-50'}`}>
                  <h4 className="font-semibold mb-2">🎯 Yearly Summary</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Annual overview with total spent, highest-expense month, week, and date; monthly, weekly, and daily averages; and the top category of the year. Perfect for long-term financial planning.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Default Dashboard Behavior
              </h3>
              <p>
                Your homepage loads the default view you set in Settings → Default Dashboard. This can be Today, Weekly, Monthly, or Yearly. Change this anytime to match your preferred tracking period.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Smart Upload System */}
        <section id="upload" className="mb-16">
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            3. Smart Upload System
          </h2>
          
          <div className="space-y-6">
            <p>
              BudgetBee's intelligent upload system uses Tesseract OCR technology to automatically extract data from your receipt images, saving you time and ensuring accuracy.
            </p>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                How to Upload a Receipt
              </h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Click the "New" button in the navigation bar</li>
                <li>Choose your upload method:
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li><strong>Camera:</strong> Take a photo of your receipt directly</li>
                    <li><strong>File Upload:</strong> Select an image file from your device</li>
                    <li><strong>Drag & Drop:</strong> Drag receipt images into the upload area</li>
                  </ul>
                </li>
                <li>Wait for automatic OCR extraction (usually 2-5 seconds)</li>
                <li>Review and edit the extracted data if needed</li>
                <li>Verify categories assigned to each item</li>
                <li>Click "Save" to add expenses to your diary</li>
              </ol>
            </div>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Features
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Automatic OCR Extraction:</strong> Reads merchant name, date, items, prices, and total</li>
                <li><strong>Manual Editing:</strong> Correct any misread information before saving</li>
                <li><strong>Item-level Categorization:</strong> Each product is assigned the most relevant category</li>
                <li><strong>Image Preview:</strong> View the original receipt alongside extracted data</li>
                <li><strong>Add/Delete Rows:</strong> Easily insert new item rows or remove unnecessary ones for accurate record keeping</li>
              </ul>
            </div>

            <div className={`p-4 rounded-lg border-l-4 ${
              isDark 
                ? 'bg-yellow-900/20 border-yellow-500 text-yellow-400' 
                : 'bg-yellow-50 border-yellow-500 text-yellow-800'
            }`}>
              <p className="font-semibold mb-2">💡 Tips for Best Results:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Ensure good lighting when taking photos</li>
                <li>Keep receipt flat and fully visible in frame</li>
                <li>Avoid shadows and glare</li>
                <li>Use high-resolution images for better accuracy</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Notes */}
        <section id="diary" className="mb-16">
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            4. Notes
          </h2>
          
          <div className="space-y-6">
            <p>
              The Diary Session works just like a real-world personal diary, allowing users to record meaningful moments and important notes for each day. It provides a simple and intuitive space to write daily reflections, reminders, and anything you want to remember.
              <br></br>
              Users can also select their mood for the day, helping them track emotional patterns over time and understand how their daily experiences influence their well-being. This feature is especially useful for keeping personal notes, documenting progress, and maintaining a consistent daily journaling habit.
            </p>

          </div>
        </section>

        {/* 5. Notification System */}
        <section id="notifications" className="mb-16">
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            5. Notification System
          </h2>
          
          <div className="space-y-6">
            <p>
              BudgetBee's smart notification system alerts you when you exceed spending limits, helping you stay within budget and maintain financial discipline.
            </p>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Notification Types
              </h3>
              <div className="space-y-3">
                <div className={`p-4 rounded-lg border-l-4 ${isDark ? 'bg-[#1a1f2c] border-blue-400' : 'bg-blue-50 border-blue-500'}`}>
                  <h4 className="font-semibold mb-2">📅 Daily Limit Exceeded</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Triggered when today's spending exceeds your daily limit
                  </p>
                </div>
                <div className={`p-4 rounded-lg border-l-4 ${isDark ? 'bg-[#1a1f2c] border-purple-400' : 'bg-purple-50 border-purple-500'}`}>
                  <h4 className="font-semibold mb-2">📊 Weekly Limit Exceeded</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Sent when current week's expenses surpass weekly limit
                  </p>
                </div>
                <div className={`p-4 rounded-lg border-l-4 ${isDark ? 'bg-[#1a1f2c] border-orange-400' : 'bg-orange-50 border-orange-500'}`}>
                  <h4 className="font-semibold mb-2">📈 Monthly Limit Exceeded</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Alerts when monthly spending crosses the threshold
                  </p>
                </div>
                <div className={`p-4 rounded-lg border-l-4 ${isDark ? 'bg-[#1a1f2c] border-red-400' : 'bg-red-50 border-red-500'}`}>
                  <h4 className="font-semibold mb-2">🎯 Yearly Limit Exceeded</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Notifies when annual expenses exceed yearly limit
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Notification Badge
              </h3>
              <p>
                A red badge appears on the bell icon in the navigation bar showing your unread notification count. The badge displays "99+" for counts exceeding 99.
              </p>
            </div>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Managing Notifications
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Mark as Read:</strong> Click the checkmark icon to mark individual notifications as read</li>
                <li><strong>Mark All as Read:</strong> Use the "Mark All as Read" button to clear all unread notifications</li>
                <li><strong>Delete:</strong> Remove notifications using the trash icon</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Settings Overview */}
        <section id="settings" className="mb-16">
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            6. Settings Overview
          </h2>
          
          <div className="space-y-6">
            <p>
              Customize your BudgetBee experience through the Settings panel. Access it by clicking the gear icon in the navigation bar.
            </p>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Appearance
              </h3>
              <p className="mb-3">Choose between light and dark themes to match your preference:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Light Mode:</strong> Clean, bright interface ideal for daytime use</li>
                <li><strong>Dark Mode:</strong> Easy on the eyes, perfect for night-time viewing</li>
                <li><strong>Persistence:</strong> Your theme choice is saved to the database and local storage</li>
                <li><strong>Instant Apply:</strong> Theme changes take effect immediately across all pages</li>
              </ul>
            </div>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Default Dashboard
              </h3>
              <p className="mb-3">Set which summary loads when you visit the homepage:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Today:</strong> Shows current day's expenses (default)</li>
                <li><strong>Weekly:</strong> Displays current week's summary</li>
                <li><strong>Monthly:</strong> Shows current month's overview</li>
                <li><strong>Yearly:</strong> Presents annual spending summary</li>
              </ul>
              <p className="mt-3 italic">Effect: When you click "Home" in the navigation, the selected summary view loads automatically.</p>
            </div>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Notification Limits
              </h3>
              <p className="mb-3">Configure spending thresholds for each time period:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Daily Limit:</strong> Maximum amount you want to spend per day</li>
                <li><strong>Weekly Limit:</strong> Budget cap for the week</li>
                <li><strong>Monthly Limit:</strong> Total monthly spending limit</li>
                <li><strong>Yearly Limit:</strong> Annual budget threshold</li>
              </ul>
              <p className="mt-3">
                <strong>Behavior:</strong> When your actual spending exceeds any limit, a notification is created immediately. You can set limits to 0 to disable specific notifications.
              </p>
            </div>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Reset All Data
              </h3>
              <div className={`p-4 rounded-lg border-l-4 ${
                isDark 
                  ? 'bg-red-900/20 border-red-500 text-red-400' 
                  : 'bg-red-50 border-red-500 text-red-800'
              }`}>
                <p className="font-semibold mb-2">⚠️ Warning: This action is irreversible!</p>
                <p className="mb-3">Resetting your data will permanently delete:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>All uploaded receipts and expenses</li>
                  <li>All notification history</li>
                  <li>Custom settings and preferences</li>
                  <li>Summary data for all time periods</li>
                </ul>
                <p className="mt-3 font-semibold">
                  Steps: Click "Reset All Data" → Enter your password → Confirm deletion
                </p>
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Help and Support
              </h3>
              <p>Access this documentation, FAQs, and contact options for assistance when needed.</p>
            </div>
          </div>
        </section>

        {/* 7. How to Use Application */}
        <section id="howto" className="mb-16">
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            7. How to Use the Application
          </h2>
          
          <div className="space-y-6">
            <p className="text-lg">
              Follow this step-by-step guide to get started with BudgetBee:
            </p>

            <div className="space-y-4">
              {[
                { 
                  num: '1', 
                  title: 'Sign In or Create an Account',
                  desc: 'Visit BudgetBee and either sign in with existing credentials or create a new account with your email and password.'
                },
                { 
                  num: '2', 
                  title: 'Upload Your First Receipt',
                  desc: 'Click "New" in the navbar, take a photo or upload an image of a receipt. The OCR system will automatically extract all data.'
                },
                { 
                  num: '3', 
                  title: 'Review Auto-Categorized Items',
                  desc: 'Check the extracted items and their assigned categories. Edit any incorrect information before saving.'
                },
                { 
                  num: '4', 
                  title: 'Set Your Limits in Settings',
                  desc: 'Go to Settings → Notification Limits and configure your daily, weekly, monthly, and yearly spending caps.'
                },
                { 
                  num: '5', 
                  title: 'Track Spending Daily/Weekly/Monthly/Yearly',
                  desc: 'Switch between time periods on the homepage to analyze spending patterns over different durations.'
                },
                { 
                  num: '6', 
                  title: 'Read and Manage Notifications',
                  desc: 'Click the bell icon to view limit alerts. Mark as read or delete notifications to keep your inbox organized.'
                },
                { 
                  num: '7', 
                  title: 'Explore Insights Through Charts',
                  desc: 'Use pie charts and bar graphs to identify top spending categories and optimize your budget.'
                },
                { 
                  num: '8', 
                  title: 'Download Spending Summary',
                  desc: 'Download summary reports to easily view your spending insights. Export summary reports for budgeting, tracking progress, or keeping records offline.'
                },
                { 
                  num: '9', 
                  title: 'Add Notes',
                  desc: 'Use the Notes feature to jot down important details or thoughts for the day, just like a diary. Add reminders, reflections, or anything worth remembering to stay organized.'
                }
              ].map((step) => (
                <div key={step.num} className={`p-5 rounded-lg border-l-4 ${
                  isDark 
                    ? 'bg-[#1a1f2c] border-emerald-400' 
                    : 'bg-emerald-50 border-emerald-500'
                }`}>
                  <div className="flex gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      isDark ? 'bg-emerald-400 text-gray-900' : 'bg-emerald-500 text-white'
                    }`}>
                      {step.num}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{step.title}</h4>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Categories and Categorization Logic */}
        <section id="categories" className="mb-16">
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            8. Categories & Categorization Logic
          </h2>
          
          <div className="space-y-6">
            <p>
              BudgetBee uses an advanced NLP (Natural Language Processing) model to automatically categorize expense items into 28 predefined categories. This ensures consistent tracking and accurate analytics.
            </p>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                All 28 Categories
              </h3>
              <div className={`overflow-x-auto rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <table className="w-full">
                  <thead className={isDark ? 'bg-[#1a1f2c]' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-4 py-3 text-left font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Category</th>
                      <th className={`px-4 py-3 text-left font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Examples</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {[
                      { cat: 'Food & Dining', ex: 'Pizza, burger, restaurant meals' },
                      { cat: 'Groceries', ex: 'Milk, bread, vegetables, meat' },
                      { cat: 'Transportation', ex: 'Gas, bus fare, taxi, parking' },
                      { cat: 'Utilities', ex: 'Electricity, water, internet, phone bills' },
                      { cat: 'Healthcare', ex: 'Medicine, doctor visits, prescriptions' },
                      { cat: 'Entertainment', ex: 'Movies, concerts, games, streaming' },
                      { cat: 'Shopping', ex: 'General retail purchases' },
                      { cat: 'Education', ex: 'Books, courses, tuition, supplies' },
                      { cat: 'Housing', ex: 'Rent, mortgage, maintenance' },
                      { cat: 'Insurance', ex: 'Health, auto, home insurance' },
                      { cat: 'Savings & Investments', ex: 'Deposits, stocks, mutual funds' },
                      { cat: 'Personal Care', ex: 'Haircut, spa, cosmetics' },
                      { cat: 'Gifts & Donations', ex: 'Presents, charity, contributions' },
                      { cat: 'Travel', ex: 'Hotels, flights, vacation expenses' },
                      { cat: 'Automotive', ex: 'Car repairs, maintenance, parts' },
                      { cat: 'Pet Care', ex: 'Pet food, vet, grooming' },
                      { cat: 'Restaurants & Cafes', ex: 'Coffee shops, dining out' },
                      { cat: 'Sports & Fitness', ex: 'Gym, equipment, sports gear' },
                      { cat: 'Subscriptions', ex: 'Netflix, Spotify, magazines' },
                      { cat: 'Electronics', ex: 'Phones, laptops, gadgets' },
                      { cat: 'Clothing & Accessories', ex: 'Clothes, shoes, jewelry' },
                      { cat: 'Home Improvement', ex: 'Furniture, paint, tools' },
                      { cat: 'Childcare', ex: 'Daycare, babysitting, diapers' },
                      { cat: 'Debt Payments', ex: 'Loan repayments, credit cards' },
                      { cat: 'Taxes', ex: 'Income tax, property tax' },
                      { cat: 'Business Expenses', ex: 'Office supplies, professional services' },
                      { cat: 'Miscellaneous', ex: 'Items that don\'t fit other categories' },
                      { cat: 'Uncategorized', ex: 'Items pending categorization' }
                    ].map((row, idx) => (
                      <tr key={idx} className={isDark ? 'hover:bg-[#1a1f2c]' : 'hover:bg-gray-50'}>
                        <td className={`px-4 py-3 font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          {row.cat}
                        </td>
                        <td className={`px-4 py-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {row.ex}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Categorization Rules
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>NLP Analysis:</strong> The system analyzes item names and descriptions using natural language processing</li>
                <li><strong>Merchant Context:</strong> Store names provide additional context (e.g., "Target" → likely Shopping/Groceries)</li>
                <li><strong>Keyword Matching:</strong> Specific keywords trigger category assignments</li>
                <li><strong>Confidence Scoring:</strong> High-confidence matches are auto-assigned; low-confidence items default to Uncategorized</li>
              </ul>
            </div>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Manual Override
              </h3>
              <p>If the automatic categorization is incorrect, you can:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4 mt-3">
                <li>Edit the receipt after upload</li>
                <li>Change the category dropdown for any item</li>
                <li>Save changes to update the expense</li>
              </ol>
            </div>
          </div>
        </section>

        {/* 9. FAQ */}
        <section id="faq" className="mb-16">
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            9. Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: 'Why is a receipt not reading correctly?',
                a: 'Poor image quality, glare, shadows, or blurry text can affect OCR accuracy. Ensure good lighting, keep the receipt flat, and use high-resolution images. You can always manually edit extracted data before saving.'
              },
              {
                q: 'How do I change my default dashboard?',
                a: 'Go to Settings → Default Dashboard, select your preferred view (Today, Weekly, Monthly, or Yearly), and click Save. The homepage will now load this view by default.'
              },
              {
                q: 'Why am I not receiving notifications?',
                a: 'Check if you\'ve set spending limits in Settings → Notification Limits. If limits are set to 0, notifications won\'t trigger. Also, notifications only appear when you exceed the limit, not before.'
              },
              {
                q: 'What should I do if charts show empty data?',
                a: 'This means no expenses have been recorded for the selected time period. Upload receipts to populate the charts. If you recently uploaded expenses, try refreshing the page.'
              },
              {
                q: 'Is my data secure?',
                a: 'Yes! All data is encrypted in transit (HTTPS) and stored securely in our database. We never share your financial information with third parties.'
              },
              {
                q: 'Can I use BudgetBee on mobile?',
                a: 'Yes! BudgetBee is fully responsive and works on all devices. The mobile interface is optimized for touch navigation and camera uploads.'
              }
            ].map((faq, idx) => (
              <details 
                key={idx}
                className={`p-5 rounded-lg border ${
                  isDark 
                    ? 'bg-[#1a1f2c] border-gray-700' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <summary className={`cursor-pointer font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {faq.q}
                </summary>
                <p className={`mt-3 ml-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* 10. Privacy & Security */}
        <section id="privacy" className="mb-16">
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            10. Privacy & Security
          </h2>
          
          <div className="space-y-6">
            <p>
              Your privacy and data security are our top priorities. BudgetBee implements industry-standard security measures to protect your financial information.
            </p>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Data Storage
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Encrypted Database:</strong> All expense data is stored in a secure MySQL database with encryption</li>
                <li><strong>Password Protection:</strong> Passwords are hashed using bcrypt before storage</li>
                <li><strong>HTTPS:</strong> All data transmission uses SSL/TLS encryption</li>
                <li><strong>Local Storage:</strong> Some preferences (theme, default dashboard) are cached locally for performance</li>
              </ul>
            </div>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Receipt and Image Handling
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Receipt images are processed using Tesseract OCR on our servers</li>
                <li>Original images are stored securely and accessible only to your account</li>
                <li>Images are never shared with third parties</li>
                <li>You can delete any receipt image at any time</li>
              </ul>
            </div>

            <div>
              <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Deleting Data
              </h3>
              <p className="mb-3">To remove all your data:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Go to Settings → Reset All Data</li>
                <li>Enter your password for verification</li>
                <li>Confirm deletion</li>
                <li>All expenses, receipts, notifications, and settings will be permanently deleted</li>
              </ol>
              
            </div>

            <div className={`p-5 rounded-lg border-l-4 ${
              isDark 
                ? 'bg-emerald-900/20 border-emerald-400' 
                : 'bg-emerald-50 border-emerald-500'
            }`}>
              <p className="font-semibold mb-2">🔒 Your Data Rights:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access: View all your stored data anytime</li>
                <li>Rectification: Edit or correct any information</li>
                <li>Erasure: Delete individual expenses or all data</li>
                <li>Portability: Export your data (PDF reports available)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className={`text-center py-8 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Need more help? Contact us at{' '}
            <a 
              href="mailto:supportbudgetbee@gmail.com"
              className={`font-semibold ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}
            >
              budgetbeefyp@gmail.com

            </a>
          </p>
          <p className={`mt-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Last updated: November 22, 2025 | BudgetBee v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
