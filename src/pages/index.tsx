import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useAllDocsData} from '@docusaurus/plugin-content-docs/client';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const allDocsData = useAllDocsData();
  
  const docsData = allDocsData['default'];
  const docs = docsData?.versions?.[0]?.docs || [];

  // Hardcoded folder order - modify this array to set your desired order
  const folderOrder = [
    'Intro',
    'Game Concepts',
    'Pre-Game Rules',
    'Game Rules',
    'Post-Game Rules',
    'Campaign Rules',
    'Factions List',
    'Warbands',
    'Reference',
    'Sample Warbands',
  ];

  // Extract number from string like "1. Intro" -> 1
  const extractNumber = (str: string): number => {
    const match = str.match(/^(\d+)\.\s*/);
    return match ? parseInt(match[1], 10) : Infinity;
  };

  // Organize docs by folder structure with proper sorting
  const organizeByFolder = (docs: any[]) => {
    const structure: any = {};
    
    docs.forEach((doc: any) => {
      const parts = doc.id.split('/');
      
      if (parts.length === 1) {
        // Root level doc
        if (!structure['_root']) structure['_root'] = [];
        structure['_root'].push(doc);
      } else {
        // Get the top-level folder
        const folder = parts[0];
        if (!structure[folder]) structure[folder] = {
          name: folder,
          docs: []
        };
        structure[folder].docs.push(doc);
      }
    });
    
    // Sort docs within each folder by extracting number from filename
    Object.keys(structure).forEach(key => {
      if (key === '_root') {
        structure[key].sort((a: any, b: any) => {
          const numA = extractNumber(a.id);
          const numB = extractNumber(b.id);
          if (numA !== Infinity && numB !== Infinity) {
            return numA - numB;
          }
          return a.id.localeCompare(b.id);
        });
      } else {
        structure[key].docs.sort((a: any, b: any) => {
          const fileA = a.id.split('/').pop() || '';
          const fileB = b.id.split('/').pop() || '';
          const numA = extractNumber(fileA);
          const numB = extractNumber(fileB);
          if (numA !== Infinity && numB !== Infinity) {
            return numA - numB;
          }
          return fileA.localeCompare(fileB);
        });
      }
    });
    
    return structure;
  };

  const structure = organizeByFolder(docs);
  
  // Sort folders based on hardcoded order
  const sortedFolders = folderOrder.filter(folder => structure[folder]);
  
  // Add any folders not in the hardcoded list at the end
  const remainingFolders = Object.keys(structure)
    .filter(key => key !== '_root' && !folderOrder.includes(key))
    .sort();
  
  const allFolders = [...sortedFolders, ...remainingFolders];

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Documentation site">
      <main className="container margin-vert--lg">
        <h1>Documentation</h1>
        
        {/* Root level docs */}
        {structure['_root'] && structure['_root'].length > 0 && (
          <div style={{marginBottom: '2rem'}}>
            {structure['_root'].map((doc: any) => (
              <div key={doc.id} style={{marginBottom: '0.5rem'}}>
                <Link to={doc.path}>{doc.id}</Link>
              </div>
            ))}
          </div>
        )}
        
        {/* Organized by folders */}
        {allFolders.map(folder => (
          <div key={folder} style={{marginBottom: '2rem'}}>
            <h2>{folder}</h2>
            <div style={{marginLeft: '2rem'}}>
              {structure[folder].docs.map((doc: any) => (
                <div key={doc.id} style={{marginBottom: '0.5rem'}}>
                  <Link to={doc.path}>{doc.id.split('/').pop()}</Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </Layout>
  );
}
