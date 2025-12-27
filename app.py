from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import requests
import json
from datetime import datetime

app = Flask(__name__, static_folder='static', template_folder='templates', static_url_path='/static')
CORS(app)

# Clé API HuggingFace depuis les variables d'environnement
HF_API_KEY = os.environ.get("HF_API_KEY", "")
# Utiliser le router HuggingFace avec format OpenAI (comme dans AI.MD)
HF_API_URL = "https://router.huggingface.co/v1/chat/completions"
HF_MODEL = "moonshotai/Kimi-K2-Instruct-0905"

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/sloth-air')
def sloth_air():
    return render_template('Sloth-air.html')

@app.route('/carte-costa-rica')
def carte_costa_rica():
    return render_template('carte-costa-rica.html')

@app.route('/jeu-paresseux')
def jeu_paresseux():
    return render_template('jeu-paresseux.html')

@app.route('/chat-equipe')
def chat_equipe():
    return render_template('chat-equipe.html')

@app.route('/visite-virtuelle')
def visite_virtuelle():
    return render_template('visite-virtuelle.html')

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/meteo')
def meteo():
    return render_template('meteo.html')

# Contexte du projet pour l'AI
PROJECT_CONTEXT = """
L'Odyssée du Paresseux est une organisation de conservation dédiée à la protection des paresseux et de leur habitat au Costa Rica.

INFORMATIONS SUR L'ORGANISATION:
- Directeur: Ahmad
- Bureau Principal: Laval, Canada
- Contact: info.ahmadnature@gmail.com
- Mission: Protéger les paresseux et leur habitat naturel au Costa Rica

PROJET SLOTH AIR:
Le projet principal est "Sloth Air", un jet privé personnalisé avec un intérieur inspiré de la jungle et des paresseux. Ce jet servira de moyen de transport pour Ahmad afin de se rendre au Costa Rica et d'autres destinations de conservation.

NIVEAUX DE CONTRIBUTION:
- Billet Économie (5$-25$): Carte d'Embarquement Numérique + Vidéos Exclusives
- Valise Cabine (26$-50$): Récompenses précédentes + Accès au Journal de Bord numérique
- Fenêtre Hublot (51$-75$): Récompenses précédentes + Photo sur la Plaque de Remerciement Virtuelle
- Siège Confort (76$-100$): Récompenses précédentes + 10 Cartes de Collection + Fichiers 3D
- Salon VIP (101$-125$): Récompenses précédentes + 2 T-shirts Exclusifs Sloth Air
- Cadeau Gastronomique (126$-150$): Toutes les récompenses précédentes + Tasse personnalisée
- Kit de Voyage (151$-175$): Toutes les récompenses précédentes + Bouteille réutilisable
- Réunion (176$-200$): Toutes les récompenses précédentes + Discussion Vidéo de 30 min avec Ahmad
- Membre de l'Équipage (201$-225$): Toutes les récompenses précédentes + Nom Gravé sur une plaque dans le jet
- Plan de Vol (226$-250$): Toutes les récompenses précédentes + Statut du Fondateur
- Pilote Privilégié (251$-275$): Toutes les récompenses précédentes + Discussion vidéo de 1h avec Ahmad
- Héros de la Canopée (276$-300$): Toutes les récompenses précédentes + Kit d'aventure complet signé par Ahmad

ZONES DE CONSERVATION:
- Monteverde: Forêt nuageuse, 15 paresseux observés
- Manuel Antonio: Parc national, 8 paresseux observés
- Tortuguero: Canaux et forêt tropicale humide, 12 paresseux observés

ACTIVITÉS DE CONSERVATION:
- Achat et surveillance de parcelles de forêts menacées
- Création de ponts de canopée pour la traversée sécurisée des paresseux
- Surveillance anti-braconnage
- Programmes d'éducation locaux pour les communautés

FONCTIONNALITÉS DU SITE:
- Galerie de photos de paresseux
- Carte interactive du Costa Rica
- Jeu interactif avec paresseux
- Visite virtuelle du Costa Rica
- Quiz sur les paresseux et le Costa Rica
- Météo du Costa Rica
- Système de dons
- Témoignages de donateurs
- Plaque de remerciement virtuelle pour les donateurs du niveau "Fenêtre Hublot"

IMPORTANT: Tu dois uniquement répondre aux questions qui concernent L'Odyssée du Paresseux, le projet Sloth Air, les paresseux, le Costa Rica, la conservation, les dons, ou le site web. Si une question n'a aucun rapport avec ces sujets, réponds poliment que tu es spécialisé dans ces domaines et que tu ne peux aider qu'avec des questions liées au projet.
"""

