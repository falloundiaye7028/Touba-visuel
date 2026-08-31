import { expect, test } from "@playwright/test";

test("registration and onboarding reach the dashboard", async ({ page }) => {
  await page.goto("/register");
  await expect(page).toHaveTitle(/IntelligenceImmobilier/);
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
