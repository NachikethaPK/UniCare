"""
UniCare Health Platform - Comprehensive PDF Documentation Generator
Pure Python implementation adhering strictly to ISO 32000-1 (PDF 1.4).
Generates publication-quality, multi-page technical documentation.
"""

import sys
import os
import zlib
import datetime

class PDFBuilder:
    def __init__(self, output_path, title="UniCare Health Platform — Technical Architecture"):
        self.output_path = output_path
        self.doc_title = title
        
        # A4 Dimensions in points (72 points per inch)
        self.page_width = 595.28
        self.page_height = 841.89
        
        # Margins
        self.margin_left = 44.0
        self.margin_right = 44.0
        self.margin_top = 54.0
        self.margin_bottom = 50.0
        
        self.printable_width = self.page_width - self.margin_left - self.margin_right
        self.printable_height = self.page_height - self.margin_top - self.margin_bottom
        
        # State
        self.pages = []  # list of bytearray content streams
        self.current_stream = bytearray()
        self.cursor_y = self.page_height - self.margin_top
        self.page_number = 1
        
        # Color definitions (r, g, b in 0.0 - 1.0)
        self.COLOR_NAVY_DARK = (0.06, 0.09, 0.16)    # #0f172a
        self.COLOR_NAVY_LIGHT = (0.12, 0.16, 0.24)   # #1e293b
        self.COLOR_BLUE_ACCENT = (0.12, 0.35, 0.85)  # #1e40af
        self.COLOR_BLUE_LIGHT = (0.93, 0.96, 1.00)   # #eef2ff
        self.COLOR_TEXT_DARK = (0.10, 0.12, 0.18)    # #1a202c
        self.COLOR_TEXT_MUTED = (0.35, 0.40, 0.50)   # #64748b
        self.COLOR_BORDER = (0.85, 0.88, 0.92)       # #d1d5db
        self.COLOR_BG_ALT = (0.97, 0.98, 0.99)       # #f8fafc
        self.COLOR_GREEN = (0.02, 0.59, 0.41)        # #059669
        self.COLOR_GREEN_BG = (0.92, 0.98, 0.95)
        self.COLOR_WHITE = (1.00, 1.00, 1.00)
        
        # Standard character width proportions for Helvetica
        self.char_widths = {
            'i': 0.23, 'l': 0.23, 'j': 0.23, 'f': 0.28, 't': 0.28, 'r': 0.33,
            'm': 0.84, 'w': 0.68, 'M': 0.84, 'W': 0.94, ' ': 0.28,
            'A': 0.67, 'B': 0.67, 'C': 0.72, 'D': 0.72, 'E': 0.67, 'F': 0.61,
            'G': 0.78, 'H': 0.72, 'I': 0.28, 'J': 0.50, 'K': 0.67, 'L': 0.56,
            'N': 0.72, 'O': 0.78, 'P': 0.67, 'Q': 0.78, 'R': 0.72, 'S': 0.67,
            'T': 0.61, 'U': 0.72, 'V': 0.67, 'X': 0.67, 'Y': 0.67, 'Z': 0.61
        }
        
    def _text_width(self, text, size, font='regular'):
        if font == 'mono':
            return len(text) * 0.60 * size
        default_w = 0.54 if font == 'regular' else 0.58
        return sum(self.char_widths.get(c, default_w) * size for c in text)

    def _escape_pdf_text(self, text):
        # Escape backslash and parentheses
        return text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

    def new_page(self):
        if self.current_stream:
            self.pages.append(self.current_stream)
            self.current_stream = bytearray()
        self.page_number += 1
        self.cursor_y = self.page_height - self.margin_top
        self._draw_page_decorations()

    def _draw_page_decorations(self):
        # Running top header
        s = self.current_stream
        # Top line
        s.extend(f"{self.COLOR_BORDER[0]} {self.COLOR_BORDER[1]} {self.COLOR_BORDER[2]} RG\n".encode())
        s.extend(b"0.6 w\n")
        header_y = self.page_height - 38
        s.extend(f"{self.margin_left} {header_y} m {self.page_width - self.margin_right} {header_y} l S\n".encode())
        
        # Header text
        s.extend(b"BT\n")
        s.extend(b"/F2 7.5 Tf\n")
        s.extend(f"{self.COLOR_BLUE_ACCENT[0]} {self.COLOR_BLUE_ACCENT[1]} {self.COLOR_BLUE_ACCENT[2]} rg\n".encode())
        s.extend(f"{self.margin_left} {header_y + 5} Td\n".encode())
        s.extend(b"(UNICARE HEALTH PLATFORM) Tj\n")
        s.extend(b"/F1 7.5 Tf\n")
        s.extend(f"{self.COLOR_TEXT_MUTED[0]} {self.COLOR_TEXT_MUTED[1]} {self.COLOR_TEXT_MUTED[2]} rg\n".encode())
        s.extend(b"120 0 Td\n")
        s.extend(b"(Comprehensive Technical & Architectural Specification) Tj\n")
        s.extend(b"ET\n")
        
        # Running footer
        footer_y = 36
        s.extend(f"{self.COLOR_BORDER[0]} {self.COLOR_BORDER[1]} {self.COLOR_BORDER[2]} RG\n".encode())
        s.extend(b"0.6 w\n")
        s.extend(f"{self.margin_left} {footer_y} m {self.page_width - self.margin_right} {footer_y} l S\n".encode())
        
        s.extend(b"BT\n")
        s.extend(b"/F1 7.5 Tf\n")
        s.extend(f"{self.COLOR_TEXT_MUTED[0]} {self.COLOR_TEXT_MUTED[1]} {self.COLOR_TEXT_MUTED[2]} rg\n".encode())
        s.extend(f"{self.margin_left} {footer_y - 12} Td\n".encode())
        now_str = datetime.date.today().strftime("%B %Y")
        s.extend(f"(UniCare Digital Health Ecosystem  |  {now_str}  |  Strictly Confidential) Tj\n".encode())
        
        # Page placeholder
        page_str = f"Page {self.page_number} of {{TOTAL_PAGES}}"
        page_x = self.page_width - self.margin_right - self._text_width(page_str, 7.5)
        s.extend(f"{page_x - self.margin_left} 0 Td\n".encode())
        s.extend(f"({page_str}) Tj\n".encode())
        s.extend(b"ET\n")

    def ensure_space(self, height_needed):
        if self.cursor_y - height_needed < self.margin_bottom + 10:
            self.new_page()

    # --- Structural Elements ---

    def draw_cover_banner(self, main_title, subtitle, meta_items):
        self.ensure_space(140)
        s = self.current_stream
        
        banner_h = 135
        banner_y = self.cursor_y - banner_h
        
        # Rounded or crisp banner rectangle
        s.extend(f"{self.COLOR_NAVY_DARK[0]} {self.COLOR_NAVY_DARK[1]} {self.COLOR_NAVY_DARK[2]} rg\n".encode())
        s.extend(f"{self.margin_left} {banner_y} {self.printable_width} {banner_h} re f\n".encode())
        
        # Accent top bar in blue
        s.extend(f"{self.COLOR_BLUE_ACCENT[0]} {self.COLOR_BLUE_ACCENT[1]} {self.COLOR_BLUE_ACCENT[2]} rg\n".encode())
        s.extend(f"{self.margin_left} {banner_y + banner_h - 4} {self.printable_width} 4 re f\n".encode())
        
        # Badge
        badge_y = banner_y + banner_h - 26
        s.extend(b"BT\n/F2 8 Tf\n1.0 1.0 1.0 rg\n")
        s.extend(f"{self.margin_left + 20} {badge_y} Td\n".encode())
        s.extend(b"(ENTERPRISE HEALTHCARE & VETERINARY ARCHITECTURE) Tj\nET\n")
        
        # Main Title
        title_y = badge_y - 28
        s.extend(b"BT\n/F2 20 Tf\n1.0 1.0 1.0 rg\n")
        s.extend(f"{self.margin_left + 20} {title_y} Td\n".encode())
        s.extend(f"({self._escape_pdf_text(main_title)}) Tj\nET\n")
        
        # Subtitle
        sub_y = title_y - 18
        s.extend(b"BT\n/F3 10.5 Tf\n0.80 0.88 1.00 rg\n")
        s.extend(f"{self.margin_left + 20} {sub_y} Td\n".encode())
        s.extend(f"({self._escape_pdf_text(subtitle)}) Tj\nET\n")
        
        # Meta items row
        meta_y = sub_y - 28
        s.extend(b"BT\n/F1 8 Tf\n0.68 0.75 0.88 rg\n")
        s.extend(f"{self.margin_left + 20} {meta_y} Td\n".encode())
        meta_text = "   |   ".join(meta_items)
        s.extend(f"({self._escape_pdf_text(meta_text)}) Tj\nET\n")
        
        self.cursor_y = banner_y - 20

    def draw_section_h1(self, title):
        self.ensure_space(42)
        s = self.current_stream
        
        bar_h = 24
        bar_y = self.cursor_y - bar_h
        
        # Background bar
        s.extend(f"{self.COLOR_NAVY_LIGHT[0]} {self.COLOR_NAVY_LIGHT[1]} {self.COLOR_NAVY_LIGHT[2]} rg\n".encode())
        s.extend(f"{self.margin_left} {bar_y} {self.printable_width} {bar_h} re f\n".encode())
        
        # Left blue accent pip
        s.extend(f"{self.COLOR_BLUE_ACCENT[0]} {self.COLOR_BLUE_ACCENT[1]} {self.COLOR_BLUE_ACCENT[2]} rg\n".encode())
        s.extend(f"{self.margin_left} {bar_y} 5 {bar_h} re f\n".encode())
        
        # Text
        s.extend(b"BT\n/F2 11.5 Tf\n1.0 1.0 1.0 rg\n")
        s.extend(f"{self.margin_left + 14} {bar_y + 7} Td\n".encode())
        s.extend(f"({self._escape_pdf_text(title.upper())}) Tj\nET\n")
        
        self.cursor_y = bar_y - 14

    def draw_section_h2(self, title):
        self.ensure_space(30)
        s = self.current_stream
        
        text_y = self.cursor_y - 14
        s.extend(b"BT\n/F2 10.5 Tf\n")
        s.extend(f"{self.COLOR_BLUE_ACCENT[0]} {self.COLOR_BLUE_ACCENT[1]} {self.COLOR_BLUE_ACCENT[2]} rg\n".encode())
        s.extend(f"{self.margin_left} {text_y} Td\n".encode())
        s.extend(f"({self._escape_pdf_text(title)}) Tj\nET\n")
        
        # Subtle underline
        line_y = text_y - 3
        s.extend(f"{self.COLOR_BORDER[0]} {self.COLOR_BORDER[1]} {self.COLOR_BORDER[2]} RG\n".encode())
        s.extend(b"0.5 w\n")
        s.extend(f"{self.margin_left} {line_y} m {self.page_width - self.margin_right} {line_y} l S\n".encode())
        
        self.cursor_y = line_y - 10

    def draw_paragraph(self, text, bold_prefix="", font_size=8.5, line_spacing=12.5, text_color=None):
        if text_color is None:
            text_color = self.COLOR_TEXT_DARK
            
        full_text = (bold_prefix + " " + text).strip() if bold_prefix else text
        words = full_text.split()
        
        lines = []
        curr_line = []
        curr_w = 0
        
        for w in words:
            w_len = self._text_width(w + ' ', font_size)
            if curr_w + w_len > self.printable_width:
                lines.append(' '.join(curr_line))
                curr_line = [w]
                curr_w = w_len
            else:
                curr_line.append(w)
                curr_w += w_len
        if curr_line:
            lines.append(' '.join(curr_line))
            
        total_h = len(lines) * line_spacing
        self.ensure_space(total_h + 6)
        
        s = self.current_stream
        for line in lines:
            s.extend(b"BT\n")
            if bold_prefix and line.startswith(bold_prefix):
                # Render prefix bold
                s.extend(f"/F2 {font_size} Tf\n".encode())
                s.extend(f"{text_color[0]} {text_color[1]} {text_color[2]} rg\n".encode())
                s.extend(f"{self.margin_left} {self.cursor_y} Td\n".encode())
                s.extend(f"({self._escape_pdf_text(bold_prefix)}) Tj\n".encode())
                
                rest = line[len(bold_prefix):]
                prefix_w = self._text_width(bold_prefix, font_size, 'bold')
                s.extend(f"/F1 {font_size} Tf\n".encode())
                s.extend(f"{prefix_w} 0 Td\n".encode())
                s.extend(f"({self._escape_pdf_text(rest)}) Tj\n".encode())
            else:
                s.extend(f"/F1 {font_size} Tf\n".encode())
                s.extend(f"{text_color[0]} {text_color[1]} {text_color[2]} rg\n".encode())
                s.extend(f"{self.margin_left} {self.cursor_y} Td\n".encode())
                s.extend(f"({self._escape_pdf_text(line)}) Tj\n".encode())
            s.extend(b"ET\n")
            self.cursor_y -= line_spacing
            
        self.cursor_y -= 4

    def draw_bullet(self, bold_term, body_text, indent=14):
        full_text = bold_term + ": " + body_text if bold_term else body_text
        max_w = self.printable_width - indent
        
        words = full_text.split()
        lines = []
        curr_line = []
        curr_w = 0
        for w in words:
            w_len = self._text_width(w + ' ', 8.5)
            if curr_w + w_len > max_w:
                lines.append(' '.join(curr_line))
                curr_line = [w]
                curr_w = w_len
            else:
                curr_line.append(w)
                curr_w += w_len
        if curr_line:
            lines.append(' '.join(curr_line))
            
        line_spacing = 12.0
        total_h = len(lines) * line_spacing
        self.ensure_space(total_h + 4)
        
        s = self.current_stream
        # Draw bullet symbol
        bullet_y = self.cursor_y + 1
        s.extend(f"{self.COLOR_BLUE_ACCENT[0]} {self.COLOR_BLUE_ACCENT[1]} {self.COLOR_BLUE_ACCENT[2]} rg\n".encode())
        s.extend(f"{self.margin_left + 4} {bullet_y} 2.8 2.8 re f\n".encode())
        
        for idx, line in enumerate(lines):
            s.extend(b"BT\n")
            s.extend(f"{self.margin_left + indent} {self.cursor_y} Td\n".encode())
            if idx == 0 and bold_term:
                s.extend(b"/F2 8.5 Tf\n")
                s.extend(f"{self.COLOR_TEXT_DARK[0]} {self.COLOR_TEXT_DARK[1]} {self.COLOR_TEXT_DARK[2]} rg\n".encode())
                term_part = bold_term + ": "
                s.extend(f"({self._escape_pdf_text(term_part)}) Tj\n".encode())
                
                term_w = self._text_width(term_part, 8.5, 'bold')
                rest = line[len(term_part):]
                s.extend(b"/F1 8.5 Tf\n")
                s.extend(f"{term_w} 0 Td\n".encode())
                s.extend(f"({self._escape_pdf_text(rest)}) Tj\n".encode())
            else:
                s.extend(b"/F1 8.5 Tf\n")
                s.extend(f"{self.COLOR_TEXT_DARK[0]} {self.COLOR_TEXT_DARK[1]} {self.COLOR_TEXT_DARK[2]} rg\n".encode())
                s.extend(f"({self._escape_pdf_text(line)}) Tj\n".encode())
            s.extend(b"ET\n")
            self.cursor_y -= line_spacing
            
        self.cursor_y -= 2

    def draw_callout_box(self, title, content_lines, theme='blue'):
        bg_col = self.COLOR_BLUE_LIGHT if theme == 'blue' else self.COLOR_GREEN_BG
        border_col = self.COLOR_BLUE_ACCENT if theme == 'blue' else self.COLOR_GREEN
        
        line_h = 12.0
        box_h = 24 + len(content_lines) * line_h
        self.ensure_space(box_h + 10)
        
        s = self.current_stream
        box_y = self.cursor_y - box_h
        
        # Box background
        s.extend(f"{bg_col[0]} {bg_col[1]} {bg_col[2]} rg\n".encode())
        s.extend(f"{self.margin_left} {box_y} {self.printable_width} {box_h} re f\n".encode())
        
        # Border
        s.extend(f"{self.COLOR_BORDER[0]} {self.COLOR_BORDER[1]} {self.COLOR_BORDER[2]} RG\n".encode())
        s.extend(b"0.6 w\n")
        s.extend(f"{self.margin_left} {box_y} {self.printable_width} {box_h} re S\n".encode())
        
        # Left accent line
        s.extend(f"{border_col[0]} {border_col[1]} {border_col[2]} rg\n".encode())
        s.extend(f"{self.margin_left} {box_y} 3.5 {box_h} re f\n".encode())
        
        # Title
        t_y = box_y + box_h - 14
        s.extend(b"BT\n/F2 9 Tf\n")
        s.extend(f"{border_col[0]} {border_col[1]} {border_col[2]} rg\n".encode())
        s.extend(f"{self.margin_left + 12} {t_y} Td\n".encode())
        s.extend(f"({self._escape_pdf_text(title)}) Tj\nET\n")
        
        # Body lines
        curr_y = t_y - 12
        for line in content_lines:
            s.extend(b"BT\n/F1 8 Tf\n")
            s.extend(f"{self.COLOR_TEXT_DARK[0]} {self.COLOR_TEXT_DARK[1]} {self.COLOR_TEXT_DARK[2]} rg\n".encode())
            s.extend(f"{self.margin_left + 12} {curr_y} Td\n".encode())
            s.extend(f"({self._escape_pdf_text(line)}) Tj\nET\n")
            curr_y -= line_h
            
        self.cursor_y = box_y - 12

    def draw_table(self, headers, rows, col_widths=None):
        num_cols = len(headers)
        if not col_widths:
            equal_w = self.printable_width / num_cols
            col_widths = [equal_w] * num_cols
        else:
            # Scale proportionally to printable_width if needed
            total = sum(col_widths)
            col_widths = [(w / total) * self.printable_width for w in col_widths]
            
        row_h = 18.0
        table_h = (len(rows) + 1) * row_h
        self.ensure_space(table_h + 10)
        
        s = self.current_stream
        
        # Header Row
        header_y = self.cursor_y - row_h
        s.extend(f"{self.COLOR_NAVY_LIGHT[0]} {self.COLOR_NAVY_LIGHT[1]} {self.COLOR_NAVY_LIGHT[2]} rg\n".encode())
        s.extend(f"{self.margin_left} {header_y} {self.printable_width} {row_h} re f\n".encode())
        
        curr_x = self.margin_left
        for idx, h in enumerate(headers):
            s.extend(b"BT\n/F2 8 Tf\n1.0 1.0 1.0 rg\n")
            s.extend(f"{curr_x + 6} {header_y + 5.5} Td\n".encode())
            s.extend(f"({self._escape_pdf_text(str(h))}) Tj\nET\n")
            curr_x += col_widths[idx]
            
        curr_y = header_y
        
        # Data Rows
        for r_idx, row in enumerate(rows):
            curr_y -= row_h
            # Zebra fill
            if r_idx % 2 == 0:
                s.extend(f"{self.COLOR_BG_ALT[0]} {self.COLOR_BG_ALT[1]} {self.COLOR_BG_ALT[2]} rg\n".encode())
                s.extend(f"{self.margin_left} {curr_y} {self.printable_width} {row_h} re f\n".encode())
                
            # Row bottom border
            s.extend(f"{self.COLOR_BORDER[0]} {self.COLOR_BORDER[1]} {self.COLOR_BORDER[2]} RG\n".encode())
            s.extend(b"0.4 w\n")
            s.extend(f"{self.margin_left} {curr_y} m {self.page_width - self.margin_right} {curr_y} l S\n".encode())
            
            # Cell text
            curr_x = self.margin_left
            for c_idx, cell in enumerate(row):
                val = str(cell)
                # First column bold if appropriate
                font_name = b"/F2 7.5 Tf\n" if c_idx == 0 else b"/F1 7.5 Tf\n"
                s.extend(b"BT\n" + font_name)
                s.extend(f"{self.COLOR_TEXT_DARK[0]} {self.COLOR_TEXT_DARK[1]} {self.COLOR_TEXT_DARK[2]} rg\n".encode())
                s.extend(f"{curr_x + 6} {curr_y + 5.5} Td\n".encode())
                s.extend(f"({self._escape_pdf_text(val)}) Tj\nET\n")
                curr_x += col_widths[c_idx]
                
        # Outer table border
        total_rows_h = (len(rows) + 1) * row_h
        s.extend(f"{self.COLOR_BORDER[0]} {self.COLOR_BORDER[1]} {self.COLOR_BORDER[2]} RG\n".encode())
        s.extend(b"0.7 w\n")
        s.extend(f"{self.margin_left} {curr_y} {self.printable_width} {total_rows_h} re S\n".encode())
        
        self.cursor_y = curr_y - 12

    def draw_code_box(self, code_lines):
        line_h = 11.5
        box_h = 14 + len(code_lines) * line_h
        self.ensure_space(box_h + 8)
        
        s = self.current_stream
        box_y = self.cursor_y - box_h
        
        # Background
        s.extend(f"{self.COLOR_NAVY_DARK[0]} {self.COLOR_NAVY_DARK[1]} {self.COLOR_NAVY_DARK[2]} rg\n".encode())
        s.extend(f"{self.margin_left} {box_y} {self.printable_width} {box_h} re f\n".encode())
        
        curr_y = box_y + box_h - 13
        for line in code_lines:
            s.extend(b"BT\n/F4 7.5 Tf\n0.88 0.94 1.00 rg\n")
            s.extend(f"{self.margin_left + 12} {curr_y} Td\n".encode())
            s.extend(f"({self._escape_pdf_text(line)}) Tj\nET\n")
            curr_y -= line_h
            
        self.cursor_y = box_y - 10

    def finalize(self):
        if self.current_stream:
            self.pages.append(self.current_stream)
            
        total_pages = len(self.pages)
        
        # Replace TOTAL_PAGES in all page streams
        finalized_pages = []
        for p in self.pages:
            decoded = p.decode('latin1')
            replaced = decoded.replace('{TOTAL_PAGES}', str(total_pages))
            finalized_pages.append(replaced.encode('latin1'))
            
        # Build PDF object table
        # 1: Catalog
        # 2: Pages
        # 3 .. 3+N-1: Page objects
        # 3+N .. 3+2N-1: Content stream objects
        # 3+2N .. 3+2N+4: Font objects
        num_pages = len(finalized_pages)
        
        font_f1_idx = 3 + 2 * num_pages
        font_f2_idx = font_f1_idx + 1
        font_f3_idx = font_f1_idx + 2
        font_f4_idx = font_f1_idx + 3
        font_f5_idx = font_f1_idx + 4
        
        objects = {}
        
        # 1: Catalog
        objects[1] = b"<< /Type /Catalog /Pages 2 0 R >>"
        
        # 2: Pages tree
        kids_refs = " ".join(f"{3 + i} 0 R" for i in range(num_pages))
        objects[2] = f"<< /Type /Pages /Kids [{kids_refs}] /Count {num_pages} >>".encode('latin1')
        
        # Page and Stream objects
        for i in range(num_pages):
            page_obj_idx = 3 + i
            stream_obj_idx = 3 + num_pages + i
            
            objects[page_obj_idx] = (
                f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {self.page_width:.2f} {self.page_height:.2f}] "
                f"/Contents {stream_obj_idx} 0 R /Resources << /Font << "
                f"/F1 {font_f1_idx} 0 R /F2 {font_f2_idx} 0 R /F3 {font_f3_idx} 0 R "
                f"/F4 {font_f4_idx} 0 R /F5 {font_f5_idx} 0 R >> >> >>"
            ).encode('latin1')
            
            stream_data = finalized_pages[i]
            compressed = zlib.compress(stream_data)
            objects[stream_obj_idx] = (
                f"<< /Length {len(compressed)} /Filter /FlateDecode >>\nstream\n".encode('latin1') +
                compressed +
                b"\nendstream"
            )
            
        # Fonts
        objects[font_f1_idx] = b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
        objects[font_f2_idx] = b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"
        objects[font_f3_idx] = b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>"
        objects[font_f4_idx] = b"<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>"
        objects[font_f5_idx] = b"<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold >>"
        
        # Assemble Byte Stream
        out = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        offsets = {}
        
        total_objs = len(objects)
        for obj_id in sorted(objects.keys()):
            offsets[obj_id] = len(out)
            out.extend(f"{obj_id} 0 obj\n".encode('latin1'))
            out.extend(objects[obj_id])
            out.extend(b"\nendobj\n")
            
        xref_offset = len(out)
        out.extend(f"xref\n0 {total_objs + 1}\n0000000000 65535 f \n".encode('latin1'))
        for obj_id in sorted(objects.keys()):
            out.extend(f"{offsets[obj_id]:010d} 00000 n \n".encode('latin1'))
            
        out.extend(
            f"trailer\n<< /Size {total_objs + 1} /Root 1 0 R >>\n"
            f"startxref\n{xref_offset}\n%%EOF".encode('latin1')
        )
        
        with open(self.output_path, 'wb') as f:
            f.write(out)
            
        return total_pages