def getFallbackResponse(user_message):
    """Réponses de fallback basées sur des mots-clés"""
    message_lower = user_message.lower()
    
    if any(word in message_lower for word in ['bonjour', 'salut', 'hello', 'hi']):
        return "Bonjour ! 👋 Je suis là pour vous aider avec tout ce qui concerne L'Odyssée du Paresseux et le projet Sloth Air. Que souhaitez-vous savoir ? 🦥"
    
    if any(word in message_lower for word in ['paresseux', 'sloth']):
        return "Les paresseux sont des créatures fascinantes ! 🦥 Ils passent la plupart de leur temps dans les arbres et ne descendent qu'une fois par semaine. Notre organisation travaille à protéger leur habitat au Costa Rica. Voulez-vous en savoir plus ?"
    
    if any(word in message_lower for word in ['don', 'donner', 'contribution', 'payer']):
        return "Merci de votre intérêt ! 💚 Vous pouvez faire un don via le formulaire sur notre site. Nous avons plusieurs niveaux de contribution, de 5$ (Billet Économie) à 300$ (Héros de la Canopée). Chaque contribution soutient nos efforts de conservation !"
    
    if any(word in message_lower for word in ['sloth air', 'jet', 'avion']):
        return "Sloth Air est notre projet ambitieux de créer un jet privé personnalisé ! ✈️ L'intérieur sera inspiré de la jungle avec des plantes, des lianes et des décorations de paresseux. Ce jet servira à transporter Ahmad au Costa Rica pour nos missions de conservation."
    
    if any(word in message_lower for word in ['ahmad', 'directeur']):
        return "Ahmad est notre directeur passionné par la conservation ! 👨‍💼 Il coordonne toutes nos opérations depuis Laval et dirige la stratégie de collecte de fonds. Il se rend régulièrement au Costa Rica pour nos missions sur le terrain."
    
    if any(word in message_lower for word in ['costa rica', 'costarica']):
        return "Le Costa Rica est un paradis pour la biodiversité ! 🗺️ Nous travaillons dans plusieurs zones de conservation : Monteverde (forêt nuageuse), Manuel Antonio (parc national), et Tortuguero (canaux et forêt tropicale)."
    
    if any(word in message_lower for word in ['contact', 'email', 'mail']):
        return "Vous pouvez nous contacter à info.ahmadnature@gmail.com 📧 ou utiliser le formulaire de contact sur notre site. Notre bureau principal est situé à Laval, Canada."
    
    # Réponse par défaut
    return "Je suis spécialisé dans L'Odyssée du Paresseux et le projet Sloth Air. 🦥 Je peux vous aider avec des questions sur les paresseux, le Costa Rica, la conservation, les dons, ou notre projet. Posez-moi une question sur ces sujets !"

