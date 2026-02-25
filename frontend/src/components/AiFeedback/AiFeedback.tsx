import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import type { ComponentPropsWithoutRef } from 'react';
import './AiFeedback.css';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('python', python);

interface AiFeedbackProps {
    feedback: string;
    provider?: string;
    model?: string;
}

export default function AiFeedback({ feedback, provider, model }: AiFeedbackProps) {
    return (
        <div className="ai-feedback">
            {provider && (
                <div className="ai-feedback-provider">
                    <span className="provider-dot" />
                    <span className="provider-label">{provider}</span>
                    {model && <span className="provider-model">{model}</span>}
                </div>
            )}
            <div className="ai-feedback-body">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ className, children, ...props }: ComponentPropsWithoutRef<'code'>) {
                            const match = /language-(\w+)/.exec(className || '');
                            const codeStr = String(children).replace(/\n$/, '');

                            if (match) {
                                return (
                                    <SyntaxHighlighter
                                        style={oneDark}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{
                                            margin: '12px 0',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            lineHeight: '1.5',
                                        }}
                                    >
                                        {codeStr}
                                    </SyntaxHighlighter>
                                );
                            }
                            return <code className="inline-code" {...props}>{children}</code>;
                        },
                    }}
                >
                    {feedback}
                </ReactMarkdown>
            </div>
        </div>
    );
}
