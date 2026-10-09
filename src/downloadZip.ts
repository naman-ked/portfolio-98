import JSZip from 'jszip';
import { PROJECT_SOURCE_FILES } from './projectFiles';

export async function downloadSourceZip(): Promise<void> {
  const zip = new JSZip();

  for (const [filepath, content] of Object.entries(PROJECT_SOURCE_FILES)) {
    zip.file(filepath, content);
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6,
    },
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'windows98-portfolio-source.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 10000);
}
