'use client';

import React, { useState, useEffect } from 'react';
import { STORAGE_KEYS, TIME_BLOCK_CATEGORIES } from '@/constants';
import styles from './TimePlanner.module.css';

interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}

interface TimePlannerProps {
  onClose: () => void;
}

const TimePlanner: React.FC<TimePlannerProps> = ({ onClose }) => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newBlock, setNewBlock] = useState({
    title: '',
    startTime: '',
    endTime: '',
    category: 'work',
    description: ''
  });

  const categories = TIME_BLOCK_CATEGORIES;

  // Load blocks from localStorage
  useEffect(() => {
    const savedBlocks = localStorage.getItem(STORAGE_KEYS.TIME_PLANNER_BLOCKS);
    if (savedBlocks) {
      try {
        const parsed = JSON.parse(savedBlocks);
        setTimeBlocks(parsed.map((block: any) => ({
          ...block,
          createdAt: new Date(block.createdAt)
        })));
      } catch (error) {
        console.error('Error loading time blocks:', error);
      }
    }
  }, []);

  // Save blocks to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIME_PLANNER_BLOCKS, JSON.stringify(timeBlocks));
  }, [timeBlocks]);

  const addTimeBlock = () => {
    if (!newBlock.title.trim() || !newBlock.startTime || !newBlock.endTime) return;

    const block: TimeBlock = {
      id: Date.now().toString(),
      title: newBlock.title.trim(),
      startTime: newBlock.startTime,
      endTime: newBlock.endTime,
      category: newBlock.category,
      description: newBlock.description.trim(),
      completed: false,
      createdAt: new Date()
    };

    setTimeBlocks(prev => [...prev, block].sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    ));

    setNewBlock({
      title: '',
      startTime: '',
      endTime: '',
      category: 'work',
      description: ''
    });
    setIsAddingBlock(false);
  };

  const toggleBlockCompletion = (id: string) => {
    setTimeBlocks(prev => 
      prev.map(block => 
        block.id === id ? { ...block, completed: !block.completed } : block
      )
    );
  };

  const deleteBlock = (id: string) => {
    setTimeBlocks(prev => prev.filter(block => block.id !== id));
  };

  const getCurrentTimeBlocks = () => {
    return timeBlocks.filter(block => {
      const blockDate = new Date(block.createdAt).toISOString().split('T')[0];
      return blockDate === selectedDate;
    });
  };

  const formatTime = (time: string) => {
    const date = new Date(`2000-01-01T${time}`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue) || categories[0];
  };

  const getTimeProgress = () => {
    const currentBlocks = getCurrentTimeBlocks();
    const completedCount = currentBlocks.filter(block => block.completed).length;
    return {
      completed: completedCount,
      total: currentBlocks.length,
      percentage: currentBlocks.length > 0 ? Math.round((completedCount / currentBlocks.length) * 100) : 0
    };
  };

  const progress = getTimeProgress();
  const currentBlocks = getCurrentTimeBlocks();

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.icon}>⏰</span>
            Time Planner
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.controls}>
            <div className={styles.dateSection}>
              <label htmlFor="date-selector" className={styles.label}>
                Select Date:
              </label>
              <input
                id="date-selector"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{progress.completed}</span>
                <span className={styles.statLabel}>Completed</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{progress.total - progress.completed}</span>
                <span className={styles.statLabel}>Remaining</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{progress.percentage}%</span>
                <span className={styles.statLabel}>Progress</span>
              </div>
            </div>

            <button
              onClick={() => setIsAddingBlock(true)}
              className={styles.addButton}
            >
              <span>+</span>
              Add Time Block
            </button>
          </div>

          {isAddingBlock && (
            <div className={styles.addForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Title *</label>
                  <input
                    type="text"
                    value={newBlock.title}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Team Meeting"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <select
                    value={newBlock.category}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, category: e.target.value }))}
                    className={styles.select}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Start Time *</label>
                  <input
                    type="time"
                    value={newBlock.startTime}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, startTime: e.target.value }))}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>End Time *</label>
                  <input
                    type="time"
                    value={newBlock.endTime}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, endTime: e.target.value }))}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description (Optional)</label>
                <textarea
                  value={newBlock.description}
                  onChange={(e) => setNewBlock(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Additional details..."
                  className={styles.textarea}
                  rows={2}
                />
              </div>

              <div className={styles.formActions}>
                <button
                  onClick={() => setIsAddingBlock(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={addTimeBlock}
                  className={styles.saveButton}
                  disabled={!newBlock.title.trim() || !newBlock.startTime || !newBlock.endTime}
                >
                  Add Block
                </button>
              </div>
            </div>
          )}

          <div className={styles.blocksSection}>
            <h3 className={styles.sectionTitle}>
              Schedule for {new Date(selectedDate).toLocaleDateString()}
            </h3>

            {currentBlocks.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📅</div>
                <p className={styles.emptyText}>
                  No time blocks scheduled for this date. Add your first block above!
                </p>
              </div>
            ) : (
              <div className={styles.blocksList}>
                {currentBlocks.map(block => {
                  const categoryInfo = getCategoryInfo(block.category);
                  return (
                    <div 
                      key={block.id} 
                      className={`${styles.timeBlock} ${block.completed ? styles.completed : ''}`}
                      style={{ '--category-color': categoryInfo.color } as React.CSSProperties}
                    >
                      <div className={styles.blockTime}>
                        <span className={styles.timeRange}>
                          {formatTime(block.startTime)} - {formatTime(block.endTime)}
                        </span>
                        <div className={styles.categoryBadge}>
                          <span className={styles.categoryIcon}>{categoryInfo.icon}</span>
                          <span className={styles.categoryName}>{categoryInfo.label}</span>
                        </div>
                      </div>
                      
                      <div className={styles.blockContent}>
                        <div className={styles.blockHeader}>
                          <h4 className={styles.blockTitle}>{block.title}</h4>
                          <div className={styles.blockActions}>
                            <button
                              onClick={() => toggleBlockCompletion(block.id)}
                              className={styles.completeButton}
                              title={block.completed ? 'Mark as incomplete' : 'Mark as complete'}
                            >
                              {block.completed ? '✓' : '○'}
                            </button>
                            <button
                              onClick={() => deleteBlock(block.id)}
                              className={styles.deleteButton}
                              title="Delete block"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        
                        {block.description && (
                          <p className={styles.blockDescription}>{block.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimePlanner;
