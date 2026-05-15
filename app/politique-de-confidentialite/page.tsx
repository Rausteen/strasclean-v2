import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import MobileOfferStrip from "@/components/MobileOfferStrip";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { SITE } from "@/lib/site";

const TITLE = "Politique de confidentialité — StrasClean";
const DESCRIPTION =
  "Politique de confidentialité du site StrasClean — Comment vos données personnelles sont collectées, utilisées et protégées.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/politique-de-confidentialite" },
  robots: { index: true, follow: true },
};

export default function Politique() {
  const updated = "Mai 2026";

  return (
    <>
      <Header />
      <MobileOfferStrip />
      <main className="container-x py-10 sm:py-16">
        <nav aria-label="Fil d'ariane" className="mb-6 text-xs">
          <Link href="/" className="font-medium text-white/55 hover:text-white/80">
            StrasClean
          </Link>
          <span className="mx-1.5 text-white/30">/</span>
          <span className="text-white/75">Politique de confidentialité</span>
        </nav>

        <article className="mx-auto max-w-3xl">
          <h1 className="h-display text-3xl font-bold text-white sm:text-4xl">
            Politique de confidentialité
          </h1>
          <p className="mt-2 text-sm text-white/55">Dernière mise à jour : {updated}</p>

          <p className="mt-6 text-[15px] leading-relaxed text-white/75">
            StrasClean accorde une grande importance à la protection de vos
            données personnelles. Cette politique décrit les données que nous
            collectons via ce site, à quoi elles servent, combien de temps nous
            les conservons, et les droits dont vous disposez en application du
            Règlement Général sur la Protection des Données (RGPD) et de la loi
            « Informatique et Libertés ».
          </p>

          <Section title="1. Responsable du traitement">
            <p>
              <strong>StrasClean</strong>
              <br />
              Forme juridique : Micro-entreprise (entreprise individuelle)
              <br />
              SIRET : 123 456 789 00012
              <br />
              Adresse : 12 rue de la Mésange, 67000 Strasbourg
              <br />
              Email :{" "}
              <a href={`mailto:${SITE.email}`} className="text-brand-300 hover:text-brand-200">
                {SITE.email}
              </a>
              <br />
              Téléphone : {SITE.phoneDisplay}
              <br />
              Représentant légal : Bruno Durant
            </p>
          </Section>

          <Section title="2. Données collectées">
            <h3 className="h-display mt-4 text-base font-semibold text-white">
              a) Données de navigation (automatiques)
            </h3>
            <p>
              Lorsque vous visitez le site, certaines informations techniques
              sont enregistrées automatiquement à des fins d'analyse de trafic
              et de mesure de performance publicitaire :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-white/75">
              <li>Adresse IP</li>
              <li>Type d'appareil, système d'exploitation, navigateur</li>
              <li>Pages visitées et durée des visites</li>
              <li>Site d'origine (referer), source du trafic</li>
              <li>Paramètres UTM, identifiants de clic publicitaire (gclid, fbclid)</li>
              <li>Clics sur les boutons WhatsApp et téléphone</li>
            </ul>

            <h3 className="h-display mt-6 text-base font-semibold text-white">
              b) Données fournies volontairement
            </h3>
            <p>
              Lorsque vous nous contactez (par WhatsApp, téléphone ou email)
              pour réserver une prestation, vous nous communiquez :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-white/75">
              <li>Vos nom et prénom</li>
              <li>Votre numéro de téléphone</li>
              <li>Votre adresse d'intervention</li>
              <li>Des informations sur votre véhicule (parfois avec photos)</li>
            </ul>
          </Section>

          <Section title="3. Finalités et bases légales">
            <table className="mt-3 w-full text-sm">
              <thead className="text-left text-white/55 uppercase tracking-wider">
                <tr>
                  <th className="pb-2 pr-3">Finalité</th>
                  <th className="pb-2">Base légale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white/80">
                <tr>
                  <td className="py-2 pr-3">Mesure d'audience interne du site</td>
                  <td className="py-2">Intérêt légitime</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">Mesure de performance des campagnes publicitaires</td>
                  <td className="py-2">Intérêt légitime</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">Réponse aux demandes de réservation</td>
                  <td className="py-2">Mesures précontractuelles à votre demande</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">Réalisation des prestations de nettoyage</td>
                  <td className="py-2">Exécution du contrat</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">Respect des obligations légales et comptables</td>
                  <td className="py-2">Obligation légale</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Section title="4. Durée de conservation">
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-white/75">
              <li>
                <strong>Données de navigation</strong> (IP, User-Agent, pages) : 13 mois maximum,
                conformément aux recommandations de la CNIL.
              </li>
              <li>
                <strong>Données client</strong> (réservations, factures) : 3 ans après la dernière
                prestation pour les besoins commerciaux, jusqu'à 10 ans pour les obligations
                comptables.
              </li>
              <li>
                <strong>Échanges WhatsApp / email</strong> : durée nécessaire à la relation
                commerciale, puis archivés ou supprimés.
              </li>
            </ul>
          </Section>

          <Section title="5. Destinataires de vos données">
            <p>
              Vos données sont accessibles à :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-white/75">
              <li>Le personnel de StrasClean strictement nécessaire à la prestation</li>
              <li>
                Notre hébergeur (stockage technique sécurisé du site et de la base
                de données analytique) — OVH SAS, 2 rue Kellermann, 59100 Roubaix, France
              </li>
              <li>
                <strong>Google LLC</strong> (Google Ads, Google Tag) pour la mesure d'audience et
                la performance publicitaire — données pseudonymisées
              </li>
              <li>
                Le cas échéant, notre comptable / expert-comptable pour les obligations légales
              </li>
            </ul>
          </Section>

          <Section title="6. Transferts hors Union européenne">
            <p>
              Certains de nos prestataires (notamment Google) peuvent traiter des
              données aux États-Unis. Ces transferts sont encadrés par les
              clauses contractuelles types de la Commission européenne (article 46
              du RGPD) ainsi que par le cadre de protection des données{" "}
              <em>EU-US Data Privacy Framework</em>.
            </p>
          </Section>

          <Section title="7. Cookies et traceurs">
            <p>
              Le site dépose les cookies suivants :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-white/75">
              <li>
                <strong>Google Ads (gtag)</strong> — mesure des conversions
                (clics WhatsApp / téléphone après une annonce). Durée : 90 jours.
              </li>
              <li>
                <strong>Cookie de session admin</strong> (réservé à l'administrateur
                du site, non visible pour les visiteurs).
              </li>
            </ul>
            <p className="mt-3">
              Vous pouvez à tout moment paramétrer votre navigateur pour bloquer
              ces cookies. Le blocage des cookies de mesure d'audience n'affecte
              pas le fonctionnement du site.
            </p>
          </Section>

          <Section title="8. Sécurité des données">
            <p>
              Le site est servi en HTTPS. Les données collectées sont stockées
              sur des serveurs sécurisés. L'accès au panneau d'administration
              est protégé par un mot de passe et un cookie de session signé.
              Aucune donnée bancaire n'est traitée ni stockée sur le site (les
              paiements ont lieu directement sur place lors de la prestation).
            </p>
          </Section>

          <Section title="9. Vos droits">
            <p>
              Conformément au RGPD, vous disposez des droits suivants sur vos
              données personnelles :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-white/75">
              <li>Droit d'accès</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement (« droit à l'oubli »)</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit d'opposition</li>
              <li>Droit à la portabilité de vos données</li>
              <li>Droit de définir des directives relatives au sort de vos données après votre décès</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez-nous à{" "}
              <a href={`mailto:${SITE.email}`} className="text-brand-300 hover:text-brand-200">
                {SITE.email}
              </a>
              . Vous pouvez également introduire une réclamation auprès de la
              CNIL :{" "}
              <a
                href="https://www.cnil.fr/fr/plaintes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-300 hover:text-brand-200"
              >
                www.cnil.fr/fr/plaintes
              </a>
              .
            </p>
          </Section>

          <Section title="10. Modifications">
            <p>
              StrasClean peut être amené à modifier la présente politique de
              confidentialité à tout moment. La date de dernière mise à jour est
              indiquée en haut de cette page.
            </p>
          </Section>

        </article>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="h-display text-xl font-semibold text-white sm:text-2xl">{title}</h2>
      <div className="mt-3 text-[15px] leading-relaxed text-white/75">{children}</div>
    </section>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <span className="text-amber-200/80">{children}</span>;
}
