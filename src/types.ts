export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  content?: string;
  download_url?: string;
  html_url?: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}