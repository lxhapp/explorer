import React from 'react';
import { Search, Filter, FolderIcon, FileIcon, ImageIcon, FileTextIcon, Code2Icon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilter: boolean;
  onToggleFilter: () => void;
  filterType: string;
  onFilterChange: (type: string) => void;
}

const filterOptions: FilterOption[] = [
  { value: 'all', label: 'All Files', icon: <FileIcon className="w-4 h-4" />, color: 'text-gray-400' },
  { value: 'folder', label: 'Folders', icon: <FolderIcon className="w-4 h-4" />, color: 'text-yellow-400' },
  { value: 'image', label: 'Images', icon: <ImageIcon className="w-4 h-4" />, color: 'text-green-400' },
  { value: 'document', label: 'Documents', icon: <FileTextIcon className="w-4 h-4" />, color: 'text-blue-400' },
  { value: 'code', label: 'Code', icon: <Code2Icon className="w-4 h-4" />, color: 'text-purple-400' },
];

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  showFilter,
  onToggleFilter,
  filterType,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col space-y-4 mb-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search files and folders..."
            className="w-full bg-zinc-900/50 text-gray-200 px-4 py-2 pl-10 rounded-lg border border-zinc-800 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <button
          onClick={onToggleFilter}
          className={`p-2 rounded-lg border transition-colors ${
            showFilter 
              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
              : 'border-zinc-800 text-gray-400 hover:border-blue-500/50 hover:text-blue-400'
          }`}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {filterOptions.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                  filterType === option.value
                    ? `bg-${option.color.split('-')[1]}-500/20 border-${option.color.split('-')[1]}-500/50 ${option.color}`
                    : 'border-zinc-800 text-gray-400 hover:border-zinc-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={option.color}>{option.icon}</span>
                <span>{option.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;