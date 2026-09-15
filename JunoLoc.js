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
        conteneurAnnonces.innerHTML = "Erreur de chargement.";
        return;
    }

    conteneurAnnonces.innerHTML = '';

    annonces.forEach(annonce => {
        const div = document.createElement('div');
        div.className = `annonce ${annonce.est_contacte ? 'contacte' : ''}`;

        div.innerHTML = `
            <h3>${annonce.localisation || 'Localisation inconnue'} - ${annonce.loyer} €</h3>
            <p><a href="${annonce.lien}" target="_blank">Voir l'annonce originale</a></p>
            <label>
                <input type="checkbox" onchange="changerStatut('${annonce.id}', this.checked)" ${annonce.est_contacte ? 'checked' : ''}>
                Déjà contacté
            </label>
        `;
        conteneurAnnonces.appendChild(div);
    });
}

// Fonction pour mettre à jour le statut dans la base
window.changerStatut = async function (id, statut) {
    const { error } = await supabase
        .from('annonces')
        .update({ est_contacte: statut })
        .eq('id', id);

    if (error) console.error("Erreur de mise à jour", error);
    chargerAnnonces(); // Recharge la liste pour appliquer le changement visuel
}

// Lancement au démarrage
chargerAnnonces();