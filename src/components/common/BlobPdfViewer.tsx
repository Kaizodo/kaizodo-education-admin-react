import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
// Import necessary styles for the text and annotation layers (optional but recommended)
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;



interface BlobPdfViewerProps {
    /** The PDF Blob object received from an API or file input. */
    pdfUrl: string;
    /** Height of the preview container, e.g., '600px'. */
    height?: string;
}

export const BlobPdfViewer: React.FC<BlobPdfViewerProps> = ({ pdfUrl, height = '400px' }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1); // Start with the first page



    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1); // Reset to page 1 on new document load
    };

    if (!pdfUrl) {
        return <div>No PDF file provided.</div>;
    }

    return (
        <div style={{ maxHeight: height, overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
            <p>
                Page {pageNumber} of {numPages ?? '...'}
            </p>
            {/*  */}
            <Document
                file={pdfUrl} // Pass the Object URL to the document component
                onLoadSuccess={onDocumentLoadSuccess}
                loading="Loading PDF..."
                error="Failed to load PDF."
            >
                <Page
                    pageNumber={pageNumber}
                    renderAnnotationLayer={true} // Renders links and annotations
                    renderTextLayer={true} // Renders selectable text
                />
            </Document>
            <div style={{ marginTop: '10px' }}>
                <button
                    onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                    disabled={pageNumber <= 1}
                >
                    Previous
                </button>
                <button
                    onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || 1))}
                    disabled={!numPages || pageNumber >= numPages}
                    style={{ marginLeft: '10px' }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};