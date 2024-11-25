import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';
import FileList from './FileList';
import FileViewer from './FileViewer';
import SearchBar from './SearchBar';
import { fetchGitHubContents, fetchFileContent } from '../services/github';
import { BreadcrumbItem, FileItem } from '../types';

const GITHUB_OWNER = 'lxhapp';
const GITHUB_REPO = 'files';

const FileExplorer: React.FC = () => {
  const { '*': path = '' } = useParams();
  const navigate = useNavigate();
  const currentPath = `/${path}`;
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [isFileViewerVisible, setIsFileViewerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<FileItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchFilesRecursively = async (currentPath: string, depth = 0): Promise<FileItem[]> => {
    if (depth > 5) return []; // Limit recursion depth
    
    try {
      const contents = await fetchGitHubContents(GITHUB_OWNER, GITHUB_REPO, currentPath);
      let allFiles: FileItem[] = contents.map(item => ({
        ...item,
        name: currentPath ? `${currentPath}/${item.name}` : item.name
      }));

      for (const item of contents) {
        if (item.type === 'folder') {
          const subPath = currentPath ? `${currentPath}/${item.name}` : item.name;
          const subFiles = await fetchFilesRecursively(subPath, depth + 1);
          allFiles = [...allFiles, ...subFiles];
        }
      }

      return allFiles;
    } catch (error) {
      console.error('Error fetching files recursively:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadCurrentFiles = async () => {
      setIsLoading(true);
      try {
        const contents = await fetchGitHubContents(GITHUB_OWNER, GITHUB_REPO, path);
        setFiles(contents);
      } catch (error) {
        console.error('Error loading current directory:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentFiles();
  }, [path]);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const allFiles = await fetchFilesRecursively('');
      const results = allFiles.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const getBreadcrumbItems = (path: string): BreadcrumbItem[] => {
    const parts = path.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [{ name: 'Home', path: '/files' }];
    
    let currentPath = '';
    parts.forEach(part => {
      currentPath += `/${part}`;
      items.push({
        name: part,
        path: `/files${currentPath}`
      });
    });
    
    return items;
  };

  const handleBreadcrumbNavigate = (path: string) => {
    navigate(path);
  };

  const handleFileSelect = async (file: FileItem) => {
    if (file.type === 'file' && file.download_url) {
      const content = await fetchFileContent(file.download_url);
      setFileContent(content);
      setSelectedFile(file);
      setIsFileViewerVisible(true);
    }
  };

  const handleCloseFileViewer = () => {
    setIsFileViewerVisible(false);
    setTimeout(() => {
      setSelectedFile(null);
      setFileContent('');
    }, 200);
  };

  const getFileType = (file: FileItem): string => {
    if (file.type === 'folder') return 'folder';
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
    if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(ext)) return 'document';
    if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'go', 'rs', 'php', 'html', 'css'].includes(ext)) return 'code';
    
    return 'file';
  };

  const displayedFiles = searchTerm ? searchResults : files;
  const filteredFiles = displayedFiles.filter(file => {
    const matchesFilter = filterType === 'all' || getFileType(file) === filterType;
    return matchesFilter;
  });

  return (
    <div className="min-h-screen bg-black font-lexend">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-[#121212] rounded-lg shadow-xl p-6">
          <div className="mb-6 border-b border-zinc-800 pb-4">
            <Breadcrumb 
              items={getBreadcrumbItems(currentPath)}
              onNavigate={handleBreadcrumbNavigate}
            />
          </div>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            showFilter={showFilter}
            onToggleFilter={() => setShowFilter(!showFilter)}
            filterType={filterType}
            onFilterChange={setFilterType}
          />
          <FileList 
            files={filteredFiles}
            currentPath={currentPath}
            onFileSelect={handleFileSelect}
            isLoading={isLoading || isSearching}
          />
        </div>
      </div>
      {selectedFile && (
        <FileViewer
          fileName={selectedFile.name}
          content={fileContent}
          onClose={handleCloseFileViewer}
          downloadUrl={selectedFile.download_url}
          htmlUrl={selectedFile.html_url}
          isVisible={isFileViewerVisible}
        />
      )}
    </div>
  );
};

export default FileExplorer;