import DOMPurify from "dompurify";


export default function SafeHtml({ html, className }: { html: string, className?: string }) {
    const clean = DOMPurify.sanitize(html);
    return <div dangerouslySetInnerHTML={{ __html: clean }} className={className} />;
}