import type { ErrorCodeRegistry } from "@/types"

export const errorCodes: ErrorCodeRegistry[] = [
  {
    code: "ERR-1-30001-001",
    type: "ERR",
    categorie: "Saisie",
    sousCategorieDsn: "30001",
    nom: "NIR",
    description: "NIR absent",
    causePossible:
      "Saisie manquante. Champ NIR non renseigné à l'embauche. Oubli lors de la création de la fiche salarié dans le SIRH.",
    solution:
      "Renseigner le NIR du salarié. Demander la carte Vitale ou l'attestation de sécurité sociale.",
    responsable: "RH, SIRH/IT, Salarié",
    exemple: "(vide), null, chaîne vide",
    liens: "",
    statut: "Non actif",
    priorite: "Haute",
    dateAjout: "2026-06-25",
    derniereMiseAJour: "2026-06-25",
  },
  {
    code: "ERR-1-30001-002",
    type: "ERR",
    categorie: "Saisie",
    sousCategorieDsn: "30001",
    nom: "NIR",
    description: "NIR contient caractères non numériques",
    causePossible:
      "Saisie erronée avec lettres ou symboles. Copier-coller depuis un document contenant des caractères parasites.",
    solution:
      "Supprimer les caractères non numériques. Corriger le NIR à partir de la carte Vitale.",
    responsable: "RH, G2S Cortex",
    exemple: "ABC123456789012, NIR avec espaces ou tirets non nettoyés",
    liens: "",
    statut: "Non actif",
    priorite: "Haute",
    dateAjout: "2026-06-25",
    derniereMiseAJour: "2026-06-25",
  },
  {
    code: "ERR-1-30001-003",
    type: "ERR",
    categorie: "Saisie",
    sousCategorieDsn: "30001",
    nom: "NIR",
    description: "NIR longueur incorrecte",
    causePossible:
      "Saisie incomplète ou trop longue. Troncature lors de l'export SIRH vers DSN.",
    solution:
      "Corriger la longueur selon la norme NIR. Vérifier le NIR complet sur la carte Vitale.",
    responsable: "RH, SIRH/IT",
    exemple: "123456789012, 12345678901234567",
    liens: "",
    statut: "Non actif",
    priorite: "Haute",
    dateAjout: "2026-06-25",
    derniereMiseAJour: "2026-06-25",
  },
  {
    code: "WRN-2-30001-001",
    type: "WRN",
    categorie: "Paramétrique",
    sousCategorieDsn: "30001",
    nom: "NIR",
    description: "Clé de contrôle invalide mais autres identifiants concordent",
    causePossible:
      "Erreur de saisie isolée. Inversion de deux chiffres lors de la saisie.",
    solution:
      "Vérifier et corriger la clé ou valider via matricule et nom. Recalculer la clé de contrôle mod97.",
    responsable: "RH",
    exemple: "Clé mod97 invalide",
    liens: "",
    statut: "Non actif",
    priorite: "Moyenne",
    dateAjout: "2026-06-25",
    derniereMiseAJour: "2026-06-25",
  },
  {
    code: "ERR-1-30001-004",
    type: "ERR",
    categorie: "Saisie",
    sousCategorieDsn: "30001",
    nom: "NIR",
    description: "Clé de contrôle invalide et aucune autre identification concordante",
    causePossible:
      "NIR incorrect ou usurpation. Erreur de saisie multiple rendant le NIR totalement invalide.",
    solution:
      "Demander la vérification RH et corriger. Exiger un justificatif d'identité et la carte Vitale.",
    responsable: "RH, Service juridique",
    exemple: "Clé mod97 invalide et pas de concordance",
    liens: "",
    statut: "Non actif",
    priorite: "Haute",
    dateAjout: "2026-06-25",
    derniereMiseAJour: "2026-06-25",
  },
]
