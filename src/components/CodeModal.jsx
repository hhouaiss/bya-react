import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  DocumentDuplicateIcon,
  CheckIcon,
  CodeBracketIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

/**
 * CodeModal component - Display and manage app source code
 * Mobile-first design with syntax highlighting
 */
function CodeModal({ isOpen, onClose, code, appName }) {
  const [copied, setCopied] = useState(false);

  /**
   * Copy code to clipboard
   */
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  /**
   * Download code as HTML file
   */
  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Simple syntax highlighting for HTML
   */
  const highlightCode = (code) => {
    return code
      .replace(/(&lt;\/?[^&gt;]+&gt;)/g, '<span class="text-blue-400">$1</span>')
      .replace(/(\b(?:function|const|let|var|if|else|for|while|return)\b)/g, '<span class="text-purple-400">$1</span>')
      .replace(/(\b\d+\b)/g, '<span class="text-green-400">$1</span>')
      .replace(/(["\'])((?:\\.|(?!\1)[^\\])*)\1/g, '<span class="text-yellow-400">$1$2$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>');
  };

  // Escape HTML for display
  const escapedCode = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-notion-card border border-notion-border rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-notion-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-notion-accent/20 rounded-lg flex items-center justify-center">
                  <CodeBracketIcon className="w-4 h-4 text-notion-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-notion-text">Source Code</h3>
                  <p className="text-notion-muted text-sm">{appName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Download Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadCode}
                  className="p-2 rounded-lg hover:bg-notion-bg transition-colors duration-200 text-notion-muted hover:text-notion-text"
                  title="Download HTML file"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                </motion.button>
                
                {/* Copy Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyCode}
                  className={`
                    p-2 rounded-lg transition-all duration-200
                    ${copied 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'hover:bg-notion-bg text-notion-muted hover:text-notion-text'
                    }
                  `}
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <DocumentDuplicateIcon className="w-5 h-5" />
                  )}
                </motion.button>
                
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-notion-bg transition-colors duration-200 text-notion-muted hover:text-notion-text"
                >
                  <XMarkIcon className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-auto">
                <pre className="p-6 text-sm leading-relaxed font-mono">
                  <code 
                    className="text-notion-text"
                    dangerouslySetInnerHTML={{ __html: highlightCode(escapedCode) }}
                  />
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-notion-border p-4">
              <div className="flex items-center justify-between text-xs text-notion-muted">
                <span>Ready to use HTML file</span>
                <div className="flex items-center gap-4">
                  <span>{code.split('\n').length} lines</span>
                  <span>{(new Blob([code]).size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CodeModal;