import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

test("public landing presents the product without unsupported claims", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/INTELLIGENCE IMMOBILIER/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Gérez votre immobilier");
  await expect(page.getByText("APERÇU PRODUIT · DONNÉES FICTIVES", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Commencer gratuitement" }).first()).toHaveAttribute("href", "/register");
  await expect(page.getByRole("link", { name: "Explorer la démo" }).first()).toHaveAttribute("href", "/demo");
  await expect(page.locator("details")).toHaveCount(10);
  await expect(page.locator("body")).not.toContainText("Ils nous font confiance");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("login keeps demo credentials private and exposes the safe demo route", async ({ page }) => {
  await page.goto("/login");
  await expect(page.locator('input[name="email"]')).toHaveValue("");
  await expect(page.locator('input[name="password"]')).toHaveValue("");
  await expect(page.locator("body")).not.toContainText("Demo2026");
  await expect(page.getByRole("link", { name: "Explorer un environnement de démonstration" })).toHaveAttribute("href", "/demo");
});

test("real product tabs and structured AI demo are interactive", async ({ page }) => {
  await page.goto("/");
  const product = page.locator("#produit");
  await expect(product.getByRole("heading", { name: /Découvrez/ })).toBeVisible();
  await product.getByRole("tab", { name: "Paiements" }).click();
  await expect(product.getByRole("heading", { name: /vision claire de chaque encaissement/ })).toBeVisible();
  await expect(product.getByAltText(/module Paiements/)).toBeVisible();

  await product.getByRole("tab", { name: "Paiements" }).press("ArrowRight");
  await expect(product.getByRole("tab", { name: "Propriétaires" })).toHaveAttribute("aria-selected", "true");

  const ai = page.locator("#intelligence");
  await ai.getByRole("tab", { name: /Quels loyers/ }).click();
  await expect(ai.getByText("2 530 000 FCFA")).toBeVisible();
  await expect(ai.getByRole("button", { name: /Préparer les relances/ })).toBeVisible();

  await ai.getByRole("tab", { name: /Quels loyers/ }).press("End");
  await expect(ai.getByRole("tab", { name: /reversements propriétaires/ })).toHaveAttribute("aria-selected", "true");
});

test("marketing layout has no horizontal overflow at required breakpoints", async ({ page }) => {
  await page.goto("/");
  for (const width of [375, 390, 430, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(50);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `overflow at ${width}px`).toBe(true);
  }
});

test("mobile header keeps a concise primary action visible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const header = page.locator("header").first();
  await expect(header.getByRole("link", { name: "Commencer", exact: true })).toBeVisible();
  await expect(header.getByRole("button", { name: /navigation/i })).toBeVisible();
});

test("registration states and enforces the real password policy", async ({ page, request }) => {
  await page.goto("/register");
  const password = page.locator('input[name="password"]');
  await expect(password).toHaveAttribute("minlength", "10");
  await expect(password).toHaveAttribute("pattern", "(?=.*[A-Z])(?=.*\\d).{10,}");
  await expect(page.getByText("Requis : 10 caractères minimum, une majuscule et un chiffre.")).toBeVisible();

  const response = await request.post("/api/register", { data: { name: "Touba Expert Group", email: "toubainfoshd@gmail.com", password: "tropcourt" } });
  expect(response.status()).toBe(400);
  await expect(response.json()).resolves.toMatchObject({ error: "Le mot de passe doit contenir au moins 10 caractères, une majuscule et un chiffre." });
});

test("legal and trust pages are publicly accessible", async ({ page }) => {
  for (const path of ["/securite", "/confidentialite", "/conditions", "/mentions-legales"]) {
    const response = await page.goto(path);
    expect(response?.ok()).toBe(true);
    await expect(page.getByRole("link", { name: "Retour au site" })).toBeVisible();
  }
});

test("registration and onboarding reach the dashboard", async ({ page }) => {
  await page.goto("/register");
  await expect(page).toHaveTitle(/INTELLIGENCE IMMOBILIER/);
  await page.getByLabel("Nom complet").fill("Mamadou Kane");
  await page.getByLabel("Adresse email").fill("mamadou@example.invalid");
  await page.locator('input[name="password"]').fill("IntelImmo2026!");
  await page.getByRole("button", { name: "Créer mon espace" }).click();
  await expect(page).toHaveURL(/onboarding/);
  await page.getByRole("button", { name: /Continuer/ }).click();
  await page.getByRole("button", { name: /Continuer/ }).click();
  await page.getByRole("button", { name: /Continuer/ }).click();
  await page.getByRole("button", { name: /Continuer/ }).click();
  await page.getByRole("button", { name: /Ouvrir mon dashboard/ }).click();
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole("heading", { name: /Bonjour Mamadou/ })).toBeVisible();
});

test("property and maintenance entry forms confirm saves", async ({ page }) => {
  await page.goto("/properties");
  await page.getByRole("button", { name: /Ajouter un bien/ }).click();
  await page.getByPlaceholder("Ex. Appartement Ouakam A1").fill("Appartement Ouakam C4");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText(/enregistré avec succès/)).toBeVisible();
  await page.goto("/maintenance");
  await page.getByRole("button", { name: /Nouveau ticket/ }).click();
  await page.getByPlaceholder("Saisir une valeur").fill("Climatisation en panne");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText(/enregistré avec succès/)).toBeVisible();
});

