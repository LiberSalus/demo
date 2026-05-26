from __future__ import annotations

import argparse
import base64
import html
import mimetypes
import re
from pathlib import Path


CSS = """
@page {
  size: A4;
  margin: 18mm 14mm 18mm 14mm;
}

:root {
  --text: #1f2937;
  --muted: #4b5563;
  --border: #d1d5db;
  --panel: #f8fafc;
  --code: #0f172a;
  --accent: #0f766e;
}

* {
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Arial, sans-serif;
  color: var(--text);
  line-height: 1.55;
  margin: 0;
  font-size: 12pt;
}

main {
  width: 100%;
}

h1, h2, h3, h4 {
  line-height: 1.2;
  color: #0f172a;
  margin: 1.2em 0 0.45em;
}

h1 {
  font-size: 24pt;
  border-bottom: 2px solid var(--accent);
  padding-bottom: 0.25em;
}

h2 {
  font-size: 18pt;
}

h3 {
  font-size: 14pt;
}

p {
  margin: 0.45em 0;
}

ul {
  margin: 0.3em 0 0.9em 1.2em;
  padding: 0;
}

li {
  margin: 0.18em 0;
}

pre {
  background: var(--code);
  color: #e5eef8;
  padding: 12px 14px;
  border-radius: 10px;
  overflow: hidden;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 10pt;
}

code {
  font-family: Consolas, "Courier New", monospace;
}

.image-block {
  margin: 1em 0 1.35em;
  text-align: center;
  page-break-inside: avoid;
}

.image-block img {
  max-width: 100%;
  max-height: 520px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: white;
}

.caption {
  margin-top: 0.4em;
  color: var(--muted);
  font-size: 10.5pt;
}

.section {
  page-break-inside: avoid;
}
"""


def normalize_image_refs(text: str) -> str:
  pattern = re.compile(r"!\[([^\]]*)\]\((.*?)\)", re.DOTALL)

  def _replace(match: re.Match[str]) -> str:
    alt = match.group(1)
    path = " ".join(match.group(2).split())
    return f"![{alt}]({path})"

  return pattern.sub(_replace, text)


def inline_image(base_dir: Path, alt: str, ref: str) -> str:
  image_path = (base_dir / ref).resolve()
  if not image_path.exists():
    return (
      f"<p><strong>Imagen no encontrada:</strong> {html.escape(ref)}"
      f"</p>"
    )

  mime = mimetypes.guess_type(image_path.name)[0] or "application/octet-stream"
  data = base64.b64encode(image_path.read_bytes()).decode("ascii")
  caption = f'<div class="caption">{html.escape(alt)}</div>' if alt else ""
  return (
    '<div class="image-block">'
    f'<img alt="{html.escape(alt)}" src="data:{mime};base64,{data}">'
    f"{caption}"
    "</div>"
  )


def render_inline(text: str) -> str:
  text = html.escape(text)
  text = re.sub(
    r"`([^`]+)`",
    lambda m: f"<code>{m.group(1)}</code>",
    text,
  )
  return text


def markdown_to_html(markdown_text: str, base_dir: Path) -> str:
  markdown_text = normalize_image_refs(markdown_text).replace("\r\n", "\n")
  lines = markdown_text.split("\n")

  blocks: list[str] = []
  paragraph: list[str] = []
  list_items: list[str] = []
  in_code = False
  code_lines: list[str] = []

  def flush_paragraph() -> None:
    if paragraph:
      text = " ".join(part.strip() for part in paragraph if part.strip())
      if text:
        blocks.append(f"<p>{render_inline(text)}</p>")
      paragraph.clear()

  def flush_list() -> None:
    if list_items:
      items = "".join(f"<li>{item}</li>" for item in list_items)
      blocks.append(f"<ul>{items}</ul>")
      list_items.clear()

  def flush_code() -> None:
    nonlocal in_code
    if in_code:
      code_html = html.escape("\n".join(code_lines))
      blocks.append(f"<pre><code>{code_html}</code></pre>")
      code_lines.clear()
      in_code = False

  for raw_line in lines:
    line = raw_line.rstrip()
    stripped = line.strip()

    if stripped.startswith("```"):
      flush_paragraph()
      flush_list()
      if in_code:
        flush_code()
      else:
        in_code = True
      continue

    if in_code:
      code_lines.append(raw_line)
      continue

    if not stripped:
      flush_paragraph()
      flush_list()
      continue

    image_only = re.fullmatch(r"!\[([^\]]*)\]\(([^)]+)\)", stripped)
    if image_only:
      flush_paragraph()
      flush_list()
      blocks.append(inline_image(base_dir, image_only.group(1), image_only.group(2)))
      continue

    if stripped.startswith("- "):
      flush_paragraph()
      bullet = stripped[2:].strip()
      bullet_image = re.fullmatch(r"!\[([^\]]*)\]\(([^)]+)\)", bullet)
      if bullet_image:
        item = inline_image(base_dir, bullet_image.group(1), bullet_image.group(2))
      else:
        item = render_inline(bullet)
      list_items.append(item)
      continue

    heading = re.fullmatch(r"(#{1,6})\s+(.*)", stripped)
    if heading:
      flush_paragraph()
      flush_list()
      level = len(heading.group(1))
      content = render_inline(heading.group(2).strip())
      blocks.append(f"<h{level}>{content}</h{level}>")
      continue

    paragraph.append(stripped)

  flush_paragraph()
  flush_list()
  flush_code()

  body = "\n".join(blocks)
  title = html.escape(base_dir.name)
  return f"""<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <style>{CSS}</style>
</head>
<body>
  <main>
    {body}
  </main>
</body>
</html>
"""


def main() -> int:
  parser = argparse.ArgumentParser()
  parser.add_argument("input_md", type=Path)
  parser.add_argument("output_html", type=Path)
  args = parser.parse_args()

  md_path = args.input_md.resolve()
  html_path = args.output_html.resolve()
  html_path.parent.mkdir(parents=True, exist_ok=True)

  markdown_text = md_path.read_text(encoding="utf-8")
  html_text = markdown_to_html(markdown_text, md_path.parent)
  html_path.write_text(html_text, encoding="utf-8")
  return 0


if __name__ == "__main__":
  raise SystemExit(main())
