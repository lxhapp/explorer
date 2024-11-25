import { FileItem } from './types';

export const mockFiles: Record<string, FileItem[]> = {
  '/': [
    { id: '1', name: 'Documents', type: 'folder', modified: '2024-03-15' },
    { id: '2', name: 'Images', type: 'folder', modified: '2024-03-14' },
    { id: '3', name: 'Projects', type: 'folder', modified: '2024-03-13' },
    { 
      id: '4', 
      name: 'readme.md', 
      type: 'file', 
      size: '2.1 KB', 
      modified: '2024-03-12',
      content: '# Project Documentation\n\nThis is a sample readme file with markdown content.\n\n## Features\n- File browsing\n- Dark mode\n- File preview'
    },
  ],
  '/Documents': [
    { id: '5', name: 'Work', type: 'folder', modified: '2024-03-11' },
    { id: '6', name: 'Personal', type: 'folder', modified: '2024-03-10' },
    { 
      id: '7', 
      name: 'report.pdf', 
      type: 'file', 
      size: '1.5 MB', 
      modified: '2024-03-09',
      content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
  ],
  '/Images': [
    { 
      id: '8', 
      name: 'vacation.jpg', 
      type: 'file', 
      size: '3.2 MB', 
      modified: '2024-03-08',
      content: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
    },
    { 
      id: '9', 
      name: 'profile.png', 
      type: 'file', 
      size: '800 KB', 
      modified: '2024-03-07',
      content: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e'
    },
  ],
  '/Projects': [
    { id: '10', name: 'src', type: 'folder', modified: '2024-03-06' },
    { 
      id: '11', 
      name: 'package.json', 
      type: 'file', 
      size: '325 B', 
      modified: '2024-03-05',
      content: '{\n  "name": "file-explorer",\n  "version": "1.0.0",\n  "description": "A web-based file explorer"\n}'
    },
    { 
      id: '12', 
      name: 'index.js', 
      type: 'file', 
      size: '1.2 KB', 
      modified: '2024-03-04',
      content: 'console.log("Hello, World!");\n\nfunction main() {\n  // Main application code\n}'
    },
  ],
};