import { FileText, FileDown, Printer } from 'lucide-react';
import type { Analysis } from '@/types/analysis';

interface ExportButtonsProps {
  analysis: Analysis;
}

function buildTextContent(a: Analysis): string {
  const lines: string[] = [];
  lines.push(`ӘДЕБИ ТАЛДАУ: ${a.title}`);
  lines.push(`Автор: ${a.author}`);
  lines.push(`Жанр: ${a.genre} | Бағыт: ${a.direction}`);
  lines.push(`Кезең: ${a.period} | Әдеби ағым: ${a.literaryMovement}`);
  lines.push('');
  lines.push('ТАҚЫРЫП:');
  lines.push(a.theme);
  lines.push('');
  lines.push('ИДЕЯ:');
  lines.push(a.idea);
  lines.push('');
  lines.push('НЕГІЗГІ ОЙ:');
  lines.push(a.mainThought);
  lines.push('');
  lines.push('КОМПОЗИЦИЯ:');
  a.composition.forEach((c) => {
    lines.push(`  • ${c.nameKaz}: ${c.description}`);
    if (c.excerpt) lines.push(`    "...${c.excerpt}..."`);
  });
  lines.push('');
  lines.push('КЕЙІПКЕРЛЕР:');
  a.characters.forEach((ch) => {
    lines.push(`  • ${ch.name} (${ch.type === 'main' ? 'Басты' : ch.type === 'secondary' ? 'Қосалқы' : 'Эпизодтық'})`);
    lines.push(`    ${ch.description}`);
  });
  lines.push('');
  lines.push('КӨРКЕМДЕГІШ ТӘСІЛДЕР:');
  a.stylisticDevices.forEach((d) => {
    lines.push(`  ${d.nameKaz} (${d.name}):`);
    d.examples.forEach((ex) => lines.push(`    — "${ex.text}": ${ex.explanation}`));
  });
  lines.push('');
  lines.push('ҚЫЗЫҚТЫ ДЕРЕКТЕР:');
  a.interestingFacts.forEach((f, i) => lines.push(`  ${i + 1}. ${f}`));
  return lines.join('\n');
}

export default function ExportButtons({ analysis }: ExportButtonsProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleTxt = () => {
    const content = buildTextContent(analysis);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talday-${analysis.workSlug}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDocx = () => {
    // Generate an HTML file that Word / LibreOffice can open as .doc
    const content = buildTextContent(analysis);
    const htmlContent = `<!DOCTYPE html>
<html lang="kk">
<head>
<meta charset="utf-8">
<title>${analysis.title} — Әдеби талдау</title>
<style>
  body { font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.8; margin: 2.5cm; color: #000; }
  h1 { font-size: 18pt; text-align: center; margin-bottom: 24pt; }
  h2 { font-size: 14pt; margin-top: 18pt; border-bottom: 1px solid #999; padding-bottom: 4pt; }
  p { margin: 6pt 0; }
  .meta { background: #f5f5f5; padding: 12pt; margin-bottom: 18pt; }
</style>
</head>
<body>
<h1>${analysis.title}</h1>
<div class="meta">
<p><strong>Автор:</strong> ${analysis.author}</p>
<p><strong>Жанр:</strong> ${analysis.genre}</p>
<p><strong>Кезең:</strong> ${analysis.period}</p>
<p><strong>Тақырып:</strong> ${analysis.theme}</p>
<p><strong>Идея:</strong> ${analysis.idea}</p>
</div>
<pre style="font-family:inherit;white-space:pre-wrap;">${content}</pre>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talday-${analysis.workSlug}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleJson = () => {
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talday-${analysis.workSlug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const buttons = [
    { icon: <Printer size={16} />, label: 'Басып шығару', onClick: handlePrint, color: 'bg-slate-700 hover:bg-slate-600' },
    { icon: <FileText size={16} />, label: 'TXT жүктеу', onClick: handleTxt, color: 'bg-blue-700/80 hover:bg-blue-600' },
    { icon: <FileDown size={16} />, label: 'DOC жүктеу', onClick: handleDocx, color: 'bg-emerald-700/80 hover:bg-emerald-600' },
    { icon: <FileDown size={16} />, label: 'JSON жүктеу', onClick: handleJson, color: 'bg-amber-700/80 hover:bg-amber-600' },
  ];

  return (
    <div className="flex flex-wrap gap-3 print:hidden">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          onClick={btn.onClick}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-200 ${btn.color}`}
        >
          {btn.icon}
          {btn.label}
        </button>
      ))}
    </div>
  );
}
