#!/usr/bin/env python3
"""
Script pour corriger les chemins dans les fichiers HTML du dossier public/
- Remplace /static/ par ../static/
- Remplace les liens absolus par des liens relatifs
- Convertit les templates Jinja2 en HTML statiques
"""

import os
import re
from pathlib import Path

PUBLIC_DIR = Path("public")
BASE_HTML = PUBLIC_DIR / "base.html"

# Mapping des routes vers les fichiers HTML
ROUTE_MAP = {
    "/sloth-air": "Sloth-air.html",
    "/journaux": "journaux.html",
    "/boutique": "boutique.html",
    "/carte-costa-rica": "carte-costa-rica.html",
    "/jeu-paresseux": "jeu-paresseux.html",
    "/chat-equipe": "chat-equipe.html",
    "/visite-virtuelle": "visite-virtuelle.html",
    "/quiz": "quiz.html",
    "/meteo": "meteo.html",
    "/admin": "admin.html",
    "/journal": "journal.html",
    "/": "index.html",
}

def read_base_html():
    """Lit le contenu de base.html"""
    if not BASE_HTML.exists():
        return None
    return BASE_HTML.read_text(encoding='utf-8')

def convert_jinja_to_html(content, title, extra_css="", extra_js=""):
    """Convertit un template Jinja2 en HTML complet"""
    base_content = read_base_html()
    if not base_content:
        return content
    
    # Remplacer le titre
    content = re.sub(r'\{%\s*block\s+title\s*%\}[^%]*\{%\s*endblock\s*%\}', title, content)
    
    # Extraire le contenu du block content
    content_match = re.search(r'\{%\s*block\s+content\s*%\}(.*?)\{%\s*endblock\s*%\}', content, re.DOTALL)
    main_content = content_match.group(1) if content_match else ""
    
    # Extraire extra_css si présent
    css_match = re.search(r'\{%\s*block\s+extra_css\s*%\}(.*?)\{%\s*endblock\s*%\}', content, re.DOTALL)
    if css_match:
        extra_css = css_match.group(1)
    
    # Extraire extra_js si présent
    js_match = re.search(r'\{%\s*block\s+extra_js\s*%\}(.*?)\{%\s*endblock\s*%\}', content, re.DOTALL)
    if js_match:
        extra_js = js_match.group(1)
    
    # Remplacer dans base.html
    result = base_content
    result = re.sub(r'\{%\s*block\s+title\s*%\}[^%]*\{%\s*endblock\s*%\}', title, result)
    result = re.sub(r'\{%\s*block\s+content\s*%\}[^%]*\{%\s*endblock\s*%\}', main_content, result)
    result = re.sub(r'\{%\s*block\s+extra_css\s*%\}[^%]*\{%\s*endblock\s*%\}', extra_css, result)
    result = re.sub(r'\{%\s*block\s+extra_js\s*%\}[^%]*\{%\s*endblock\s*%\}', extra_js, result)
    
    return result

def fix_paths(content):
    """Corrige tous les chemins dans le contenu"""
    # Remplacer /static/ par ../static/
    content = content.replace('/static/', '../static/')
    
    # Remplacer les routes absolues par des chemins relatifs
    for route, filename in ROUTE_MAP.items():
        # Éviter de remplacer index.html par lui-même
        if route == "/" and filename == "index.html":
            continue
        # Remplacer les href="/route" et src="/route"
        content = re.sub(rf'(href|src)=["\']{re.escape(route)}["\']', rf'\1="{filename}"', content)
        # Remplacer les href="/route#anchor"
        content = re.sub(rf'href=["\']{re.escape(route)}(#[^"\']*)["\']', rf'href="{filename}\1"', content)
    
    return content

def process_html_file(filepath):
    """Traite un fichier HTML"""
    print(f"Traitement de {filepath}...")
    content = filepath.read_text(encoding='utf-8')
    original_content = content
    
    # Si c'est un template Jinja2
    if '{% extends' in content:
        # Extraire le titre
        title_match = re.search(r'\{%\s*block\s+title\s*%\}(.*?)\{%\s*endblock\s*%\}', content)
        title = title_match.group(1).strip() if title_match else "L'Odyssée du Paresseux"
        title = f"<title>{title}</title>"
        
        # Convertir en HTML complet
        content = convert_jinja_to_html(content, title)
    
    # Corriger les chemins
    content = fix_paths(content)
    
    # Écrire le fichier si modifié
    if content != original_content:
        filepath.write_text(content, encoding='utf-8')
        print(f"  ✓ {filepath} corrigé")
        return True
    else:
        print(f"  - {filepath} inchangé")
        return False

def main():
    """Fonction principale"""
    if not PUBLIC_DIR.exists():
        print(f"Erreur: Le dossier {PUBLIC_DIR} n'existe pas")
        return
    
    html_files = list(PUBLIC_DIR.glob("*.html"))
    print(f"Trouvé {len(html_files)} fichiers HTML à traiter\n")
    
    modified_count = 0
    for html_file in html_files:
        if html_file.name == "base.html":
            # Traiter base.html séparément (juste les chemins)
            content = html_file.read_text(encoding='utf-8')
            fixed_content = fix_paths(content)
            if fixed_content != content:
                html_file.write_text(fixed_content, encoding='utf-8')
                print(f"  ✓ {html_file} corrigé (chemins uniquement)")
                modified_count += 1
            continue
        
        if process_html_file(html_file):
            modified_count += 1
    
    print(f"\n✓ {modified_count} fichier(s) modifié(s)")

if __name__ == "__main__":
    main()

