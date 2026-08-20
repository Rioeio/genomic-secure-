import os
import re
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def markdown_to_docx(md_path: str, docx_path: str, title: str):
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    doc = docx.Document()
    
    # Page setup
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Base styling
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(0x2D, 0x37, 0x48) # Dark slate

    i = 0
    in_code_block = False
    code_lines = []
    
    while i < len(lines):
        line = lines[i].rstrip('\r\n')
        
        # Code blocks
        if line.startswith('```'):
            if in_code_block:
                # Flush code block
                code_text = '\n'.join(code_lines)
                table = doc.add_table(rows=1, cols=1)
                table.autofit = False
                table.columns[0].width = Inches(6.5)
                cell = table.cell(0, 0)
                set_cell_background(cell, "F7FAFC")
                cp = cell.paragraphs[0]
                cp.paragraph_format.space_before = Pt(4)
                cp.paragraph_format.space_after = Pt(4)
                run = cp.add_run(code_text)
                run.font.name = 'Consolas'
                run.font.size = Pt(9.5)
                run.font.color.rgb = RGBColor(0x1A, 0x20, 0x2C)
                doc.add_paragraph() # spacing
                code_lines = []
                in_code_block = False
            else:
                in_code_block = True
                code_lines = []
            i += 1
            continue
            
        if in_code_block:
            code_lines.append(line)
            i += 1
            continue

        # Markdown tables
        if line.startswith('|') and '|' in line[1:]:
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                table_lines.append(lines[i].strip())
                i += 1
                
            if len(table_lines) >= 2:
                # Parse markdown table
                headers = [c.strip() for c in table_lines[0].split('|')[1:-1]]
                data_rows = []
                for row_line in table_lines[1:]:
                    if re.match(r'^\|[\s\-:|]+\|$', row_line):
                        continue # Separator line
                    cols = [c.strip() for c in row_line.split('|')[1:-1]]
                    if cols:
                        data_rows.append(cols)
                        
                num_cols = len(headers)
                if num_cols > 0:
                    tbl = doc.add_table(rows=len(data_rows) + 1, cols=num_cols)
                    tbl.autofit = True
                    
                    # Style Header Row
                    hdr_cells = tbl.rows[0].cells
                    for col_idx, header_text in enumerate(headers):
                        if col_idx < len(hdr_cells):
                            hdr_cells[col_idx].text = header_text
                            set_cell_background(hdr_cells[col_idx], "2B6CB0") # Professional blue
                            p = hdr_cells[col_idx].paragraphs[0]
                            p.paragraph_format.space_before = Pt(4)
                            p.paragraph_format.space_after = Pt(4)
                            for r in p.runs:
                                r.font.bold = True
                                r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
                                r.font.size = Pt(10)
                                
                    # Data Rows
                    for row_idx, row_data in enumerate(data_rows):
                        row_cells = tbl.rows[row_idx + 1].cells
                        bg_color = "F7FAFC" if row_idx % 2 == 1 else "FFFFFF"
                        for col_idx, cell_value in enumerate(row_data):
                            if col_idx < len(row_cells):
                                row_cells[col_idx].text = cell_value
                                set_cell_background(row_cells[col_idx], bg_color)
                                p = row_cells[col_idx].paragraphs[0]
                                p.paragraph_format.space_before = Pt(3)
                                p.paragraph_format.space_after = Pt(3)
                                for r in p.runs:
                                    r.font.size = Pt(9.5)
                                    
                    doc.add_paragraph() # space after table
            continue

        # Blank lines
        if not line.strip():
            i += 1
            continue

        # Headings
        if line.startswith('# '):
            h = doc.add_heading(level=1)
            run = h.add_run(line[2:].strip())
            run.font.name = 'Calibri'
            run.font.size = Pt(22)
            run.font.bold = True
            run.font.color.rgb = RGBColor(0x1A, 0x36, 0x5D)
            h.paragraph_format.space_before = Pt(14)
            h.paragraph_format.space_after = Pt(8)
            i += 1
            continue
        elif line.startswith('## '):
            h = doc.add_heading(level=2)
            run = h.add_run(line[3:].strip())
            run.font.name = 'Calibri'
            run.font.size = Pt(16)
            run.font.bold = True
            run.font.color.rgb = RGBColor(0x2B, 0x6C, 0xB0)
            h.paragraph_format.space_before = Pt(12)
            h.paragraph_format.space_after = Pt(6)
            i += 1
            continue
        elif line.startswith('### '):
            h = doc.add_heading(level=3)
            run = h.add_run(line[4:].strip())
            run.font.name = 'Calibri'
            run.font.size = Pt(13)
            run.font.bold = True
            run.font.color.rgb = RGBColor(0x2D, 0x37, 0x48)
            h.paragraph_format.space_before = Pt(10)
            h.paragraph_format.space_after = Pt(4)
            i += 1
            continue
        elif line.startswith('#### '):
            h = doc.add_heading(level=4)
            run = h.add_run(line[5:].strip())
            run.font.name = 'Calibri'
            run.font.size = Pt(11.5)
            run.font.bold = True
            run.font.color.rgb = RGBColor(0x4A, 0x55, 0x68)
            h.paragraph_format.space_before = Pt(8)
            h.paragraph_format.space_after = Pt(3)
            i += 1
            continue

        # Horizontal rule
        if line.strip() in ['---', '***', '___']:
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(6)
            run = p.add_run('_______________________________________________________________________________')
            run.font.color.rgb = RGBColor(0xE2, 0xE8, 0xF0)
            i += 1
            continue

        # Bullet list items
        if line.strip().startswith('- ') or line.strip().startswith('* '):
            bullet_text = line.strip()[2:]
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            _add_formatted_runs(p, bullet_text)
            i += 1
            continue

        # Numbered list items
        num_match = re.match(r'^(\d+)\.\s+(.*)$', line.strip())
        if num_match:
            item_text = num_match.group(2)
            p = doc.add_paragraph(style='List Number')
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            _add_formatted_runs(p, item_text)
            i += 1
            continue

        # Blockquotes
        if line.strip().startswith('>'):
            quote_text = line.strip()[1:].strip()
            table = doc.add_table(rows=1, cols=1)
            table.autofit = False
            table.columns[0].width = Inches(6.5)
            cell = table.cell(0, 0)
            set_cell_background(cell, "EBF8FF") # light blue
            p = cell.paragraphs[0]
            p.paragraph_format.left_indent = Inches(0.1)
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(4)
            run = p.add_run(quote_text)
            run.font.italic = True
            run.font.color.rgb = RGBColor(0x2B, 0x6C, 0xB0)
            doc.add_paragraph()
            i += 1
            continue

        # Regular paragraph
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        _add_formatted_runs(p, line)
        i += 1

    doc.save(docx_path)
    print(f"Generated Word Document: {docx_path}")