test("payment receipt workflow reserves a unique receipt", async ({ page }) => {
  await page.goto("/payments");
  await page.getByRole("button", { name: /Générer la quittance PAY-2026-0821/ }).click();
  await expect(page.getByText("N° QUIT-2026-0821")).toBeVisible();
  await page.getByRole("button", { name: /Générer le PDF/ }).click();
  await expect(page.getByText(/numéro unique réservé/)).toBeVisible();
});

test("CSV import supports preview, mapping and validation", async ({ page }) => {
  await page.goto("/import");
  await page.locator('input[type="file"]').setInputFiles({ name: "biens.csv", mimeType: "text/csv", buffer: Buffer.from("Nom;Type;Adresse;Loyer\nVilla Test;Villa;Ouakam;750000") });
  await expect(page.getByText("1 lignes détectées")).toBeVisible();
  await page.getByRole("button", { name: /Configurer le mapping/ }).click();
  await page.getByRole("button", { name: /Valider les données/ }).click();
  await page.getByRole("button", { name: /Lancer l’import/ }).click();
  await expect(page.getByRole("heading", { name: "Import terminé" })).toBeVisible();
});

test("document library uploads, views and downloads a real PDF", async ({ page }, testInfo) => {
  const screenshotDirectory = path.join(process.cwd(), "artifacts", "document-upload");
  await mkdir(screenshotDirectory, { recursive: true });
  await page.goto("/properties/PROP-004");
  await page.getByRole("navigation", { name: "Sections de la fiche" }).getByRole("link", { name: "Documents", exact: true }).click();
  await page.getByRole("button", { name: "Ajouter un document" }).click();
  const dialog = page.getByRole("dialog", { name: "Ajouter un document" });
  await dialog.locator('input[type="file"]').setInputFiles("fixtures/documents/sample-property-document.pdf");
  await dialog.getByLabel("Nom du document").fill("Permis de construire fictif");
  await dialog.getByLabel("Catégorie").selectOption("Administratif");
  await dialog.screenshot({ path: path.join(screenshotDirectory, `dialog-${testInfo.project.name}.jpg`), type: "jpeg", quality: 84 });
  await dialog.getByRole("button", { name: "Ajouter le document" }).click();
  await expect(page.getByText("Document téléversé avec succès")).toBeVisible();
  const row = page.locator(".document-library .data-row").filter({ hasText: "Permis de construire fictif" }).first();
  await expect(row).toBeVisible();
  await page.locator(".resource-documents").screenshot({ path: path.join(screenshotDirectory, `library-${testInfo.project.name}.jpg`), type: "jpeg", quality: 82 });

  const viewPromise = page.waitForResponse((response) => response.url().includes(`/api/documents/`) && response.url().includes("signed-url?disposition=inline"));
  await row.getByRole("button", { name: /Voir/ }).click();
  const viewResult = await (await viewPromise).json() as { url: string };
  const viewerResponse = await page.request.get(viewResult.url);
  expect(viewerResponse.ok()).toBe(true);
  expect(viewerResponse.headers()["content-type"]).toContain("application/pdf");

  const downloadPromise = page.waitForResponse((response) => response.url().includes(`/api/documents/`) && response.url().includes("signed-url?disposition=attachment"));
  await row.getByRole("button", { name: /Télécharger/ }).click();
  const downloadResult = await (await downloadPromise).json() as { url: string };
  const downloadResponse = await page.request.get(downloadResult.url);
  expect(downloadResponse.ok()).toBe(true);
  expect(downloadResponse.headers()["content-disposition"]).toContain("attachment");
});
