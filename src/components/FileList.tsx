import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileItem } from '../types';
import { formatFileSize, formatDate } from '../utils/format';
import { fileIconMap } from '../utils/iconMap';

interface FileListProps {
  files: FileItem[];
  currentPath: string;
  onFileSelect: (file: FileItem) => void;
  isLoading: boolean;
}

const FileList: React.FC<FileListProps> = ({ files, currentPath, onFileSelect, isLoading }) => {
  const navigate = useNavigate();
  const showParentDir = currentPath !== '/';

  const sortedFiles = [...files].sort((a, b) => {
    if (a.type === 'folder' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name);
  });

  const handleClick = (item: FileItem | 'parent') => {
    if (item === 'parent') {
      const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
      navigate(`/files${parentPath}`);
      return;
    }

    if (item.type === 'folder') {
      const newPath = `${currentPath}/${item.name}`.replace(/\/+/g, '/');
      navigate(`/files${newPath}`);
    } else {
      onFileSelect(item);
    }
  };

  const getFileIcon = (item: FileItem): string => {
    if (item.type === 'folder') {
      return 'solar:folder-bold';
    }
    const ext = item.name.split('.').pop()?.toLowerCase() || '';
    return fileIconMap[ext] || 'solar:file-bold';
  };

  const getDisplayName = (item: FileItem) => {
    const parts = item.name.split('/');
    if (parts.length === 1) return { name: item.name, path: '' };
    const fileName = parts.pop() || '';
    const filePath = parts.join('/');
    return { name: fileName, path: filePath };
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[#121212] rounded-lg overflow-hidden">
        <div className="grid grid-cols-[2rem_1fr_6rem_9rem] gap-4 px-4 py-2 text-sm font-medium text-gray-300 border-b border-zinc-800">
          <div></div>
          <div className="text-left">Name</div>
          <div>Size</div>
          <div>Modified</div>
        </div>
        <div className="p-12 flex items-center justify-center">
          <p className="text-gray-400">Loading files...</p>
        </div>
      </div>
    );
  }

  if (!isLoading && files.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full bg-[#121212] rounded-lg overflow-hidden p-12 flex flex-col items-center justify-center text-center"
      >
        <div className="flex flex-col items-center space-y-4">
          <Icon icon="solar:folder-search-bold" className="w-12 h-12 text-gray-500" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-300">No files found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full bg-[#121212] rounded-lg overflow-hidden">
      <div className="grid grid-cols-[2rem_1fr_6rem_9rem] gap-4 px-4 py-2 text-sm font-medium text-gray-300 border-b border-zinc-800">
        <div></div>
        <div className="text-left">Name</div>
        <div>Size</div>
        <div>Modified</div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPath}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {showParentDir && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              onClick={() => handleClick('parent')}
              className="grid grid-cols-[2rem_1fr_6rem_9rem] gap-4 px-4 py-3 hover:bg-zinc-900/70 cursor-pointer items-center text-gray-200 transition-colors duration-200 border-b border-zinc-800"
            >
              <div className="flex justify-center">
                <Icon 
                  icon="solar:arrow-left-bold"
                  className="w-5 h-5 text-white"
                />
              </div>
              <span className="truncate">...</span>
              <span className="text-sm text-gray-400">-</span>
              <span className="text-sm text-gray-400">-</span>
            </motion.div>
          )}
          {sortedFiles.map((item) => {
            const { name, path } = getDisplayName(item);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                onClick={() => handleClick(item)}
                className="group grid grid-cols-[2rem_1fr_6rem_9rem] gap-4 px-4 py-3 hover:bg-zinc-900/70 cursor-pointer items-center text-gray-200 transition-colors duration-200 border-b border-zinc-800 last:border-b-0"
              >
                <div className="flex justify-center">
                  <Icon 
                    icon={getFileIcon(item)}
                    className={`w-5 h-5 transition-transform duration-200 ${
                      item.type === 'folder' ? 'group-hover:scale-110 group-hover:text-yellow-400' : 'text-white'
                    }`}
                  />
                </div>
                <div className="truncate">
                  <span>{name}</span>
                  {path && <span className="text-gray-500 ml-2">• {path}</span>}
                </div>
                <span className="text-sm text-gray-400">{item.size ? formatFileSize(item.size) : '-'}</span>
                <span className="text-sm text-gray-400">{formatDate(item.modified)}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FileList;