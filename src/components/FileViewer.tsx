import React from 'react';
import { Icon } from '@iconify/react';
import { X, Download, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { fileIconMap } from '../utils/iconMap';

interface FileViewerProps {
  fileName: string;
  content: string;
  onClose: () => void;
  downloadUrl?: string;
  htmlUrl?: string;
  isVisible: boolean;
}

const FileViewer: React.FC<FileViewerProps> = ({ 
  fileName, 
  content, 
  onClose, 
  downloadUrl,
  htmlUrl,
  isVisible 
}) => {
  const getFileType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'svg':
        return 'image';
      case 'pdf':
        return 'pdf';
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
      case 'json':
      case 'md':
      case 'txt':
      case 'html':
      case 'css':
      case 'scss':
      case 'yml':
      case 'yaml':
        return 'text';
      default:
        return 'binary';
    }
  };

  const getFileIcon = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return fileIconMap[ext] || 'solar:file-bold';
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;
    
    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const getRawUrl = (url: string | undefined): string => {
    if (!url) return '';
    return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob', '');
  };

  const fileType = getFileType(fileName);

  React.useEffect(() => {
    if (fileType === 'binary') {
      handleDownload();
      onClose();
    }
  }, [fileType]);

  if (fileType === 'binary') {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center font-lexend"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-[#1E1E1E] rounded-lg shadow-xl w-11/12 max-w-5xl max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <div className="flex items-center space-x-3">
                <Icon 
                  icon={getFileIcon(fileName)}
                  className="w-5 h-5 text-white"
                />
                <span className="text-gray-200 font-medium">{fileName.split('/').pop()}</span>
                {fileName.includes('/') && (
                  <span className="text-gray-500">
                    • {fileName.split('/').slice(0, -1).join('/')}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {htmlUrl && (
                  <a
                    href={getRawUrl(htmlUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors duration-200"
                    title="View raw"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Raw</span>
                  </a>
                )}
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors duration-200"
                  title="Download file"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-auto p-6"
            >
              {fileType === 'image' ? (
                <div className="flex items-center justify-center h-full">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    src={downloadUrl}
                    alt={fileName}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  />
                </div>
              ) : fileType === 'pdf' ? (
                <motion.iframe
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  src={downloadUrl}
                  className="w-full h-full min-h-[70vh] rounded-lg"
                  title={fileName}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono"
                >
                  <SyntaxHighlighter
                    language={getLanguage(fileName)}
                    style={atomOneDark}
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.5rem',
                      background: '#121212',
                      fontFamily: '"Cascadia Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                      fontSize: '14px',
                      lineHeight: '1.6'
                    }}
                    showLineNumbers
                  >
                    {content}
                  </SyntaxHighlighter>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const getLanguage = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    rb: 'ruby',
    java: 'java',
    cpp: 'cpp',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    php: 'php',
    html: 'html',
    css: 'css',
    scss: 'scss',
    json: 'json',
    yml: 'yaml',
    yaml: 'yaml',
    md: 'markdown',
    sql: 'sql',
  };
  return languageMap[ext] || 'plaintext';
};

export default FileViewer;