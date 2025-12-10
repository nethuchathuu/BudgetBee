import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import NavHome from '../NavHome';
import DiaryPage from './DiaryPage';
import DiaryNavigation from './DiaryNavigation';
import './diary.css';
import { Save, Check, AlertCircle } from 'lucide-react';

export default function DiaryBook() {
  const { isDark } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [leftPageDate, setLeftPageDate] = useState('');
  const [leftPageContent, setLeftPageContent] = useState('');
  const [leftPageMood, setLeftPageMood] = useState('');
  const [rightPageContent, setRightPageContent] = useState('');
  const [rightPageMood, setRightPageMood] = useState('😊');
  const [saveStatus, setSaveStatus] = useState('saved'); // saved, saving, error
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);

  // Calculate dates
  useEffect(() => {
    const current = new Date(currentDate);
    const yesterday = new Date(current);
    yesterday.setDate(yesterday.getDate() - 1);
    setLeftPageDate(yesterday.toISOString().split('T')[0]);
  }, [currentDate]);

  // Fetch diary entries when dates change
  useEffect(() => {
    fetchDiaryEntries();
  }, [currentDate, leftPageDate]);

  const fetchDiaryEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.show('Please sign in to access your diary', 'error');
        navigate('/signin');
        return;
      }

      // Fetch left page (yesterday)
      if (leftPageDate) {
        const leftResponse = await axios.get(
          `http://localhost:5000/api/diary/${leftPageDate}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (leftResponse.data.success && leftResponse.data.data) {
          setLeftPageContent(leftResponse.data.data.content || '');
          setLeftPageMood(leftResponse.data.data.mood || '');
        } else {
          setLeftPageContent('');
          setLeftPageMood('');
        }
      }

      // Fetch right page (current day)
      const rightResponse = await axios.get(
        `http://localhost:5000/api/diary/${currentDate}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (rightResponse.data.success && rightResponse.data.data) {
        setRightPageContent(rightResponse.data.data.content || '');
        setRightPageMood(rightResponse.data.data.mood || '😊');
      } else {
        setRightPageContent('');
        setRightPageMood('😊');
      }
    } catch (error) {
      console.error('Error fetching diary entries:', error);
      if (error.response?.status === 401) {
        toast.show('Session expired. Please sign in again.', 'error');
        navigate('/signin');
      }
    }
  };

  const saveDiaryEntry = async (date, content, mood) => {
    try {
      setSaveStatus('saving');
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5000/api/diary',
        {
          date,
          content,
          mood
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Error saving diary entry:', error);
      setSaveStatus('error');
      toast.show('Failed to save diary entry', 'error');
    }
  };

  const handleRightPageChange = (newContent) => {
    setRightPageContent(newContent);
    
    // Clear previous timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    // Set new auto-save timeout (2 seconds after user stops typing)
    const timeout = setTimeout(() => {
      saveDiaryEntry(currentDate, newContent, rightPageMood);
    }, 2000);

    setAutoSaveTimeout(timeout);
  };

  const handleMoodChange = (newMood) => {
    setRightPageMood(newMood);
    saveDiaryEntry(currentDate, rightPageContent, newMood);
  };

  const handlePreviousDay = () => {
    const current = new Date(currentDate);
    current.setDate(current.getDate() - 1);
    setCurrentDate(current.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const current = new Date(currentDate);
    const today = new Date().toISOString().split('T')[0];
    
    if (currentDate < today) {
      current.setDate(current.getDate() + 1);
      setCurrentDate(current.toISOString().split('T')[0]);
    }
  };

  const canGoNext = () => {
    const today = new Date().toISOString().split('T')[0];
    return currentDate < today;
  };

  return (
    <>
      <NavHome />
      <div className={`min-h-screen pt-20 ${isDark ? 'bg-[#0c111c]' : 'bg-gray-50'} py-8 px-4`}>
        <div className="diary-book">
          <div className="book-container">
            <DiaryNavigation
              currentDate={currentDate}
              onPreviousDay={handlePreviousDay}
              onNextDay={handleNextDay}
              canGoNext={canGoNext()}
              isDark={isDark}
              saveStatus={saveStatus}
            />

            <div className="diary-pages">
              {/* Left Page - Yesterday (Read-only) */}
              <DiaryPage
                date={leftPageDate}
                content={leftPageContent}
                mood={leftPageMood}
                isEditable={false}
                isLeftPage={true}
                isDark={isDark}
              />

              {/* Book Spine */}
              <div className="book-spine"></div>

              {/* Right Page - Current Day (Editable) */}
              <DiaryPage
                date={currentDate}
                content={rightPageContent}
                mood={rightPageMood}
                isEditable={true}
                isLeftPage={false}
                onChange={handleRightPageChange}
                onMoodChange={handleMoodChange}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className={`mt-6 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>Left page shows yesterday's entry • Right page is today's entry (editable)</p>
            <p className="mt-1">Your entries are automatically saved as you type</p>
          </div>
        </div>
      </div>
    </>
  );
}
