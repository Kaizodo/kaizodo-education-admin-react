import { readdir, stat, readFile } from 'fs';
import { join, extname } from 'path';

const excludedFolders = ['node_modules', '.git', 'dist', 'vendor', 'config', 'bootstrap', 'public'];
const allowedExtensions = ['.ts', '.tsx'];

function searchFilesForWords(folderPath, words) {
    readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = join(folderPath, file);

            stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error retrieving file stats:', err);
                    return;
                }

                if (stats.isDirectory()) {
                    if (!excludedFolders.includes(file)) {
                        searchFilesForWords(filePath, words);
                    }
                } else if (
                    stats.isFile() &&
                    allowedExtensions.includes(extname(file))
                ) {
                    readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error('Error reading file:', err);
                            return;
                        }

                        if (containsWords(data, words)) {
                            console.log(filePath);
                        }
                    });
                }
            });
        });
    });
}

function containsWords(text, words) {
    return words.some(word => text.includes(word));
}

const folderPath = './src'; // Target folder
const wordsToSearch = ['pickMultipleUsers']; // Words to find

searchFilesForWords(folderPath, wordsToSearch);