@app.route('/api/chat', methods=['POST'])
def chat():
    # #region agent log
    import json
    log_file = '/Users/OmranN/Desktop/ONTech-cloud-technology/Mimo/.cursor/debug.log'
    with open(log_file, 'a') as f:
        f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"A","location":"app.py:chat","message":"API chat endpoint called","data":{"method":request.method},"timestamp":int(__import__('time').time()*1000)}) + '\n')
    # #endregion
    try:
        data = request.json
        user_message = data.get('message', '')
        
        # #region agent log
        with open(log_file, 'a') as f:
            f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"A","location":"app.py:chat","message":"Request data received","data":{"has_message":bool(user_message),"message_length":len(user_message) if user_message else 0},"timestamp":int(__import__('time').time()*1000)}) + '\n')
        # #endregion
        
        if not user_message:
            return jsonify({'error': 'Message vide'}), 400
        
        # Préparer le prompt avec le contexte (format OpenAI messages)
        system_prompt = f"""Tu es un assistant spécialisé pour L'Odyssée du Paresseux. Tu connais parfaitement le projet Sloth Air et toutes les informations sur l'organisation.

{PROJECT_CONTEXT}

Réponds de manière amicale, professionnelle et informative. Utilise des emojis appropriés (🦥, 🌿, ✈️, etc.). Si la question n'a aucun rapport avec le projet, dis poliment que tu es spécialisé dans L'Odyssée du Paresseux et que tu ne peux répondre qu'aux questions liées au projet."""

        # Appel à l'API HuggingFace Router (format OpenAI)
        headers = {
            "Authorization": f"Bearer {HF_API_KEY}",
            "Content-Type": "application/json"
        }
        
        # Format OpenAI messages pour le router HuggingFace
        payload = {
            "model": HF_MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            "max_tokens": 250,
            "temperature": 0.7
        }
        
        # #region agent log
        with open(log_file, 'a') as f:
            f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"B","location":"app.py:chat","message":"Payload prepared","data":{"prompt_length":len(full_prompt),"prompt_preview":full_prompt[:100]},"timestamp":int(__import__('time').time()*1000)}) + '\n')
        # #endregion
        
        try:
            # #region agent log
            with open(log_file, 'a') as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"B","location":"app.py:chat","message":"Calling HuggingFace API","data":{"url":HF_API_URL,"has_key":bool(HF_API_KEY)},"timestamp":int(__import__('time').time()*1000)}) + '\n')
            # #endregion
            
            response = requests.post(HF_API_URL, headers=headers, json=payload, timeout=30)
            
            # #region agent log
            response_text_preview = response.text[:500] if hasattr(response, 'text') else "No text"
            try:
                response_json = response.json() if response.status_code == 200 else None
                response_type = type(response_json).__name__ if response_json else "error"
            except:
                response_json = None
                response_type = "parse_error"
            with open(log_file, 'a') as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"B","location":"app.py:chat","message":"HuggingFace API response","data":{"status_code":response.status_code,"response_type":response_type,"response_preview":response_text_preview},"timestamp":int(__import__('time').time()*1000)}) + '\n')
            # #endregion
            
            if response.status_code == 200:
                result = response.json()
                
                # #region agent log
                with open(log_file, 'a') as f:
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"C","location":"app.py:chat","message":"Raw API response","data":{"result_type":type(result).__name__,"result_keys":list(result.keys()) if isinstance(result, dict) else "N/A","result_preview":str(result)[:500]},"timestamp":int(__import__('time').time()*1000)}) + '\n')
                # #endregion
                
                # Format OpenAI response: result.choices[0].message.content
                if isinstance(result, dict) and 'choices' in result:
                    if len(result['choices']) > 0 and 'message' in result['choices'][0]:
                        ai_response = result['choices'][0]['message'].get('content', '')
                    else:
                        ai_response = ''
                else:
                    # Fallback pour autres formats
                    ai_response = result.get('generated_text', result.get('text', str(result)))
                
                # #region agent log
                with open(log_file, 'a') as f:
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"C","location":"app.py:chat","message":"Extracted response from OpenAI format","data":{"response_preview":ai_response[:200] if ai_response else "None","response_length":len(ai_response) if ai_response else 0},"timestamp":int(__import__('time').time()*1000)}) + '\n')
                # #endregion
                
                # Nettoyer la réponse
                ai_response = ai_response.strip() if ai_response else ''
                
                # #region agent log
                with open(log_file, 'a') as f:
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"C","location":"app.py:chat","message":"Cleaned AI response","data":{"response_preview":ai_response[:200] if ai_response else "None","response_length":len(ai_response) if ai_response else 0,"is_empty":not ai_response,"is_short":len(ai_response) < 10 if ai_response else True},"timestamp":int(__import__('time').time()*1000)}) + '\n')
                # #endregion
                
                # Si la réponse est vide ou trop courte, utiliser un fallback
                if not ai_response or len(ai_response) < 10:
                    # #region agent log
                    with open(log_file, 'a') as f:
                        f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"C","location":"app.py:chat","message":"Using fallback response","data":{},"timestamp":int(__import__('time').time()*1000)}) + '\n')
                    # #endregion
                    ai_response = getFallbackResponse(user_message)
                
                # #region agent log
                with open(log_file, 'a') as f:
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"D","location":"app.py:chat","message":"Returning final response","data":{"response_preview":ai_response[:50] if ai_response else "None"},"timestamp":int(__import__('time').time()*1000)}) + '\n')
                # #endregion
                
                return jsonify({'response': ai_response})
            else:
                # Si erreur API, utiliser fallback
                # #region agent log
                with open(log_file, 'a') as f:
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"B","location":"app.py:chat","message":"API returned error status","data":{"status_code":response.status_code,"response_text":response.text[:200]},"timestamp":int(__import__('time').time()*1000)}) + '\n')
                # #endregion
                print(f"Erreur API HuggingFace: {response.status_code} - {response.text}")
                return jsonify({'response': getFallbackResponse(user_message)}), 200
                
        except requests.exceptions.Timeout:
            # #region agent log
            with open(log_file, 'a') as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"B","location":"app.py:chat","message":"API timeout exception","data":{},"timestamp":int(__import__('time').time()*1000)}) + '\n')
            # #endregion
            return jsonify({'response': 'Le service prend trop de temps à répondre. Veuillez réessayer. 🦥'}), 200
        except requests.exceptions.RequestException as e:
            # #region agent log
            with open(log_file, 'a') as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"B","location":"app.py:chat","message":"Request exception","data":{"error_type":type(e).__name__,"error_msg":str(e)[:200]},"timestamp":int(__import__('time').time()*1000)}) + '\n')
            # #endregion
            print(f"Erreur requête: {e}")
            return jsonify({'response': getFallbackResponse(user_message)}), 200
            
    except Exception as e:
        # #region agent log
        with open(log_file, 'a') as f:
            f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"E","location":"app.py:chat","message":"General exception in chat endpoint","data":{"error_type":type(e).__name__,"error_msg":str(e)[:200]},"timestamp":int(__import__('time').time()*1000)}) + '\n')
        # #endregion
        print(f"Erreur chat API: {e}")
        return jsonify({'response': 'Désolé, une erreur est survenue. Veuillez réessayer. 🦥'}), 200

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/journaux')
def journaux():
    return render_template('journaux.html')

