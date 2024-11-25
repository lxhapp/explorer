import React from 'react';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbItem } from '../types';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  return (
    <div className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={item.path}>
          <button
            onClick={() => onNavigate(item.path)}
            className="text-gray-300 hover:text-blue-400 transition-colors"
          >
            {item.name}
          </button>
          {index < items.length - 1 && (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Breadcrumb;