import { Octokit } from '@octokit/rest';

const octokit = new Octokit();

export async function fetchGitHubContents(owner: string, repo: string, path: string = '') {
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (Array.isArray(response.data)) {
      const commits = await Promise.all(
        response.data.map(async (item) => {
          try {
            const commitResponse = await octokit.repos.listCommits({
              owner,
              repo,
              path: item.path,
              per_page: 1
            });
            return commitResponse.data[0]?.commit.committer?.date || new Date().toISOString();
          } catch {
            return new Date().toISOString();
          }
        })
      );

      return response.data.map((item, index) => ({
        id: item.sha,
        name: item.name,
        type: item.type === 'dir' ? 'folder' : 'file',
        size: item.size,
        modified: commits[index],
        download_url: item.download_url,
        html_url: item.html_url,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching GitHub contents:', error);
    return [];
  }
}

export async function fetchFileContent(url: string) {
  try {
    const response = await fetch(url);
    return await response.text();
  } catch (error) {
    console.error('Error fetching file content:', error);
    return '';
  }
}