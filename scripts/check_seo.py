#!/usr/bin/env python3
"""Dependency-free checks for this static site's crawlable pages. Run from any directory."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://taamoo.com'
# Utility files that live at the web root but are not crawlable pages:
# Google Search Console verification files are standalone by design.
EXCLUDED_HTML = {'googlea8c0b6289ffc7074.html', '404.html'}
class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.metas = {}; self.canonicals = []; self.links = []; self.ids = set()
        self.title = ''; self.jsonld = []; self.capture = None; self.buffer = ''
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        if tag == 'meta':
            key = a.get('name', a.get('property'))
            self.metas.setdefault(key, []).append(a.get('content', ''))
        if tag == 'link' and a.get('rel') == 'canonical': self.canonicals.append(a.get('href'))
        if tag == 'a' and a.get('href'): self.links.append(a['href'])
        if tag in ('img', 'script', 'link'):
            asset = a.get('src') or (a.get('href') if tag == 'link' and a.get('rel') == 'stylesheet' else None)
            if asset: self.links.append(asset)
            if tag == 'img' and a.get('srcset'):
                self.links.extend(item.strip().split()[0] for item in a['srcset'].split(',') if item.strip())
        if tag == 'title' or (tag == 'script' and a.get('type') == 'application/ld+json'):
            self.capture = tag; self.buffer = ''
    def handle_data(self, data):
        if self.capture: self.buffer += data
    def handle_endtag(self, tag):
        if self.capture == tag:
            if tag == 'title': self.title = self.buffer
            else: self.jsonld.append(json.loads(self.buffer))
            self.capture = None

def url_for(path):
    relative = path.relative_to(ROOT).as_posix()
    return BASE + '/' + (relative[:-10] if relative.endswith('index.html') else relative)

def main():
    pages = {url_for(p): Page(p.read_text()) for p in ROOT.rglob('*.html') if '.git' not in p.parts and 'graphify-out' not in p.parts and p.name not in EXCLUDED_HTML}
    errors = []; titles = set(); descriptions = set(); inbound = {url: [] for url in pages}
    for url, page in pages.items():
        def require(ok, message):
            if not ok: errors.append(f'{url}: {message}')
        require(bool(page.title) and len(page.title) <= 70, 'missing or overlong title')
        require(page.title not in titles, 'duplicate title'); titles.add(page.title)
        descriptions_here = page.metas.get('description', [])
        require(len(descriptions_here) == 1 and 70 <= len(descriptions_here[0]) <= 175, 'description missing, duplicate or outside editorial range')
        require(str(descriptions_here) not in descriptions, 'duplicate description'); descriptions.add(str(descriptions_here))
        require(page.canonicals == [url], 'canonical mismatch')
        require(page.metas.get('og:url') == [url], 'OG URL mismatch')
        require(bool(page.jsonld), 'missing JSON-LD')
        for graph in page.jsonld:
            require(graph.get('@context') == 'https://schema.org' and bool(graph.get('@graph')), 'invalid JSON-LD graph')
        for href in page.links:
            u = urlsplit(href)
            if u.scheme and u.scheme not in ('http', 'https'): continue
            if u.netloc and u.netloc != 'taamoo.com': continue
            from urllib.parse import urljoin
            target = urlsplit(urljoin(url, href)); absolute = BASE + target.path
            file = ROOT / unquote(target.path).lstrip('/')
            if file.is_dir(): file /= 'index.html'
            require(file.is_file(), f'broken local target {href}')
            if absolute in pages:
                if absolute != url: inbound[absolute].append(url)
                require(not target.fragment or unquote(target.fragment) in pages[absolute].ids, f'missing fragment {href}')
    seen = set(); pending = [BASE + '/']
    while pending:
        url = pending.pop()
        if url in seen: continue
        seen.add(url)
        from urllib.parse import urljoin
        for link in pages[url].links:
            target = urlsplit(urljoin(url, link)); clean = f'{target.scheme}://{target.netloc}{target.path}'
            if clean in pages and clean not in seen: pending.append(clean)
    errors += [f'{u}: not reachable from homepage' for u in pages if u not in seen]
    sitemap = ET.parse(ROOT / 'sitemap.xml')
    listed = [n.text for n in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    if set(listed) != set(pages) or len(listed) != len(pages): errors.append('Sitemap must list every canonical HTML page once')
    if 'Sitemap: '+BASE+'/sitemap.xml' not in (ROOT / 'robots.txt').read_text(): errors.append('Missing sitemap in robots.txt')
    missing_page = Page((ROOT / '404.html').read_text()) if (ROOT / '404.html').exists() else None
    if missing_page and 'noindex' not in ','.join(missing_page.metas.get('robots', [])):
        errors.append('Custom 404 page must not be indexed')
    if errors: raise SystemExit('\n'.join(errors))
    print(f'PASS: {len(pages)} pages; unique metadata, canonical and OG URLs, JSON-LD parsing, local links/assets/fragments, homepage reachability, sitemap coverage and robots declaration.')
if __name__ == '__main__': main()
