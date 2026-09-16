// Initialisation de Supabase
const supabaseUrl = 'https://hqujoqvlpzdzmtiuwmqm.supabase.co';
const supabaseKey = 'TeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxdWpvcXZscHpkem10aXV3bXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NjQ3ODYsImV4cCI6MjEwNTA0MDc4Nn0.R_jpqTxf8nSm6aDXVkCNRwydPvP8Zfpc9Rlvo3q64Og';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const conteneurAnnonces = document.getElementById('liste-annonces');

// Fonction pour récupérer et afficher les données
async function chargerAnnonces() {
    // Requête : on récupère tout, trié par date décroissante
    let { data: annonces, error } = await supabase
        .from('annonces')
        .select('*')
        .order('date_ajout', { ascending: false });

    if (error) {
        console.error("Erreur de chargement", error);
        conteneurAnnonces.innerHTML = "<div style='padding:20px; text-align:center; color:red;'>Erreur de chargement de la base de données. Vérifiez les permissions.</div>";
        return;
    }

    if (!annonces || annonces.length === 0) {
        conteneurAnnonces.innerHTML = `
            <div style="text-align:center; padding: 40px 20px; color: #8e8e93;">
                <h2>Aucune annonce</h2>
                <p>Vos annonces apparaîtront ici après les avoir partagées depuis LeBonCoin ou SeLoger.</p>
            </div>
        `;
        return;
    }

    conteneurAnnonces.innerHTML = '';

    annonces.forEach(annonce => {
        const estContacte = annonce.statut && annonce.statut !== 'À contacter';
        
        const div = document.createElement('div');
        div.className = 'annonce-card';
        div.innerHTML = `
            ${annonce.image_url ? `<img src="${annonce.image_url}" class="image-preview" alt="Photo">` : `<div class="image-preview" style="display:flex;align-items:center;justify-content:center;color:#8e8e93;">Aucune image</div>`}
            <div class="card-content">
                <div class="annonce-header">
                    <h3 class="titre">${annonce.titre || annonce.localisation || 'Bien sans titre'}</h3>
                    <p class="prix">${annonce.loyer ? annonce.loyer + ' €' : 'Prix non renseigné'}</p>
                    ${annonce.surface ? `<p style="font-size:14px; color:#8e8e93; margin:4px 0 0 0;">${annonce.surface} m²</p>` : ''}
                </div>
                
                <div class="status-toggle">
                    <label style="display:flex; align-items:center;">
                        <input type="checkbox" onchange="changerStatut('${annonce.id}', this.checked)" ${estContacte ? 'checked' : ''}>
                        Contacté
                    </label>
                    <span style="font-size:13px; color:#8e8e93;">${annonce.statut || 'À contacter'}</span>
                </div>
                
                <div class="actions">
                    <a href="${annonce.lien}" target="_blank" class="btn btn-outline">Voir l'annonce</a>
                    <a href="annonce.html?id=${annonce.id}" class="btn btn-primary">Éditer</a>
                </div>
            </div>
        `;
        conteneurAnnonces.appendChild(div);
    });
}

// Fonction pour mettre à jour le statut dans la base
window.changerStatut = async function (id, isChecked) {
    const nouveauStatut = isChecked ? 'Dossier envoyé' : 'À contacter';
    const { error } = await supabase
        .from('annonces')
        .update({ statut: nouveauStatut })
        .eq('id', id);

    if (error) console.error("Erreur de mise à jour", error);
    chargerAnnonces(); // Recharge la liste pour appliquer le changement visuel
}

// Lancement au démarrage
chargerAnnonces();