def _add_formatted_runs(paragraph, text: str):
    # Splits by bold (**text**) and code (`code`)
    parts = re.split(r'(\*\*.*?\*\*|`.*?`)', text)
    for part in parts:
        if part.startswith('**') and part.endswith('**'):
            r = paragraph.add_run(part[2:-2])
            r.font.bold = True
        elif part.startswith('`') and part.endswith('`'):
            r = paragraph.add_run(part[1:-1])
            r.font.name = 'Consolas'
            r.font.size = Pt(9.5)
            r.font.color.rgb = RGBColor(0x80, 0x5A, 0xD5) # purple for inline code
        else:
            paragraph.add_run(part)

if __name__ == "__main__":
    brain_dir = r"C:\Users\Manoj\.gemini\antigravity\brain\82a1cfbc-f612-4c89-a236-03801d02b37d"
    repo_dir = r"C:\genomicsecure"
    
    # 1. Non-Technical Project Report
    md1 = os.path.join(brain_dir, "project_report.md")
    docx1_brain = os.path.join(brain_dir, "MedLink_Project_Report.docx")
    docx1_repo = os.path.join(repo_dir, "MedLink_Project_Report.docx")
    markdown_to_docx(md1, docx1_brain, "Med-Link: Project Report")
    markdown_to_docx(md1, docx1_repo, "Med-Link: Project Report")
    
    # 2. Technical Architecture Reference Report
    md2 = os.path.join(brain_dir, "technical_architecture_report.md")
    docx2_brain = os.path.join(brain_dir, "MedLink_Technical_Architecture_Report.docx")
    docx2_repo = os.path.join(repo_dir, "MedLink_Technical_Architecture_Report.docx")
    markdown_to_docx(md2, docx2_brain, "Med-Link: Technical Architecture Reference")
    markdown_to_docx(md2, docx2_repo, "Med-Link: Technical Architecture Reference")
    
    # 3. In-Depth Backend Architecture & API Guide
    md3 = os.path.join(brain_dir, "backend_in_depth_report.md")
    docx3_brain = os.path.join(brain_dir, "MedLink_Backend_InDepth_Report.docx")
    docx3_repo = os.path.join(repo_dir, "MedLink_Backend_InDepth_Report.docx")
    markdown_to_docx(md3, docx3_brain, "Med-Link: In-Depth Backend Architecture & API Guide")
    markdown_to_docx(md3, docx3_repo, "Med-Link: In-Depth Backend Architecture & API Guide")
