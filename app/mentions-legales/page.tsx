import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import MobileOfferStrip from "@/components/MobileOfferStrip";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { SITE } from "@/lib/site";

const TITLE = "Mentions légales — StrasClean";
const DESCRIPTION =
  "Mentions légales du site StrasClean — Nettoyage auto à domicile à Strasbourg et alentours.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/mentions-legales" },
  robots: { index: true, follow: true },
};

export default function MentionsLegales() {
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
          <span className="text-white/75">Mentions légales</span>
        </nav>

        <article className="prose prose-invert mx-auto max-w-3xl">
          <h1 className="h-display text-3xl font-bold text-white sm:text-4xl">
            Mentions légales
          </h1>
          <p className="mt-2 text-sm text-white/55">Dernière mise à jour : {updated}</p>

          <Section title="Éditeur du site">
            <p>
              <strong>StrasClean</strong>
              <br />
              <Field>Forme juridique : [À COMPLÉTER — ex : Micro-entreprise / SAS / SARL]</Field>
              <br />
              <Field>SIRET / SIREN : [À COMPLÉTER]</Field>
              <br />
              <Field>Numéro de TVA intracommunautaire : [À COMPLÉTER si applicable]</Field>
              <br />
              <Field>Adresse du siège : [À COMPLÉTER — adresse postale]</Field>
              <br />
              Téléphone : {SITE.phoneDisplay}
              <br />
              Email :{" "}
              <a href={`mailto:${SITE.email}`} className="text-brand-300 hover:text-brand-200">
                {SITE.email}
              </a>
              <br />
              <Field>Directeur de la publication : [À COMPLÉTER — Prénom NOM]</Field>
            </p>
          </Section>

          <Section title="Hébergement">
            <p>
              <Field>
                Hébergeur du site : [À COMPLÉTER — ex : OVH SAS, Hetzner, Contabo, etc.]
              </Field>
              <br />
              <Field>Adresse de l'hébergeur : [À COMPLÉTER]</Field>
            </p>
          </Section>

          <Section title="Activité">
            <p>
              StrasClean propose des prestations de nettoyage automobile à
              domicile dans l'eurométropole de Strasbourg : nettoyage intérieur,
              shampouinage de sièges, traitement des poils d'animaux, detailing
              complet et lavage extérieur à la main.
            </p>
          </Section>

          <Section title="Propriété intellectuelle">
            <p>
              L'ensemble du site (textes, images, photos, graphismes, logos,
              icônes, mise en page, structure technique) est la propriété
              exclusive de StrasClean ou de ses partenaires, et est protégé par
              les lois en vigueur sur la propriété intellectuelle. Toute
              reproduction, distribution, modification ou utilisation, totale
              ou partielle, sans autorisation préalable écrite, est interdite.
            </p>
          </Section>

          <Section title="Liens vers des sites tiers">
            <p>
              Le site peut contenir des liens vers des sites externes (notamment
              WhatsApp pour la prise de contact). StrasClean n'exerce aucun
              contrôle sur le contenu de ces sites tiers et décline toute
              responsabilité quant à leur contenu, leurs pratiques ou leur
              politique de confidentialité.
            </p>
          </Section>

          <Section title="Limitation de responsabilité">
            <p>
              Les informations présentées sur le site sont fournies à titre
              indicatif. Les tarifs affichés sont des prix « à partir de » et
              peuvent varier selon l'état du véhicule, sa taille et les options
              demandées. Un devis précis est confirmé avant chaque intervention.
            </p>
            <p>
              StrasClean s'efforce de maintenir le site accessible et à jour,
              mais ne peut garantir une disponibilité ininterrompue ni
              l'absence d'erreurs.
            </p>
          </Section>

          <Section title="Données personnelles">
            <p>
              Le traitement de vos données personnelles est détaillé dans notre{" "}
              <Link
                href="/politique-de-confidentialite"
                className="text-brand-300 hover:text-brand-200"
              >
                politique de confidentialité
              </Link>
              .
            </p>
          </Section>

          <Section title="Droit applicable et juridiction">
            <p>
              Le présent site est soumis au droit français. En cas de litige et
              à défaut de résolution amiable, les tribunaux français seront
              seuls compétents.
            </p>
          </Section>

          <p className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-4 text-sm text-amber-200/80">
            ⚠️ Ce document est un modèle. Les champs marqués <code>[À COMPLÉTER]</code>{" "}
            doivent être renseignés avec les vraies informations de l'entreprise
            avant publication. Pour une validation juridique complète, consultez
            un avocat ou un juriste.
          </p>
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