def build_unicare_document():
    pdf_path = os.path.abspath("UniCare_Complete_Project_Documentation.pdf")
    builder = PDFBuilder(pdf_path)
    builder._draw_page_decorations()
    
    # ------------------ COVER BANNER ------------------ #
    builder.draw_cover_banner(
        main_title="UniCare Health Platform",
        subtitle="Comprehensive Technical Architecture, Security & Operational Specification",
        meta_items=[
            "Version 2.4.0-Production",
            "Target Engine: Node.js 20+ & FastAPI",
            "Database: MongoDB Atlas / Local",
            "Security: 256-Bit SSL & JWT RBAC"
        ]
    )
    
    # ------------------ EXECUTIVE SUMMARY ------------------ #
    builder.draw_section_h1("1. Executive Overview & Mission")
    builder.draw_paragraph(
        "The UniCare Health Platform is an integrated, holistic digital health ecosystem engineered to manage clinical "
        "care across two deeply interconnected life domains: Human Healthcare (covering individuals and entire family "
        "households across pediatric, adult, and geriatric life stages) and Companion Pet Healthcare (veterinary wellness, "
        "vaccination schedules, and clinical medical records)."
    )
    builder.draw_paragraph(
        "Modern health management suffers from fragmentation: human health records, family profiles, emergency blood shortages, "
        "and pet veterinary treatments are typically siloed across disparate portals. UniCare bridges these silos with a unified, "
        "offline-resilient single-page application (SPA), dual-backend microservices, geospatial emergency radar, automated "
        "doctor email dispatch, and a multi-provider clinical AI triage companion with multimodal OCR."
    )
    
    builder.draw_callout_box(
        "Key Architectural Principles",
        [
            "Dual-Backend Agility: Modular Node.js / Express 4.21 & Python FastAPI 0.110 microservice runtimes.",
            "Zero-Downtime Client Resilience: Scoped localStorage vault fallbacks protect uninterrupted patient workflows.",
            "Multi-Species Clinical Awareness: Distinguishes pediatric/geriatric human care from canine/feline veterinary toxicity.",
            "Strict Privacy-Preserving Telemetry: Zero-knowledge client encryption, masked emails, and role-based access control."
        ],
        theme='blue'
    )
    
    # ------------------ TECH STACK ------------------ #
    builder.draw_section_h1("2. Complete Technology Stack")
    
    builder.draw_section_h2("Frontend Client Architecture")
    builder.draw_bullet("Core Library & Framework", "React 19.2 (Modern Concurrent React with optimized rendering pipelines).")
    builder.draw_bullet("Build Engine & Bundler", "Vite 8.1 with @vitejs/plugin-react providing lightning-fast HMR and tree-shaken builds.")
    builder.draw_bullet("Styling & Design System", "Tailwind CSS v4 with @tailwindcss/vite engine for zero-runtime utility CSS.")
    builder.draw_bullet("Client-Side Routing", "React Router DOM v7 providing dynamic routing with ProtectedRoute RBAC guards.")
    builder.draw_bullet("State Management", "9 Context Providers: Auth, Family Vault, Appointments, Blood, Records, Pets, AI, Profile, Theme.")
    builder.draw_bullet("HTTP Client & Interceptors", "Axios 1.18 configured with global request interceptors injecting JWT Bearer headers.")
    
    builder.draw_section_h2("Dual Backend Implementation (Port 5000)")
    builder.draw_paragraph(
        "The UniCare backend is built with dual production engines sharing identical route contracts, enabling "
        "deployment teams to run either Node.js or Python depending on infrastructure requirements:"
    )
    
    stack_table_headers = ["Layer / Component", "Technology", "Version", "Primary Operational Responsibility"]
    stack_table_rows = [
        ["Node.js Engine", "Express.js (ESM)", "v4.21.2", "REST API controllers, middleware routing, and process management."],
        ["Node.js ODM", "Mongoose", "v8.9.5", "Document schemas, validations, and query execution for MongoDB."],
        ["Email Gateway", "Nodemailer", "v10.6.0", "Direct SSL (Port 465) clinical consultation notification dispatch."],
        ["Python Engine", "FastAPI / Uvicorn", "v0.110+", "High-performance async ASGI server with Pydantic v2 schemas."],
        ["Python Driver", "Motor / PyMongo", "v3.3.2+", "Non-blocking AsyncIO MongoDB connection client."],
        ["AI & OCR Service", "Google Gemini & Groq", "v1beta REST", "Multimodal Vision OCR for medical reports & clinical triage NLP."],
        ["Password Security", "Bcrypt / Bcryptjs", "12 Rounds", "Adaptive cryptographic hashing with salt factor 12."],
        ["Identity Tokens", "PyJWT / JsonWebToken", "HS256", "Stateless 7-day signed Bearer token authorization."]
    ]
    builder.draw_table(stack_table_headers, stack_table_rows, [100, 95, 65, 245])
    
    # ------------------ AUTHENTICATION & ACCESS CONTROL ------------------ #
    builder.draw_section_h1("3. Authentication, Authorization & Identity")
    builder.draw_paragraph(
        "UniCare implements a defense-in-depth security model combining stateless cryptographic tokens, role-based "
        "privilege hierarchies, and deep anti-abuse email validation."
    )
    
    builder.draw_section_h2("Role-Based Access Control (RBAC)")
    builder.draw_bullet("Patient Role", "Personal health vault, family member sub-profiles, doctor appointments, blood donor registration, and pet records.")
    builder.draw_bullet("Hospital Role", "Emergency blood shortage desk, latitude/longitude mapping, NABH/JCI license verification, and blood request lifecycle management.")
    builder.draw_bullet("Admin Role", "System developer & platform maintainer console (/admin), telemetry diagnostics, cache flushing, and masked user auditing.")
    
    builder.draw_section_h2("4-Stage Email Legitimacy & Anti-Abuse Gateway")
    builder.draw_paragraph(
        "To prevent spam, disposable bot registrations, and fraudulent clinical entries, the registration endpoint "
        "enforces a rigorous verification sequence before accounts can be created:"
    )
    
    email_table_headers = ["Stage", "Validation Technique", "Enforcement Rule & Rejection Behavior"]
    email_table_rows = [
        ["1. Syntax", "RFC 5322 Standard Regex", "Rejects malformed addresses, missing @, invalid TLDs, or user part > 64 chars."],
        ["2. Whitelist", "Demo Domain Exemption", "Permits internal testing domains (*.unicare, localhost) for development."],
        ["3. Disposable", "Blacklist Filter", "Blocks 60+ burner services (Mailinator, TempMail, GuerrillaMail, Yopmail, etc.)."],
        ["4. DNS MX", "Live Mail Exchange Lookup", "Resolves public DNS (8.8.8.8) to verify domain has active, accepting mail servers."]
    ]
    builder.draw_table(email_table_headers, email_table_rows, [80, 140, 285])
    
    builder.draw_code_box([
        "// Token Generation Spec (server/controllers/authController.js)",
        "const token = (id, role = 'patient') =>",
        "  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });",
        "",
        "// Protected Route Verification (server/middleware/auth.js)",
        "const token = req.headers.authorization?.replace('Bearer ', '');",
        "req.user = jwt.verify(token, process.env.JWT_SECRET);"
    ])
    
    # ------------------ DATABASE ARCHITECTURE ------------------ #
    builder.draw_section_h1("4. Database Configuration & Schemas")
    builder.draw_paragraph(
        "Database connections default to mongodb://localhost:27017/unicare and seamlessly connect to MongoDB Atlas "
        "in production clusters via the MONGODB_URI environment variable."
    )
    
    db_table_headers = ["Collection", "Schema Entity", "Key Fields & Relationships"]
    db_table_rows = [
        ["users", "User", "name, email (unique), password (hash), role, hospitalDetails (licenseNo, lat, lng, phone)."],
        ["profiles", "Profile", "user (ref), phone, dob, gender, family (members array), contacts, notifications."],
        ["appointments", "Appointment", "user (ref), doctor, doctorEmail, patientName, speciality, date, time, status, symptoms."],
        ["blooddonors", "BloodDonor", "user (ref), name, bloodGroup (O-, A+, etc.), location, phone, availability."],
        ["bloodrequests", "BloodRequest", "hospitalId, hospitalName, lat, lng, bloodGroup, unitsNeeded, urgency (Critical/Urgent)."],
        ["healthrecords", "HealthRecord", "user (ref), title, category, date (clinical exam date), doctor, tags, fileName, fileUrl."],
        ["pets", "Pet", "user (ref), name, species (Dog, Cat, Bird), breed, age, owner, photo."],
        ["petvaccinations", "PetVaccination", "pet (ref), name (Rabies, DHPP, FVRCP), date, nextDue, reminder (Active/Due Soon)."],
        ["petrecords", "PetRecord", "pet (ref), title, category, date, veterinarian, tags, fileName, fileUrl, summary."]
    ]
    builder.draw_table(db_table_headers, db_table_rows, [95, 105, 305])
    
    # ------------------ DATA SECURITY & PRIVACY ------------------ #
    builder.draw_section_h1("5. Data Security, Privacy & Integrity")
    
    builder.draw_section_h2("1. Multi-Tenant User Isolation")
    builder.draw_paragraph(
        "Strict multi-tenancy is enforced at both API query execution and client persistence levels. Every database "
        "query filters by the authenticated user's ID (req.user.id), making unauthorized horizontal privilege escalation "
        "mathematically impossible. On the frontend, localStorage keys are isolated per user identity "
        "(e.g., unicare_records_${userId}, unicare_family_vault_${userId})."
    )
    
    builder.draw_section_h2("2. Sub-Profile Family Vault & PIN Security")
    builder.draw_paragraph(
        "Within household vaults, family members can designate individual profiles with 4-digit security PINs. "
        "When switching active profiles, the user is required to authenticate with the corresponding PIN before "
        "prescriptions, lab panels, or clinical notes are rendered on screen."
    )
    
    builder.draw_section_h2("3. Administrative Privacy Compliance")
    builder.draw_paragraph(
        "The administrative console (/admin) enforces zero-knowledge patient data privacy: email addresses are masked "
        "by default (e.g. j***e@example.com), passwords and hashes are omitted from query projections, and personal "
        "clinical consultation notes remain strictly encrypted in individual vaults."
    )
    
    builder.draw_section_h2("4. SSL Email Transmission")
    builder.draw_paragraph(
        "Automated clinical alerts dispatched to physicians via Gmail SMTP utilize direct SSL encryption over port 465. "
        "Dispatches run asynchronously in non-blocking worker threads to prevent request stalls or credential leakage."
    )
    
    builder.draw_callout_box(
        "Data Protection Highlights",
        [
            "Bcrypt 12-Round Password Hashing: Industry standard work-factor resistance against rainbow table attacks.",
            "Zero-Knowledge Clinical Vaults: Personal health records are isolated from administrative inspection.",
            "Comprehensive Audit Logging: Full timestamped tracking of PIN adjustments, member additions, and profile switches.",
            "Client Resilience Engine: Standalone local storage persistence guarantees full operational continuity if offline."
        ],
        theme='green'
    )
    
    # ------------------ CORE MODULES ------------------ #
    builder.draw_section_h1("6. Core Functional Modules")
    
    builder.draw_section_h2("Module 1: Human Health Records Vault")
    builder.draw_bullet("Category Architecture", "Lab Reports, Scan Reports (X-Ray/MRI/CT), Prescriptions, Vaccination History, Medical Documents.")
    builder.draw_bullet("Chronological Indexing", "Records are ordered strictly by the internal medical examination date rather than upload timestamp.")
    builder.draw_bullet("Hybrid Date Extractor", "Extracts true clinical collection dates using Gemini Vision multimodal AI or regex/NLP.")
    
    builder.draw_section_h2("Module 2: Doctor Consultations & Automated Dispatch")
    builder.draw_bullet("Specialist Directory", "Cardiologists, Dermatologists, Neurologists, General Physicians, plus custom practitioner addition.")
    builder.draw_bullet("Live Email Dispatch", "Automatically sends responsive HTML consultation notifications to doctors via Gmail SMTP.")
    builder.draw_bullet("Status Lifecycle", "Tracks appointments across Upcoming, Completed, and Cancelled lifecycle states.")
    
    builder.draw_section_h2("Module 3: Blood Donation Radar & Emergency Hospital Desk")
    builder.draw_bullet("Haversine Radar", "Computes precise real-time distances (km) between patient GPS location and accredited hospitals.")
    builder.draw_bullet("Shortage Aggregation", "Groups active hospital needs by blood group (O-, B+, AB-, etc.) and urgency (Critical vs. Urgent).")
    builder.draw_bullet("Hospital Portal Desk", "Allows verified hospital partners to post emergency shortage requests directly to donors.")
    
    builder.draw_section_h2("Module 4: Companion Pet Healthcare & Veterinary Portal")
    builder.draw_bullet("Multi-Species Profiles", "Dedicated management for Dogs, Cats, Birds, and other companion animals.")
    builder.draw_bullet("Vaccination Scheduling", "Tracks administration date, next due date, and dynamic reminder flags (Active, Due Soon).")
    builder.draw_bullet("Veterinary Records", "Stores vet clinic consultations, diagnostic reports, and medical prescriptions.")
    
    # ------------------ MULTIMODAL AI & VISION OCR ------------------ #
    builder.draw_section_h1("7. Multi-Provider AI Companion & Vision OCR")
    builder.draw_paragraph(
        "UniCare incorporates a multi-provider artificial intelligence engine in server/services/ai_service.py and "
        "frontend/src/context/AIContext.jsx, providing clinical and veterinary guidance."
    )
    
    ai_table_headers = ["Provider", "Default Model", "Free Tier Specs", "Specialization"]
    ai_table_rows = [
        ["Google Gemini", "gemini-2.5-flash / 3.5-flash", "1,500 req/day (AI Studio)", "Multimodal Vision OCR & clinical report parsing."],
        ["Groq Cloud", "llama-3.3-70b-versatile", "Ultra-fast LPU inference", "High-speed symptom triage & medication advice."],
        ["OpenRouter", "llama-3.3-70b-instruct:free", "Open-source community access", "DeepSeek R1 and LLaMA open-weights inference."],
        ["Custom / Local", "llama3 / mistral / custom", "Ollama / LM Studio", "100% private, on-premise offline AI execution."]
    ]
    builder.draw_table(ai_table_headers, ai_table_rows, [90, 130, 120, 165])
    
    builder.draw_section_h2("Multimodal Gemini Vision OCR Pipeline")
    builder.draw_paragraph(
        "When a patient or pet owner uploads a photographed lab test, X-ray report, or prescription (JPG/PNG), "
        "the multimodal vision pipeline executes the following workflow:"
    )
    builder.draw_bullet("1. OCR & Layout Extraction", "Reads raw document text, identifying laboratory header blocks and examination metadata.")
    builder.draw_bullet("2. Date Discrimination", "Extracts the exact clinical collection date while intentionally ignoring DOB and print timestamps.")
    builder.draw_bullet("3. Category Classification", "Auto-classifies into Lab Reports, Scan Reports, Prescriptions, or Vaccination History.")
    builder.draw_bullet("4. Diagnostic Tag Generation", "Generates contextual tags (e.g., ['Imaging', 'MRI', 'Radiology'] or ['Lipid Panel', 'Cholesterol']).")
    
    # ------------------ ADMIN PORTAL ------------------ #
    builder.draw_section_h1("8. Administrative Operations & Telemetry")
    builder.draw_paragraph(
        "The administrative console at /admin serves as the central control plane for system maintainers, featuring:"
    )
    builder.draw_bullet("Master Access Gate", "Zero-knowledge administrative gateway requiring authenticated admin-role credentials.")
    builder.draw_bullet("Server Telemetry", "Live tracking of Node.js / Uvicorn uptime, memory footprint (RSS/heap), and latency.")
    builder.draw_bullet("Database Monitoring", "MongoDB readyState probe, active collection metrics, and document counts.")
    builder.draw_bullet("Diagnostic Export", "One-click download of full system health diagnostics in structured JSON format.")
    
    # ------------------ ENVIRONMENT CONFIGURATION ------------------ #
    builder.draw_section_h1("9. Environment & Deployment Guide")
    builder.draw_paragraph("Configure the following environment variables in server/.env and frontend/.env:")
    
    builder.draw_code_box([
        "# server/.env - Backend Environment Configuration",
        "PORT=5000",
        "MONGODB_URI=mongodb://localhost:27017/unicare",
        "JWT_SECRET=your-secure-jwt-secret-key-32-chars-minimum",
        "GEMINI_API_KEY=AIzaSy...your-gemini-key",
        "AI_PROVIDER=gemini",
        "GMAIL_USER=unicareapplication@gmail.com",
        "GMAIL_APP_PASSWORD=your-16-char-app-password",
        "",
        "# frontend/.env - Client Environment Configuration",
        "VITE_API_URL=http://localhost:5000/api"
    ])
    
    builder.draw_section_h2("Production Build & Launch Commands")
    builder.draw_bullet("Backend Launch (Node.js)", "cd server && npm install && npm run dev (or node server.js)")
    builder.draw_bullet("Backend Launch (FastAPI)", "cd server && source venv/bin/activate && python app.py")
    builder.draw_bullet("Frontend Build & Deploy", "cd frontend && npm install && npm run build (Outputs optimized dist/ bundle)")
    
    # ------------------ CONCLUSION ------------------ #
    builder.draw_section_h1("10. Conclusion & Quality Assurance")
    builder.draw_paragraph(
        "The UniCare Health Platform represents a robust, enterprise-grade architecture engineered for real-world "
        "clinical reliability. Through multi-tenant user isolation, dual-backend flexibility, sub-profile PIN vaults, "
        "live DNS mail server verification, and multimodal artificial intelligence, UniCare establishes a secure and unified "
        "standard for human and veterinary digital healthcare."
    )
    
    total_pages = builder.finalize()
    print(f"[SUCCESS] Generated {total_pages}-page PDF at: {pdf_path}")
    return pdf_path, total_pages

if __name__ == "__main__":
    build_unicare_document()
