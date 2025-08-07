import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationSystem = ({ notifications, onDismiss }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      maxWidth: '400px'
    }}>
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 500, damping: 30 }}
            style={{
              background: notification.type === 'success' 
                ? 'linear-gradient(135deg, #11998e, #38ef7d)'
                : notification.type === 'error'
                ? 'linear-gradient(135deg, #ff416c, #ff4b2b)'
                : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              padding: '15px 20px',
              borderRadius: '12px',
              marginBottom: '10px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
            onClick={() => onDismiss(notification.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '20px' }}>
                {notification.type === 'success' ? '✅' : 
                 notification.type === 'error' ? '❌' : 'ℹ️'}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {notification.title}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>
                  {notification.message}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: '18px', opacity: 0.7 }}>
                ×
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;