@app.route('/boutique')
def boutique():
    return render_template('boutique.html')

@app.route('/journal')
def journal():
    return render_template('journal.html')

# Fichiers de données
PRODUCTS_FILE = 'data/products.json'
ORDERS_FILE = 'data/orders.json'

# Initialiser les fichiers de données s'ils n'existent pas
def init_data_files():
    os.makedirs('data', exist_ok=True)
    if not os.path.exists(PRODUCTS_FILE):
        with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)
    if not os.path.exists(ORDERS_FILE):
        with open(ORDERS_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)

# Routes API pour les produits
@app.route('/api/products', methods=['GET'])
def get_products():
    init_data_files()
    try:
        with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
            products = json.load(f)
        return jsonify(products)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/products', methods=['POST'])
def create_product():
    init_data_files()
    try:
        data = request.json
        required_fields = ['name', 'price', 'category', 'description', 'image']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Champs manquants'}), 400
        
        with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
            products = json.load(f)
        
        # Générer un ID unique
        new_id = max([p.get('id', 0) for p in products], default=0) + 1
        
        product = {
            'id': new_id,
            'name': data['name'],
            'price': float(data['price']),
            'category': data['category'],
            'description': data['description'],
            'image': data['image'],
            'stock': data.get('stock', 0),
            'created_at': datetime.now().isoformat()
        }
        
        products.append(product)
        
        with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        
        return jsonify(product), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    init_data_files()
    try:
        data = request.json
        with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
            products = json.load(f)
        
        product_index = next((i for i, p in enumerate(products) if p.get('id') == product_id), None)
        if product_index is None:
            return jsonify({'error': 'Produit non trouvé'}), 404
        
        # Mettre à jour le produit
        products[product_index].update({
            'name': data.get('name', products[product_index]['name']),
            'price': float(data.get('price', products[product_index]['price'])),
            'category': data.get('category', products[product_index]['category']),
            'description': data.get('description', products[product_index]['description']),
            'image': data.get('image', products[product_index]['image']),
            'stock': data.get('stock', products[product_index].get('stock', 0)),
            'updated_at': datetime.now().isoformat()
        })
        
        with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        
        return jsonify(products[product_index])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    init_data_files()
    try:
        with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
            products = json.load(f)
        
        products = [p for p in products if p.get('id') != product_id]
        
        with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        
        return jsonify({'message': 'Produit supprimé'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Routes API pour les commandes
@app.route('/api/orders', methods=['POST'])
def create_order():
    init_data_files()
    try:
        data = request.json
        required_fields = ['items', 'customer']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Champs manquants'}), 400
        
        with open(ORDERS_FILE, 'r', encoding='utf-8') as f:
            orders = json.load(f)
        
        # Calculer le total
        total = sum(item['price'] * item['quantity'] for item in data['items'])
        
        order = {
            'id': max([o.get('id', 0) for o in orders], default=0) + 1,
            'items': data['items'],
            'customer': data['customer'],
            'total': total,
            'status': 'en_attente',
            'created_at': datetime.now().isoformat()
        }
        
        orders.append(order)
        
        with open(ORDERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(orders, f, ensure_ascii=False, indent=2)
        
        return jsonify(order), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders', methods=['GET'])
def get_orders():
    init_data_files()
    try:
        with open(ORDERS_FILE, 'r', encoding='utf-8') as f:
            orders = json.load(f)
        return jsonify(orders)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    init_data_files()
    try:
        data = request.json
        status = data.get('status')
        if not status:
            return jsonify({'error': 'Statut manquant'}), 400
        
        with open(ORDERS_FILE, 'r', encoding='utf-8') as f:
            orders = json.load(f)
        
        order_index = next((i for i, o in enumerate(orders) if o.get('id') == order_id), None)
        if order_index is None:
            return jsonify({'error': 'Commande non trouvée'}), 404
        
        orders[order_index]['status'] = status
        orders[order_index]['updated_at'] = datetime.now().isoformat()
        
        with open(ORDERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(orders, f, ensure_ascii=False, indent=2)
        
        return jsonify(orders[order_index])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders/<int:order_id>/delete', methods=['PUT'])
def delete_order(order_id):
    init_data_files()
    try:
        with open(ORDERS_FILE, 'r', encoding='utf-8') as f:
            orders = json.load(f)
        
        order_index = next((i for i, o in enumerate(orders) if o.get('id') == order_id), None)
        if order_index is None:
            return jsonify({'error': 'Commande non trouvée'}), 404
        
        orders[order_index]['deleted'] = True
        orders[order_index]['deleted_at'] = datetime.now().isoformat()
        
        with open(ORDERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(orders, f, ensure_ascii=False, indent=2)
        
        return jsonify(orders[order_index])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders/<int:order_id>/notes', methods=['PUT'])
def update_order_notes(order_id):
    init_data_files()
    try:
        data = request.json
        notes = data.get('notes', '')
        
        with open(ORDERS_FILE, 'r', encoding='utf-8') as f:
            orders = json.load(f)
        
        order_index = next((i for i, o in enumerate(orders) if o.get('id') == order_id), None)
        if order_index is None:
            return jsonify({'error': 'Commande non trouvée'}), 404
        
        orders[order_index]['notes'] = notes
        orders[order_index]['updated_at'] = datetime.now().isoformat()
        
        with open(ORDERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(orders, f, ensure_ascii=False, indent=2)
        
        return jsonify(orders[order_index])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"🚀 Serveur démarré sur http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)

